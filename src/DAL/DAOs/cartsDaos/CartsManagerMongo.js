import mongoose from 'mongoose';
import { cartsModel } from '../../mongoDB/models/carts.model.js';
import { productManager } from '../productsDaos/ProductsManagerMongo.js';
import BasicManager from '../basicDaos/BasicManager.js';
import CustomError from '../../../services/errors/CustomError.js';
export default class CartManager extends BasicManager {
  constructor(model) {
    super(model);
  }

  findOneByIdPopulated = async (id) => {
    const cart = await cartsModel.findOne({ _id: id }).populate('products.product');
    return cart;
  };

  async createOne() {
    const newCarts = await cartsModel.create({ products: [] });
    return newCarts;
  }

  addProductsToCart = async (cid, pid) => {
    const cart = await cartsModel.findById(cid);
    if (!cart) {
      CustomError.createCustomError({
        message: ErrorMessage.CART_NOT_FOUND,
        status: 404,
      });
    } else {
      const prod = await productManager.findOneById(pid);
      if (!prod) {
        CustomError.createCustomError({
          message: ErrorMessage.PRODUCT_NOT_FOUND,
          status: 404,
        });
      }
      const productItem = cart.products.find((p) => p.product.equals(pid));
      if (!productItem) {
        cart.products.push({
          product: new mongoose.Types.ObjectId(pid),
          quantity: 1,
        });
      } else {
        productItem.quantity++;
      }
      await cartsModel.findOneAndUpdate({ _id: cid }, cart);
      return cart;
    }
  };

  deleteProductFromCart = async (cid, pid) => {
    const cart = await cartsModel.findById(cid);

    if (!cart) {
      throw new Error("Error: Cart doesn't exist");
    }
    cart.products = cart.products.filter(({ product }) => !product.equals(pid));
    await cart.save();
    return cart;
  };

  updateCartProduct = async (id, pid, quantity) => {
    const cart = await cartsModel.findOne({ _id: id });
    const product = cart.products.find(({ product }) => product.equals(pid));
    if (product) {
      product.quantity = quantity;
      await cart.save();
    }
    return cart;
  };

  deleteAllProductsFromCart = async (id) => {
    const cart = await cartsModel.findById(id);
    if (!cart) {
      throw new Error("Error: Cart doesn't exist");
    }
    cart.products = [];
    await cart.save();
    return cart;
  };
}

export const cartManager = new CartManager(cartsModel);
