import { Router } from 'express';
import {
  handleGetInsights,
  handleGetInsightBySlug,
  handleCreateInsight,
  handleUpdateInsight,
  handleDeleteInsight
} from '../../controllers/insights/insight.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public routes
router.get('/', handleGetInsights);
router.get('/:slug', handleGetInsightBySlug);

// Admin CMS routes
router.post('/', authenticate, authorize('ADMIN'), handleCreateInsight);
router.put('/:id', authenticate, authorize('ADMIN'), handleUpdateInsight);
router.delete('/:id', authenticate, authorize('ADMIN'), handleDeleteInsight);

export default router;
