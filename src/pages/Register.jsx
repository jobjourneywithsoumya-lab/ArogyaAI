import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import CaptchaField from '../components/CaptchaField';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants/brand';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    captchaAnswer: '',
  });

  const handleChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data } = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        captchaId,
        captchaAnswer: formData.captchaAnswer,
      });

      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome to ${APP_NAME}! Check your email & SMS for confirmation.`);
        navigate('/');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition text-sm';

  return (
    <AuthLayout
      title="Join the future of emergency healthcare"
      subtitle="Create your secure account for AI-powered wellness, pharmacy, and smart medical records."
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-slate-400 text-sm">Register for {APP_NAME}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange({ fullName: e.target.value })}
              placeholder="John Doe"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange({ email: e.target.value })}
              placeholder="you@email.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={(e) => handleChange({ mobileNumber: e.target.value })}
              placeholder="+91 98765 43210"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleChange({ password: e.target.value })}
                placeholder="••••••"
                className={inputClass}
                required
                minLength={6}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Confirm</label>
            <div className="relative">
              <CheckCircle className="absolute left-3.5 top-2.5 text-slate-500" size={16} />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleChange({ confirmPassword: e.target.value })}
                placeholder="••••••"
                className={inputClass}
                required
              />
            </div>
          </div>
        </div>

        <CaptchaField
          captchaId={captchaId}
          captchaAnswer={formData.captchaAnswer}
          onCaptchaLoad={setCaptchaId}
          onChange={handleChange}
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating account...' : (
            <>
              Create Account <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-5 text-center text-slate-400 text-sm">
        Already registered?{' '}
        <Link to="/login" className="text-cyan-400 font-semibold hover:text-cyan-300 transition">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
