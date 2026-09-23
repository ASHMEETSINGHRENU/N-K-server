import { Router } from 'express';
import {
  handleGetNotifications,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleSendNotification
} from '../../controllers/notifications/notification.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', handleGetNotifications);
router.patch('/:id/read', handleMarkAsRead);
router.patch('/read-all', handleMarkAllAsRead);
router.post('/send', handleSendNotification);

export default router;
