import { connectDB } from '../../backend/config/database.js';
import { authService } from '../../backend/services/authService.js';
import { sendRegistrationWelcome } from '../../backend/services/notifyService.js';

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await Promise.race([
      connectDB(),
      new Promise((resolve) => setTimeout(() => resolve(false), 4000)),
    ]);

    const { token, user } = await authService.register(req.body);

    sendRegistrationWelcome({
      fullName: user.fullName,
      email: user.email,
      mobileNumber: user.mobileNumber,
    }).catch((err) => console.error('Welcome notification:', err));

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Welcome email & SMS sent.',
      token,
      user,
      storage: process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('username:password')
        ? 'mongodb'
        : 'json-file',
    });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
}
