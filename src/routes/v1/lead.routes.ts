import { Router } from 'express';
import {
  handleCreateLead,
  handleGetLeads,
  handleGetMyLeads,
  handleGetLeadById,
  handleUpdateLeadStatus,
  handleAddLeadNote,
  handleAssignLead
} from '../../controllers/leads/lead.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { leadCaptureLimiter } from '../../middleware/rateLimiter.js';
import { privacyFilter } from '../../middleware/privacyFilter.js';

const router = Router();

// Public lead submission (Protected by rate limiter)
router.post('/', leadCaptureLimiter, handleCreateLead);

// Authenticated client's own inquiries
router.get('/my', authenticate, handleGetMyLeads);

// Protected routes (Broker and Admin only)
router.get('/', authenticate, authorize('BROKER', 'ADMIN'), privacyFilter, handleGetLeads);
router.get('/:id', authenticate, authorize('BROKER', 'ADMIN'), privacyFilter, handleGetLeadById);
router.patch('/:id/status', authenticate, authorize('BROKER', 'ADMIN'), handleUpdateLeadStatus);
router.post('/:id/notes', authenticate, authorize('BROKER', 'ADMIN'), handleAddLeadNote);
router.patch('/:id/assign', authenticate, authorize('ADMIN'), handleAssignLead);

export default router;
