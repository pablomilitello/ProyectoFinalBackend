import { productManager } from '../DAL/DAOs/productsDaos/ProductsManagerMongo.js';

export const findAllProducts = async (limit, page, sort, category, availability) => {
  const products = await productManager.findAll(limit, page, sort, category, availability);
  return products;
};

export const findProductById = async (id) => {
  const product = await productManager.findOneById(id);
  return product;
};

export const createOneProduct = async (obj) => {
  const newProduct = await productManager.createOne(obj);
  return newProduct;
};

export const updateOneProduct = async (pid, obj) => {
  const product = await productManager.updateOne(pid, obj);
  return product;
};

export const deleteAllProducts = async () => {
  const product = await productManager.deleteAll();
  return product;
};

export const deleteOneProduct = async (pid) => {
  const product = await productManager.deleteOne(pid);
  return product;
};
