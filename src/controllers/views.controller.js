import { cartManager } from '../DAL/DAOs/cartsDaos/CartsManagerMongo.js';
import { productManager } from '../DAL/DAOs/productsDaos/ProductsManagerMongo.js';

export const getHome = async (req, res, next) => {
  try {
    const products = await productManager.findAll(100, 0, undefined, undefined, undefined, true);
    res.render('home', { products: products.docs });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { limit = 5, page = 0 } = req.query;
    const products = await productManager.findAll(limit, page, undefined, undefined, undefined, true);
    res.render('products', {
      products: products.docs,
      nextPage: products.nextPage,
      prevPage: products.prevPage,
      hasNextPage: products.hasNextPage,
      hasPrevPage: products.hasPrevPage,
      cartId: req.user.cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getRealTimeProducts = async (req, res, next) => {
  try {
    const products = await productManager.findAll(100, 0, undefined, undefined, undefined, true);
    if (req.user == undefined) {
      res.render('realTimeProducts', { products: products.docs });
    } else {
      res.render('realTimeProducts', { products: products.docs, firstName: req.user.firstName });
    }
  } catch (error) {
    next(error);
  }
};

export const getChat = async (req, res) => {
  res.render('chat');
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartManager.findOneByIdPopulated(req.user.cart);
    cart.products.forEach((item) => (item.total = item.quantity * item.product.price));
    res.render('cart', {
      cartId: req.user.cart,
      cartItems: cart.products.map((item) => ({
        productId: item.product._id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        stock: item.product.stock,
      })),
      cartTotal: cart.products.reduce((acc, curr) => (acc += curr.total), 0),
    });
  } catch (error) {
    next(error);
  }
};
