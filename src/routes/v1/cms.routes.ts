import { Router } from 'express';
import {
  handleGetWebsiteContent,
  handleUpdateWebsiteContent,
  handleGetCommunities,
  handleGetCommunityBySlug,
  handleCreateCommunity,
  handleUpdateCommunity,
  handleDeleteCommunity,
  handleGetDevelopers,
  handleGetDeveloperBySlug,
  handleCreateDeveloper,
  handleUpdateDeveloper,
  handleDeleteDeveloper,
  handleGetLocations
} from '../../controllers/cms/cms.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public CMS data
router.get('/website', handleGetWebsiteContent);
router.get('/communities', handleGetCommunities);
router.get('/communities/:slug', handleGetCommunityBySlug);
router.get('/developers', handleGetDevelopers);
router.get('/developers/:slug', handleGetDeveloperBySlug);
router.get('/locations', handleGetLocations);

// Admin CMS updates
router.put('/website', authenticate, authorize('ADMIN'), handleUpdateWebsiteContent);

// Admin Communities
router.post('/communities', authenticate, authorize('ADMIN'), handleCreateCommunity);
router.put('/communities/:id', authenticate, authorize('ADMIN'), handleUpdateCommunity);
router.delete('/communities/:id', authenticate, authorize('ADMIN'), handleDeleteCommunity);

// Admin Developers
router.post('/developers', authenticate, authorize('ADMIN'), handleCreateDeveloper);
router.put('/developers/:id', authenticate, authorize('ADMIN'), handleUpdateDeveloper);
router.delete('/developers/:id', authenticate, authorize('ADMIN'), handleDeleteDeveloper);

export default router;
