import { Router } from 'express';
import { createEnquiry, getEnquiries, replyToEnquiry, deleteEnquiry } from '../controllers/enquiryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', createEnquiry);
router.get('/', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getEnquiries);
router.post('/:id/reply', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), replyToEnquiry);
router.delete('/:id', authenticate, authorize(['super_admin', 'admin']), deleteEnquiry);

export default router;
