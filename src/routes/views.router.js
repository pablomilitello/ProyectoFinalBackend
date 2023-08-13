import { Router } from 'express';
import { getCart, getChat, getHome, getProducts, getRealTimeProducts } from '../controllers/views.controller.js';
import { authUser } from '../middlewares/auth.js';

const router = Router();

router.get('/', getHome);
router.get('/cart', getCart);
router.get('/products', getProducts);
router.get('/realtimeproducts', getRealTimeProducts);
router.get('/chat', authUser, getChat);

export default router;
