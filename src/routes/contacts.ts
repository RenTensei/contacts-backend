import { Router } from 'express';

import controller from '../controllers/contacts';
import { authMiddleware, validIdMiddleware } from '@middlewares';

const router = Router();

router.get('/', authMiddleware, controller.getAll);

router.get('/:contactId', authMiddleware, validIdMiddleware, controller.getById);

router.post('/', authMiddleware, controller.post);

router.put('/:contactId', authMiddleware, validIdMiddleware, controller.putById);

router.patch('/:contactId', authMiddleware, validIdMiddleware, controller.patchById);

router.delete('/:contactId', authMiddleware, validIdMiddleware, controller.deleteById);

export default router;
