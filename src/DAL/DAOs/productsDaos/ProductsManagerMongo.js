import { productModel } from '../../mongoDB/models/products.model.js';
import { TRUE, FALSE } from '../../../utils/utils.js';
import BasicManager from '../basicDaos/BasicManager.js';

export default class ProductManager extends BasicManager {
  constructor(model) {
    super(model);
  }

  findAll = async (limit, page, sort, category, availability, lean = false) => {
    const options = { page, limit, lean };
    if (sort) {
      options.sort = { price: sortDir };
    }
    const query = {};
    if (category) {
      query.category = { $regex: new RegExp(`${category}`, 'i') };
    }

    if (availability === TRUE) {
      query.stock = { $gt: 0 };
    } else if (availability === FALSE) {
      query.stock = 0;
    }
    const products = await productModel.paginate(query, options);
    return products;
  };

  aggregationFun = async () => {
    const response = await productModel.aggregate();
    return response;
  };

  deleteAll = async () => {
    await productModel.deleteMany();
    return 'Products deleted';
  };
}

export const productManager = new ProductManager(productModel);
