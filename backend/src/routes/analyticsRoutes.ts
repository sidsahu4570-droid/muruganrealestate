import { Router } from 'express';
import { getDashboardSummary, getAnalyticsGraphs, exportReports } from '../controllers/analyticsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/summary', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getDashboardSummary);
router.get('/graphs', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), getAnalyticsGraphs);
router.get('/export', authenticate, authorize(['super_admin', 'admin', 'sales_executive']), exportReports);

export default router;
