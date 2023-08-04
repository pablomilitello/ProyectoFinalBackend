import UsersDB_DTO from '../DAL/DTOs/usersDB.dto.js';
import { userManager } from '../DAL/DAOs/usersDaos/UsersManagerMongo.js';
import { ROLE_ADMIN, ROLE_PREMIUM, ROLE_USER } from '../DAL/mongoDB/models/users.model.js';
import CustomError from '../services/errors/CustomError.js';

export const register = (req, res) => {
  res.render('register');
};

export const login = (req, res) => {
  res.render('login');
};

export const errorRegister = (req, res) => {
  res.render('errorRegister');
};

export const errorLogin = (req, res) => {
  res.render('errorLogin');
};

//Passport
export const passportRegister = (req, res) => {
  res.redirect('/register/login');
};

export const passportLogin = (req, res) => {
  res.redirect(`/views/realtimeproducts`);
};

export const passportLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/register/login');
  });
};

//Github
export const githubAuthenticate = (req, res) => {
  res.redirect('/views/realtimeproducts');
};

export const currentSession = (req, res) => {
  if (!req.user) {
    CustomError.createCustomError({
      message: ErrorMessage.SESSION_EXPIRED,
      status: 400,
    });
  }
  const user = { ...req.user._doc };
  delete user.password;
  res.json(user);
};

export const togglePremium = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userManager.findOneById(uid);
    if (user.role === ROLE_ADMIN) {
      CustomError.createCustomError({
        message: 'Admin cannot be premium',
        status: 400,
      });
    }

    user.role = user.role === ROLE_USER ? ROLE_PREMIUM : ROLE_USER;
    await user.save();
    res.json(new UsersDB_DTO(user));
  } catch (error) {
    next(error);
  }
};

export const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      CustomError.createCustomError({
        message: 'Could not save image',
        status: 400,
      });
    }
    const { uid } = req.params;
    const user = await userManager.findOneById(uid);
    const newDocuments = req.files.map((file) => ({
      name: file.originalname,
      reference: file.path,
    }));
    user.documents = [...user.documents, ...newDocuments];
    await user.save();
    res.send({ message: 'Files saved' });
  } catch (error) {
    next(error);
  }
};
