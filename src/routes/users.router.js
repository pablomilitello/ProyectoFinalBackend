import { Router } from 'express';
import { togglePremium, uploadFiles } from '../controllers/users.controller.js';
import { uploader } from '../utils/utils.js';
import { authOwnResource } from '../middlewares/auth.js';

const router = Router();

router.post('/premium/:uid', togglePremium);
router.post('/:uid/documents', authOwnResource, uploader.array('files'), uploadFiles);

export default router;
