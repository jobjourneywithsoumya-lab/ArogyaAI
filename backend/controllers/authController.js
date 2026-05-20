import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authService } from '../services/authService.js';
import { isMongoConnected } from '../config/database.js';
import { jsonUserStore } from '../store/jsonUserStore.js';
import { sendRegistrationWelcome } from '../services/notifyService.js';

// In-memory CAPTCHA & OTP store (demo)
const captchaStore = new Map();
const otpStore = new Map();

const handleError = (res, error) => {
  const status = error.status || 500;
  res.status(status).json({ success: false, message: error.message });
};

// @desc    Register user
export const register = async (req, res) => {
  try {
    const { captchaId, captchaAnswer } = req.body;
    const captcha = captchaStore.get(captchaId);
    if (!captcha || captcha.answer !== String(captchaAnswer).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid CAPTCHA. Please try again.' });
    }
    captchaStore.delete(captchaId);

    const { token, user } = await authService.register(req.body);

    sendRegistrationWelcome({
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
    }).catch((err) => console.error('Welcome notification error:', err));

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Welcome email & SMS sent.',
      token,
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { captchaId, captchaAnswer } = req.body;
    const captcha = captchaStore.get(captchaId);
    if (!captcha || captcha.answer !== String(captchaAnswer).trim()) {
      return res.status(400).json({ success: false, message: 'Invalid CAPTCHA. Please try again.' });
    }
    captchaStore.delete(captchaId);

    const { token, user } = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(501).json({ success: false, message: 'Profile update requires MongoDB' });
    }
    const { fullName, dateOfBirth, gender, bloodGroup, address, emergencyContact } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, dateOfBirth, gender, bloodGroup, address, emergencyContact },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, message: 'Profile updated successfully', data: user });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp || otp.toString().length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    const stored = otpStore.get(`email:${email}`);
    if (stored && stored !== otp.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (isMongoConnected()) {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.isEmailVerified = true;
      await user.save();
    } else {
      const user = await jsonUserStore.findByEmail(email);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      await jsonUserStore.setVerified(user.id, 'isEmailVerified');
    }
    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const verifyMobile = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;
    if (!otp || otp.toString().length !== 6) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (isMongoConnected()) {
      const user = await User.findOne({ mobileNumber });
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.isMobileVerified = true;
      await user.save();
    } else {
      const user = await jsonUserStore.findByEmailOrMobile('__none__', mobileNumber);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      await jsonUserStore.setVerified(user.id, 'isMobileVerified');
    }
    res.status(200).json({ success: true, message: 'Mobile number verified successfully' });
  } catch (error) {
    handleError(res, error);
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (email) otpStore.set(`email:${email}`, otp);
    if (mobileNumber) otpStore.set(`mobile:${mobileNumber}`, otp);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully (demo mode)',
      otp, // demo only — remove in production
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getCaptcha = async (req, res) => {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const id = Math.random().toString(36).slice(2, 12);
  captchaStore.set(id, { answer: String(a + b), expires: Date.now() + 300000 });
  res.json({ success: true, captchaId: id, question: `${a} + ${b} = ?` });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user;
    if (isMongoConnected()) {
      user = await User.findOne({ email });
    } else {
      user = await jsonUserStore.findByEmail(email);
    }
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const id = user._id || user.id;
    const role = user.role || 'user';
    const resetToken = authService.generateToken(id, role);
    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email (demo: token returned)',
      resetToken,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Invalid token' });
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'emergency_boot_dev_secret');
    if (isMongoConnected()) {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      user.password = newPassword;
      await user.save();
    } else {
      const ok = await jsonUserStore.updatePassword(decoded.id, newPassword);
      if (!ok) return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    handleError(res, error);
  }
};
