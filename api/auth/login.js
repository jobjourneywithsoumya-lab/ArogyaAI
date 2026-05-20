import { connectDB } from '../../backend/config/database.js';
import { authService } from '../../backend/services/authService.js';

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

    const { token, user } = await authService.login(req.body);
    return res.status(200).json({ success: true, message: 'Login successful', token, user });
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
}
