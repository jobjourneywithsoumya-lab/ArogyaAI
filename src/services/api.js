import axios from 'axios';

// Production on Vercel: same-origin /api (no localhost). Dev: local backend.
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://127.0.0.1:4000' : '');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 25000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  verifyEmail: (data) => api.post('/api/auth/verify-email', data),
  verifyMobile: (data) => api.post('/api/auth/verify-mobile', data),
  sendOtp: (data) => api.post('/api/auth/send-otp', data),
  forgotPassword: (data) => api.post('/api/auth/forgot-password', data),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
};

export const symptomsAPI = {
  analyze: (symptoms) => api.post('/api/symptoms/analyze', { symptoms }),
  history: () => api.get('/api/symptoms/history'),
};

export const appointmentAPI = {
  create: (data) => api.post('/api/appointments', data),
  list: () => api.get('/api/appointments'),
  cancel: (id) => api.put(`/api/appointments/${id}/cancel`),
};

export const medicineAPI = {
  all: () => api.get('/api/medicines'),
  byCategory: (cat) => api.get(`/api/medicines/category/${cat}`),
};

export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  list: () => api.get('/api/orders'),
};

export const notificationAPI = {
  list: () => api.get('/api/notifications'),
  markRead: (id) => api.put(`/api/notifications/${id}/read`),
};

export const dashboardAPI = {
  stats: () => api.get('/api/dashboard/stats'),
};

export const healthAPI = {
  getData: () => api.get('/api/health-data'),
  saveData: (data) => api.put('/api/health-data', data),
};

export default api;
