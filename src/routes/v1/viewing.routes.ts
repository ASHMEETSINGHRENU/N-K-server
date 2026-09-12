import { Router } from 'express';
import {
  handleGetViewings,
  handleCreateViewing,
  handleUpdateViewingStatus
} from '../../controllers/viewings/viewing.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('BROKER', 'ADMIN'));

router.get('/', handleGetViewings);
router.post('/', handleCreateViewing);
router.patch('/:id/status', handleUpdateViewingStatus);

export default router;
