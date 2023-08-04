import CustomError from '../services/errors/CustomError.js';
import { ErrorMessage } from '../services/errors/error.enum.js';
import {
  createOneProduct,
  deleteAllProducts,
  deleteOneProduct,
  findAllProducts,
  findProductById,
  updateOneProduct,
} from '../services/products.services.js';
import { validateBoolean, validateInteger, validateSort } from '../utils/utils.js';

export const getProducts = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, category, availability } = req.query;

    if (!validateInteger(limit, 1, 200)) {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_LIMIT,
        status: 400,
      });
    }
    if (!validateInteger(page, 1, 10000)) {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_PAGE,
        status: 400,
      });
    }

    if (availability && !validateBoolean(availability)) {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_AVAILABILITY,
        status: 400,
      });
    }

    let { sort } = req.query;
    sort = sort?.toLowerCase();
    if (sort && !validateSort(sort)) {
      CustomError.createCustomError({
        message: ErrorMessage.WRONG_SORT,
        status: 400,
      });
    }

    const { docs, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await findAllProducts(
      parseInt(limit),
      parseInt(page),
      sort,
      category,
      availability
    );

    let prevLink = null;
    if (hasPrevPage) {
      prevLink = `/api/products?limit=${limit}&page=${prevPage}&`;
      if (availability) {
        prevLink += `availability=${availability}&`;
      }
      if (category) {
        prevLink += `category=${category}&`;
      }
      if (sort) {
        prevLink += `sort=${sort}`;
      }
    }

    let nextLink = null;
    if (hasNextPage) {
      nextLink = `/api/products?limit=${limit}&page=${nextPage}&`;
      if (availability) {
        prevLink += `availability=${availability}&`;
      }
      if (category) {
        nextLink += `category=${category}&`;
      }
      if (sort) {
        nextLink += `sort=${sort}`;
      }
    }

    const response = {
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await findProductById(pid);
    if (!product) {
      CustomError.createCustomError({
        message: ErrorMessage.PRODUCT_NOT_FOUND,
        status: 404,
      });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    next(error);
  }
};

export const addProducts = async (req, res, next) => {
  try {
    const obj = req.body;
    obj.owner = req.user.email;
    const newProduct = await createOneProduct(obj);
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const obj = req.body;
    const product = await updateOneProduct(pid, obj);
    res.status(201).json({ product });
  } catch (error) {
    next(error);
  }
};

export const deleteProducts = async (req, res, next) => {
  try {
    const response = await deleteAllProducts();
    res.status(200).json({ response });
  } catch (error) {
    next(error);
  }
};

export const deleteProductsById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const products = await deleteOneProduct(pid);
    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};
