import { Router } from 'express';
import passport from 'passport';

import {
  currentSession,
  errorLogin,
  errorRegister,
  githubAuthenticate,
  login,
  passportLogin,
  passportLogout,
  passportRegister,
  register,
} from '../controllers/users.controller.js';
import { changePass, changePassPage, recover, recoverPage } from '../controllers/recovery.controller.js';

const router = Router();

router.get('/', register);
router.get('/login', login);
router.get('/errorRegister', errorRegister);
router.get('/errorLogin', errorLogin);

//Passport
router.post('/', passport.authenticate('register', { failureRedirect: '/register/errorRegister' }), passportRegister);
router.post('/login', passport.authenticate('login', { failureRedirect: '/register/errorLogin' }), passportLogin);
router.post('/logout', passportLogout);

//Github
router.get(
  '/signupGithub',
  passport.authenticate('github', {
    scope: ['user:email'],
    failureRedirect: '/register/errorRegister',
  })
);
router.get('/github', passport.authenticate('github', { failureRedirect: '/register/errorLogin' }), githubAuthenticate);

router.get('/current', currentSession);

//Recover password
router.get('/recoverPage', recoverPage);
router.get('/changePassPage', changePassPage);
router.post('/recover', recover);
router.post('/changePass', changePass);

export default router;
