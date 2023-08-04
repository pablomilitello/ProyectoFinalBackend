import {
  cartById,
  cartByIdPopulated,
  createOne,
  deleteAllProducts,
  deleteProduct,
  productsToCart,
  purchaseCart,
  updateOne,
  updateOneProduct,
} from '../services/carts.services.js';
import CustomError from '../services/errors/CustomError.js';
import { ErrorMessage } from '../services/errors/error.enum.js';

export const getCartByIdPopulated = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartByIdPopulated(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    } else {
      res.status(200).json(cart);
    }
  } catch (error) {
    next(error);
  }
};

export const addCarts = async (req, res) => {
  try {
    const newCart = await createOne();
    res.status(201).json({ message: 'Cart created', cart: newCart });
  } catch (error) {
    next(error);
  }
};

export const addProductsToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const newCart = await productsToCart(cid, pid);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const deleteProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartById(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    }
    const newCart = await deleteProduct(cid, pid);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const deleteAllProductsFromCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartById(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    }
    const newCart = await deleteAllProducts(cid);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartById(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    }
    const products = req.body;
    if (!Array.isArray(products)) {
      CustomError.createCustomError({
        message: ErrorMessage.PRODUCT_ARRAY,
        status: 400,
      });
    }
    const newCart = await updateOne(cid, products);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const updateCartProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartById(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    }

    if (typeof req.body != 'object') {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_BODY,
        status: 400,
      });
    }
    const { quantity } = req.body;
    if (!Number.isInteger(quantity)) {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_QUANTITY,
        status: 400,
      });
    }
    const newCart = await updateOneProduct(cid, pid, quantity);
    res.status(200).json(newCart);
  } catch (error) {
    next(error);
  }
};

export const purchase = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartByIdPopulated(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    }
    const result = await purchaseCart(cart, req.user);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
