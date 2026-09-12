import { Router } from 'express';
import { handleGetAdminAnalytics, handleGetBrokerAnalytics, handleGetAuditLogs } from '../../controllers/analytics/analytics.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.get('/admin', authenticate, authorize('ADMIN'), handleGetAdminAnalytics);
router.get('/broker', authenticate, authorize('BROKER'), handleGetBrokerAnalytics);
router.get('/audit-logs', authenticate, authorize('ADMIN'), handleGetAuditLogs);

export default router;
