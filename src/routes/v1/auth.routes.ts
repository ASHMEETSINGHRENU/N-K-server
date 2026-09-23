import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleGetMe,
  handleGetUsers,
  handleUpdateUserStatus,
  handleUpdateProfile,
  handleChangePassword
} from '../../controllers/auth/auth.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { authLimiter } from '../../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, handleRegister);
router.post('/login', authLimiter, handleLogin);
router.get('/me', authenticate, handleGetMe);
router.put('/profile', authenticate, handleUpdateProfile);
router.post('/change-password', authenticate, handleChangePassword);

// Admin User Management
router.get('/users', authenticate, authorize('ADMIN'), handleGetUsers);
router.patch('/users/:id', authenticate, authorize('ADMIN'), handleUpdateUserStatus);

export default router;
