import { Router } from 'express';
import {
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
} from '../controllers/authController';
import {
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from '../validators/authValidator';
import { validateRequest } from '../middleware/validators';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/security';

const router = Router();

router.post('/login', authLimiter, loginValidator, validateRequest, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, validateRequest, forgotPassword);
router.post('/reset-password', authLimiter, resetPasswordValidator, validateRequest, resetPassword);
router.post('/change-password', authenticate, changePasswordValidator, validateRequest, changePassword);
router.get('/me', authenticate, getCurrentUser);

export default router;
