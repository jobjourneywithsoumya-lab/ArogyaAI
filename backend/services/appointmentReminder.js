import { isMongoConnected } from '../config/database.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { jsonAppointmentStore } from '../store/jsonAppointmentStore.js';
import { jsonUserStore } from '../store/jsonUserStore.js';
import { sendAppointmentReminder } from './notifyService.js';

const getUserContact = async (userId) => {
  if (isMongoConnected()) {
    const user = await User.findById(userId);
    if (!user) return null;
    return { fullName: user.fullName, email: user.email, mobileNumber: user.mobileNumber };
  }
  const user = await jsonUserStore.findById(userId);
  if (!user) return null;
  return { fullName: user.fullName, email: user.email, mobileNumber: user.mobileNumber };
};

export const processAppointmentReminders = async () => {
  let due = [];

  if (isMongoConnected()) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    due = await Appointment.find({
      appointmentDate: { $gte: start, $lte: end },
      status: 'scheduled',
      isReminderSent: false,
    });
  } else {
    due = await jsonAppointmentStore.findTodayDueReminders();
  }

  for (const appt of due) {
    const userId = appt.userId?.toString?.() || appt.userId;
    const contact = appt.userEmail
      ? {
          fullName: appt.patientName || appt.userName || 'Patient',
          email: appt.userEmail,
          mobileNumber: appt.userMobile || appt.userPhone,
        }
      : await getUserContact(userId);

    if (!contact?.email && !contact?.mobileNumber) continue;

    await sendAppointmentReminder({
      fullName: contact.fullName,
      email: contact.email,
      mobileNumber: contact.mobileNumber,
      doctorName: appt.doctorName || appt.doctorSpecialization,
      hospitalName: appt.hospitalName,
      appointmentDate: appt.appointmentDate,
      timeSlot: appt.timeSlot,
    });

    if (isMongoConnected()) {
      appt.isReminderSent = true;
      await appt.save();
    } else {
      await jsonAppointmentStore.markReminderSent(appt.id);
    }
    console.log(`🔔 Reminder sent for appointment ${appt.id || appt._id}`);
  }

  return due.length;
};

export const startReminderScheduler = () => {
  const run = () => processAppointmentReminders().catch((e) => console.error('Reminder error:', e));
  run();
  setInterval(run, 60 * 60 * 1000);
  console.log('📅 Appointment reminder scheduler started (checks hourly)');
};
