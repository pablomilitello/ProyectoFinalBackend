import { Router } from 'express';
import { getCurrentSession } from '../controllers/sessions.controller.js';

const router = Router();

router.get('/current', getCurrentSession);

export default router;
