import { Router } from 'express';
import {
  handleGetCommissions,
  handleCreateCommission,
  handleUpdateCommissionStatus
} from '../../controllers/commissions/commission.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('BROKER', 'ADMIN'));

router.get('/', handleGetCommissions);
router.post('/', handleCreateCommission);
router.patch('/:id/status', authorize('ADMIN'), handleUpdateCommissionStatus);

export default router;
