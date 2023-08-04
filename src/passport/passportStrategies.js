import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ROLE_ADMIN, userModel } from '../DAL/mongoDB/models/users.model.js';
import { compareData, hashData } from '../utils/utils.js';
import UsersManager from '../DAL/DAOs/usersDaos/UsersManagerMongo.js';
import CartManager from '../DAL/DAOs/cartsDaos/CartsManagerMongo.js';
import { ADMIN_EMAIL, GITHUB_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '../config.js';

const usersManager = new UsersManager();
const cartManager = new CartManager();

//Local Strategy
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      const user = await usersManager.findByEmail(email);
      if (!user || !user.password) {
        return done(null, false);
      }
      const isPassword = await compareData(password, user.password);
      if (!isPassword) {
        return done(null, false);
      }
      user.last_connection = new Date();
      await user.save();
      done(null, user);
    }
  )
);

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'email',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userDB = await userModel.findOne({ email });
      if (userDB) {
        return done(null, false);
      }
      const hashPassword = await hashData(password);
      const newCart = await cartManager.createOne();
      const newUser = { ...req.body, password: hashPassword, cart: newCart.id };
      if (email === ADMIN_EMAIL) {
        newUser.role = ROLE_ADMIN;
      }
      const newUserDB = await userModel.create(newUser);
      done(null, newUserDB);
    }
  )
);

//Github Strategy
passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile._json.email;
        const userDB = await userModel.findOne({ email });
        if (userDB) {
          userDB.last_connection = new Date();
          await userDB.save();
          return done(null, userDB);
        }
        const newCart = await cartManager.createOne();
        const newUser = {
          firstName: profile._json.name.split(' ')[0],
          lastName: profile._json.name.split(' ')[1] || '',
          email,
          cart: newCart.id,
        };
        const newUserDB = await userModel.create(newUser);
        newUserDB.last_connection = new Date();
        await newUserDB.save();
        done(null, newUserDB);
      } catch (e) {
        console.error(e);
        done(null, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    done(error);
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
