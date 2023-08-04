import { ROLE_ADMIN, ROLE_PREMIUM, ROLE_USER } from '../DAL/mongoDB/models/users.model.js';
import { findProductById } from '../services/products.services.js';

export const authUser = (req, res, next) => {
  if (!req.user) {
    res.status(401).json('Session expired');
    return;
  }
  if (req.user.role === ROLE_USER) {
    next();
  } else {
    res.status(403).end();
  }
};

export const authAdmin = (req, res, next) => {
  if (!req.user) {
    res.status(401).json('Session expired');
    return;
  }
  if (req.user.role === ROLE_ADMIN) {
    next();
  } else {
    res.status(403).end();
  }
};

export const authPremium = (req, res, next) => {
  if (!req.user) {
    res.status(401).json('Session expired');
    return;
  }
  if (req.user.role === ROLE_PREMIUM) {
    next();
  } else {
    res.status(403).end();
  }
};

export const authRoles = (roles) => (req, res, next) => {
  if (!req.user) {
    res.status(401).json('Session expired');
    return;
  }
  if (roles.includes(req.user.role)) {
    next();
  } else {
    res.status(403).end();
  }
};

export const authProductOwnerOrAdmin = async (req, res, next) => {
  try {
    const { role, email } = req.user;
    if (role === ROLE_ADMIN) {
      next();
      return;
    } else if (role === ROLE_PREMIUM) {
      const { pid } = req.params;
      const product = await findProductById(pid);
      if (!product) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      if (product.owner === email) {
        next();
        return;
      }
    }
    res.status(403).end();
  } catch (error) {
    next(error);
  }
};

export const authPremiumUserAddToCart = async (req, res, next) => {
  try {
    const { role, email } = req.user;
    if (role === ROLE_PREMIUM) {
      const { pid } = req.params;
      const product = await findProductById(pid);
      if (!product) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      if (product.owner === email) {
        res.status(403).end();
        return;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const authOwnResource = (req, res, next) => {
  if (!req.user) {
    res.status(401).json('Session expired');
    return;
  }
  const { uid } = req.params;
  if (uid === req.user._id.toString()) {
    next();
  } else {
    res.status(403).end();
  }
};
