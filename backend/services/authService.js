import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isMongoConnected } from '../config/database.js';
import { jsonUserStore } from '../store/jsonUserStore.js';

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'emergency_boot_dev_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const authService = {
  async register({ fullName, email, mobileNumber, password, confirmPassword }) {
    if (!fullName || !email || !mobileNumber || !password || !confirmPassword) {
      throw Object.assign(new Error('Please provide all required fields'), { status: 400 });
    }
    if (password !== confirmPassword) {
      throw Object.assign(new Error('Passwords do not match'), { status: 400 });
    }
    if (password.length < 6) {
      throw Object.assign(new Error('Password must be at least 6 characters'), { status: 400 });
    }

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ $or: [{ email }, { mobileNumber }] });
      if (existingUser) {
        throw Object.assign(new Error('User already exists with this email or phone'), { status: 400 });
      }
      const user = await User.create({ fullName, email, mobileNumber, password });
      const token = generateToken(user._id, user.role);
      return {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
        },
      };
    }

    const existing = await jsonUserStore.findByEmailOrMobile(email, mobileNumber);
    if (existing) {
      throw Object.assign(new Error('User already exists with this email or phone'), { status: 400 });
    }
    const user = await jsonUserStore.create({ fullName, email, mobileNumber, password });
    const token = generateToken(user.id, user.role);
    return { token, user };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw Object.assign(new Error('Please provide email and password'), { status: 400 });
    }

    if (isMongoConnected()) {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.matchPassword(password))) {
        throw Object.assign(new Error('Invalid credentials'), { status: 401 });
      }
      user.lastLogin = new Date();
      await user.save();
      const token = generateToken(user._id, user.role);
      return {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
        },
      };
    }

    const user = await jsonUserStore.findByEmail(email);
    if (!user || !(await jsonUserStore.matchPassword(user, password))) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    await jsonUserStore.updateLastLogin(user.id);
    const token = generateToken(user.id, user.role);
    return { token, user: { id: user.id, fullName: user.fullName, email: user.email, mobileNumber: user.mobileNumber, role: user.role } };
  },

  async getMe(userId) {
    if (isMongoConnected()) {
      return User.findById(userId);
    }
    return jsonUserStore.findById(userId);
  },

  generateToken,
};
