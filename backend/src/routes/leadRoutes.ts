import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  addLeadNote,
  addLeadReminder,
  getSalesExecutives,
} from '../controllers/leadController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getLeads);
router.get('/executives', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getSalesExecutives);
router.get('/:id', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getLeadById);
router.post('/', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), createLead);
router.put('/:id', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), updateLead);
router.delete('/:id', authenticate, authorize(['super_admin', 'admin']), deleteLead);
router.post('/:id/notes', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), addLeadNote);
router.post('/:id/reminders', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), addLeadReminder);

export default router;
