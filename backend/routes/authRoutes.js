import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  verifyEmail,
  verifyMobile,
  forgotPassword,
  resetPassword,
  sendOtp,
  getCaptcha,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/captcha', getCaptcha);
router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.post('/verify-email', verifyEmail);
router.post('/verify-mobile', verifyMobile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
