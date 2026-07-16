import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', authenticate, authorize(['super_admin', 'admin']), updateSettings);

export default router;
