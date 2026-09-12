import { Router } from 'express';
import {
  handleGetProperties,
  handleGetFeaturedProperties,
  handleGetNewLaunches,
  handleGetPropertyBySlug,
  handleCreateProperty,
  handleUpdateProperty,
  handleUpdatePropertyStatus,
  handleDeleteProperty
} from '../../controllers/properties/property.controller.js';
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Public routes
router.get('/', optionalAuthenticate, handleGetProperties);
router.get('/featured', handleGetFeaturedProperties);
router.get('/new-launches', handleGetNewLaunches);
router.get('/:slug', handleGetPropertyBySlug);

// Protected routes (Broker / Admin)
router.post('/', authenticate, authorize('BROKER', 'ADMIN'), handleCreateProperty);
router.put('/:id', authenticate, authorize('BROKER', 'ADMIN'), handleUpdateProperty);
router.patch('/:id/status', authenticate, authorize('ADMIN'), handleUpdatePropertyStatus);
router.delete('/:id', authenticate, authorize('ADMIN'), handleDeleteProperty);

export default router;
