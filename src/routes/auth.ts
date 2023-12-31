import { Router } from 'express';

import controller from '../controllers/auth';
import { authMiddleware, uploadMiddleware } from '@middlewares';

const router = Router();

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/logout', authMiddleware, controller.logout);

router.get('/current', authMiddleware, controller.current);

router.get('/verify/:verificationToken', controller.verify);

router.post('/verify', controller.resend);

router.patch(
  '/avatars',
  authMiddleware,
  uploadMiddleware.single('avatar'),
  controller.updateAvatar
);

export default router;
