import { Router } from 'express';
import authRoutes from './auth.routes.js';
import propertyRoutes from './property.routes.js';
import brokerRoutes from './broker.routes.js';
import leadRoutes from './lead.routes.js';
import clientRoutes from './client.routes.js';
import viewingRoutes from './viewing.routes.js';
import commissionRoutes from './commission.routes.js';
import insightRoutes from './insight.routes.js';
import cmsRoutes from './cms.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/brokers', brokerRoutes);
router.use('/leads', leadRoutes);
router.use('/clients', clientRoutes);
router.use('/viewings', viewingRoutes);
router.use('/commissions', commissionRoutes);
router.use('/insights', insightRoutes);
router.use('/cms', cmsRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
