import { transporter } from '../utils/nodemailer.js';
import hbs from 'nodemailer-express-handlebars';
import { userManager } from '../DAL/DAOs/usersDaos/UsersManagerMongo.js';
import CustomError from '../services/errors/CustomError.js';
import { logger } from '../utils/winston.js';
import { ErrorMessage } from '../services/errors/error.enum.js';
import { __dirname, compareData, hashData } from '../utils/utils.js';
import path from 'path';

export const recoverPage = (req, res) => {
  res.render('recoverPage');
};

const isLessThanOneHourAgo = (timestamp) => {
  const hourInMs = 60 * 60 * 1000;
  const currentTimestamp = new Date().getTime();
  const diff = currentTimestamp - timestamp;
  return diff < hourInMs;
};

export const changePassPage = async (req, res) => {
  const { token, userId } = req.query;
  if (!token || !userId) {
    return res.status(400).end();
  }
  const user = await userManager.findOneById(userId);
  if (!user) {
    return res.status(400).end();
  }
  const timestamp = parseInt(Buffer.from(token, 'base64').toString('utf8'));
  if (!isLessThanOneHourAgo(timestamp)) {
    res.render('recoverPage');
    return;
  }
  res.render('changePassPage', { userId: user.id });
};

const resetPasswordLink = (userId) => {
  const baseUrl = 'http://localhost:8080/register';
  const token = encodeURIComponent(Buffer.from(new Date().getTime().toString()).toString('base64'));
  return `${baseUrl}/changePassPage?token=${token}&userId=${userId}`;
};

export const recover = async (req, res) => {
  const { email } = req.body;
  const user = await userManager.findByEmail(email);
  if (!user) {
    return;
  }

  //nodemailer transporter
  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extName: '.handlebars',
        partialsDir: path.resolve(__dirname, 'views'),
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, 'views'),
      extName: '.handlebars',
    })
  );
  //send mail with options
  let mail = {
    from: 'coderhousemailer@gmail.com',
    to: 'pmilitelloaveni@gmail.com',
    subject: 'Test',
    context: {
      firstName: user.firstName,
      lastName: user.lastName,
      link: resetPasswordLink(user.id),
    },
    template: 'changePassLink',
  };
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      CustomError.createCustomError({
        message: ErrorMessage.MAIL_NOT_SEND,
        status: 401,
      });
    } else {
      logger.info(`Message sent!!!`);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
};

export const changePass = async (req, res, next) => {
  try {
    const { userId, password } = req.body;
    if (!password || !userId) {
      return res.status(400).end();
    }
    const user = await userManager.findOneById(userId);
    if (!user) {
      return res.status(400).end();
    }
    if (await compareData(password, user.password)) {
      CustomError.createCustomError({
        message: "New password can't be the same as before",
        status: 400,
      });
    }
    user.password = await hashData(password);
    await user.save();
    res.redirect('/register/login');
  } catch (error) {
    next(error);
  }
};
