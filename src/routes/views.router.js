import { Router } from 'express';
import { getCart, getChat, getHome, getProducts, getManageProducts } from '../controllers/views.controller.js';
import { authAdmin, authUser } from '../middlewares/auth.js';
import { adminManager } from '../controllers/users.controller.js';

const router = Router();

router.get('/', getHome);
router.get('/cart', getCart);
router.get('/products', getProducts);
router.get('/users', authAdmin, adminManager);
router.get('/manageproducts', getManageProducts);
router.get('/chat', authUser, getChat);

export default router;
