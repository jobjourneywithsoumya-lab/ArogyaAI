import { connectDB } from '../../backend/config/database.js';
import { processAppointmentReminders } from '../../backend/services/appointmentReminder.js';

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await connectDB();
  const count = await processAppointmentReminders();
  return res.status(200).json({ success: true, remindersSent: count });
}
