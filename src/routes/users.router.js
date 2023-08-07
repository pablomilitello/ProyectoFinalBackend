import { Router } from 'express';
import {
  adminManager,
  deleteInactiveUsers,
  getAllUsers,
  togglePremium,
  uploadFiles,
} from '../controllers/users.controller.js';
import { uploader } from '../utils/utils.js';
import { authOwnResource } from '../middlewares/auth.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/admin', adminManager);
router.post('/premium/:uid', togglePremium);
router.post('/:uid/documents', authOwnResource, uploader.array('files'), uploadFiles);
router.delete('/', deleteInactiveUsers);

export default router;
