import { Router } from 'express';
import {
  getProperties,
  getPropertyBySlug,
  createProperty,
  updateProperty,
  deleteProperty,
  duplicateProperty,
} from '../controllers/propertyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getProperties);
router.get('/:slug', getPropertyBySlug);
router.post('/', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), createProperty);
router.put('/:id', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), updateProperty);
router.delete('/:id', authenticate, authorize(['super_admin', 'admin']), deleteProperty);
router.post('/:id/duplicate', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), duplicateProperty);

export default router;
