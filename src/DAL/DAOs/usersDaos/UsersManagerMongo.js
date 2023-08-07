import CustomError from '../../../services/errors/CustomError.js';
import { ErrorMessage } from '../../../services/errors/error.enum.js';
import { transporter } from '../../../utils/nodemailer.js';
import { userModel } from '../../mongoDB/models/users.model.js';
import BasicManager from '../basicDaos/BasicManager.js';
export default class UsersManager extends BasicManager {
  constructor(model) {
    super(model);
  }

  async findByEmail(email) {
    const user = await userModel.findOne({ email });
    return user;
  }

  async createOne(user) {
    const { email, password } = user;

    const existUser = await userModel.find({ email, password });
    if (existUser.length === 0) {
      const newUser = await userModel.create(user);
      return newUser;
    } else {
      return null;
    }
  }

  async deleteInactive() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    try {
      const usersToDelete = await userModel.find({ last_connection: { $lt: oneHourAgo } });
      if (usersToDelete) {
        let mail = {
          from: 'coderhousemailer@gmail.com',
          to: usersToDelete.email,
          subject: 'Account deleted',
          template: 'accountDeleted',
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
      }
      const result = await userModel.deleteMany({ last_connection: { $lt: oneHourAgo } });
      return result;
    } catch (err) {
      console.error('Error al borrar usuarios inactivos:', err);
      throw err;
    }
  }
}

export const userManager = new UsersManager(userModel);
