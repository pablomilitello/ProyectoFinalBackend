import { Router } from 'express';
import {
  addProducts,
  deleteProducts,
  deleteProductsById,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/products.controller.js';
import { authAdmin, authProductOwnerOrAdmin, authRoles } from '../middlewares/auth.js';
import { ROLE_ADMIN, ROLE_PREMIUM } from '../DAL/mongoDB/models/users.model.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', authRoles([ROLE_ADMIN, ROLE_PREMIUM]), addProducts);
router.put('/:pid', authProductOwnerOrAdmin, updateProduct);
router.delete('/:pid', authProductOwnerOrAdmin, deleteProductsById);
router.delete('/', authAdmin, deleteProducts);

export default router;
