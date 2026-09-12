import { Router } from 'express';
import {
  handleGetBrokers,
  handleGetAllBrokersAdmin,
  handleGetBrokerProfile,
  handleCreateBroker,
  handleUpdateBroker
} from '../../controllers/brokers/broker.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public broker directory
router.get('/', handleGetBrokers);

// Authenticated broker self profile
router.get('/profile', authenticate, authorize('BROKER'), handleGetBrokerProfile);

// Admin broker management
router.get('/admin/all', authenticate, authorize('ADMIN'), handleGetAllBrokersAdmin);
router.post('/', authenticate, authorize('ADMIN'), handleCreateBroker);
router.put('/:id', authenticate, authorize('ADMIN'), handleUpdateBroker);

export default router;
