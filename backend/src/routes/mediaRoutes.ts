import { Router } from 'express';
import multer from 'multer';
import { uploadMedia } from '../controllers/mediaController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), upload.array('files', 10), uploadMedia);

export default router;
