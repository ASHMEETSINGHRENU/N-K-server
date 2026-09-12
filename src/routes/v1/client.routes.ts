import { Router } from 'express';
import { handleGetClients, handleCreateClient, handleGetClientById } from '../../controllers/clients/client.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.use(authenticate, authorize('BROKER', 'ADMIN'));

router.get('/', handleGetClients);
router.post('/', handleCreateClient);
router.get('/:id', handleGetClientById);

export default router;
