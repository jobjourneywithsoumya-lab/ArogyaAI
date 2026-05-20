import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import symptomsRoutes from './routes/symptomsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startReminderScheduler } from './services/appointmentReminder.js';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDataDir } from './store/dataPaths.js';

// Load environment variables
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(getDataDir(), 'db.json');
const PORT = process.env.PORT || 4000;

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration — allow Vite dev ports
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.VERCEL_BRANCH_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some((o) => origin === o || origin.startsWith(o))) {
      return callback(null, true);
    }
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    callback(null, true);
  },
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Vercel: ensure /api prefix on request path for serverless routing
app.use((req, res, next) => {
  const url = req.url || '/';
  if (process.env.VERCEL && !url.startsWith('/api')) {
    req.url = `/api${url.startsWith('/') ? url : `/${url}`}`;
  }
  next();
});

// Connect to MongoDB (max 4s — never block requests indefinitely on Vercel)
const dbReady = Promise.race([
  connectDB(),
  new Promise((resolve) => setTimeout(() => resolve(false), 4000)),
]).catch((err) => {
  console.error('DB connect:', err.message);
  return false;
});
app.use(async (req, res, next) => {
  await dbReady;
  next();
});

// Legacy JSON database functions for backward compatibility
const defaultState = {
  cart: [],
  userRecords: [
    { date: '2026-05-10', type: 'Blood Test', status: 'Completed', doctor: 'Dr. Sarah Wilson', report: 'Hemoglobin: 14.2 g/dL' },
    { date: '2026-04-15', type: 'X-Ray', status: 'Archived', doctor: 'Dr. James Miller', report: 'Chest X-ray clear' },
    { date: '2026-03-20', type: 'Vaccination', status: 'Completed', doctor: 'ArogyaAI Clinic', report: 'Annual Flu Shot' }
  ],
  vitals: {
    heartRate: { value: 105, unit: 'bpm', label: 'Heart Rate' },
    bloodPressure: { systolic: 145, diastolic: 95, unit: 'mmHg', label: 'Blood Pressure' },
    bloodGlucose: { value: 180, unit: 'mg/dL', label: 'Blood Glucose' },
    oxygen: { value: 94, unit: '%', label: 'Oxygen (SpO2)' }
  },
  accessPassword: '1234',
  symptoms: null,
  diagnosis: null
};

const mergeWithDefaults = (data = {}) => ({
  ...defaultState,
  ...data,
  cart: Array.isArray(data.cart) ? data.cart : defaultState.cart,
  userRecords: Array.isArray(data.userRecords) ? data.userRecords : defaultState.userRecords,
  vitals: {
    ...defaultState.vitals,
    ...(data.vitals || {})
  }
});

const readDatabase = async () => {
  try {
    const raw = await readFile(DB_PATH, 'utf8');
    return mergeWithDefaults(JSON.parse(raw));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to read database:', error);
    }
    await writeDatabase(defaultState);
    return defaultState;
  }
};

const writeDatabase = async (state) => {
  await mkdir(dirname(DB_PATH), { recursive: true });
  await writeFile(DB_PATH, JSON.stringify(mergeWithDefaults(state), null, 2));
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use('/api/notifications', notificationRoutes);

// Legacy endpoints for backward compatibility
app.get('/api/health-data', async (req, res) => {
  try {
    const data = await readDatabase();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/health-data', async (req, res) => {
  try {
    const state = req.body;
    await writeDatabase(state);
    res.json(mergeWithDefaults(state));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/records', async (req, res) => {
  try {
    const state = await readDatabase();
    res.json(state.userRecords);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ArogyaAI Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler middleware
app.use(errorHandler);

// Start server (local only — Vercel uses serverless handler)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 ArogyaAI backend running on http://127.0.0.1:${PORT}`);
    startReminderScheduler();
  });
}

export default app;
