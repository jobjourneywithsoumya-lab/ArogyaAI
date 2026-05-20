import nodemailer from 'nodemailer';

const BRAND = process.env.APP_NAME || 'ArogyaAI';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!to) return { sent: false, mode: 'skipped', reason: 'No email' };

  const transporter = createTransporter();
  const payload = { from: `"${BRAND}" <${process.env.EMAIL_USER || 'noreply@arogyaai.com'}>`, to, subject, html, text };

  if (!transporter) {
    console.log(`📧 [DEMO EMAIL] To: ${to}\nSubject: ${subject}\n${text || html}`);
    return { sent: true, mode: 'demo' };
  }

  try {
    await transporter.sendMail(payload);
    console.log(`✅ Email sent to ${to}`);
    return { sent: true, mode: 'live' };
  } catch (error) {
    console.error(`❌ Email failed: ${error.message}`);
    console.log(`📧 [FALLBACK DEMO] To: ${to} | ${subject}`);
    return { sent: true, mode: 'demo-fallback' };
  }
};

export const sendSMS = async ({ to, message }) => {
  if (!to) return { sent: false, mode: 'skipped' };

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (accountSid && authToken && from) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const body = new URLSearchParams({ To: to, From: from, Body: message });
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body,
      });
      if (res.ok) {
        console.log(`✅ SMS sent to ${to}`);
        return { sent: true, mode: 'live' };
      }
    } catch (err) {
      console.error('Twilio SMS error:', err.message);
    }
  }

  console.log(`📱 [DEMO SMS] To: ${to}\n${message}`);
  return { sent: true, mode: 'demo' };
};

export const sendRegistrationWelcome = async ({ fullName, email, mobileNumber }) => {
  const subject = `Welcome to ${BRAND}!`;
  const text = `Dear ${fullName},\n\nThank you for registering with ${BRAND}. Your AI-powered healthcare account is now active.\n\nYou can now:\n• Analyze symptoms with AI\n• Book doctor appointments\n• Manage health records & pharmacy orders\n\nStay healthy,\nTeam ${BRAND}`;
  const html = `<div style="font-family:sans-serif;max-width:520px"><h2 style="color:#0d9488">Welcome to ${BRAND}!</h2><p>Dear <strong>${fullName}</strong>,</p><p>Thank you for registering with <strong>${BRAND}</strong>. Your account is ready.</p><ul><li>AI symptom analysis</li><li>Smart appointments</li><li>Digital health records</li></ul><p style="color:#64748b">Team ${BRAND}</p></div>`;
  const sms = `Thank you for registering with ${BRAND}, ${fullName}! Your AI healthcare account is now active. - Team ${BRAND}`;

  const [emailResult, smsResult] = await Promise.all([
    sendEmail({ to: email, subject, text, html }),
    sendSMS({ to: mobileNumber, message: sms }),
  ]);

  return { email: emailResult, sms: smsResult };
};

export const sendAppointmentReminder = async ({
  fullName,
  email,
  mobileNumber,
  doctorName,
  hospitalName,
  appointmentDate,
  timeSlot,
}) => {
  const dateStr = new Date(appointmentDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const subject = `${BRAND} — Appointment Today`;
  const text = `Dear ${fullName},\n\nYou have an appointment today with Dr. ${doctorName} at ${hospitalName}.\nDate: ${dateStr}\nTime: ${timeSlot}\n\nPlease arrive 15 minutes early.\n\n— ${BRAND}`;
  const html = `<div style="font-family:sans-serif"><h2 style="color:#0d9488">Appointment Reminder</h2><p>Dear <strong>${fullName}</strong>,</p><p>You have an appointment <strong>today</strong>:</p><table style="background:#f0fdfa;padding:12px;border-radius:8px"><tr><td><b>Doctor</b></td><td>Dr. ${doctorName}</td></tr><tr><td><b>Hospital</b></td><td>${hospitalName}</td></tr><tr><td><b>Date</b></td><td>${dateStr}</td></tr><tr><td><b>Time</b></td><td>${timeSlot}</td></tr></table><p>— ${BRAND}</p></div>`;
  const sms = `${BRAND}: You have an appointment today with Dr. ${doctorName} at ${hospitalName}, ${dateStr} at ${timeSlot}. Please arrive 15 min early.`;

  return Promise.all([
    sendEmail({ to: email, subject, text, html }),
    sendSMS({ to: mobileNumber, message: sms }),
  ]);
};
