import { Router } from 'express';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getTestimonials);
router.post('/', createTestimonial);
router.put('/:id', authenticate, authorize(['super_admin', 'admin']), updateTestimonial);
router.delete('/:id', authenticate, authorize(['super_admin', 'admin']), deleteTestimonial);

export default router;
