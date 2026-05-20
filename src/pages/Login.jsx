import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import CaptchaField from '../components/CaptchaField';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants/brand';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaId, setCaptchaId] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaAnswer: '',
  });

  const handleChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await authAPI.login({
        email: formData.email,
        password: formData.password,
        captchaId,
        captchaAnswer: formData.captchaAnswer,
      });

      if (data.success) {
        login(data.user, data.token);
        toast.success(`Welcome back to ${APP_NAME}!`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Check credentials and CAPTCHA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Your health command center awaits"
      subtitle="Sign in to access AI diagnostics, pharmacy, appointments, and secure medical records."
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-slate-400 text-sm">Sign in to your {APP_NAME} account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 text-slate-500" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleChange({ email: e.target.value })}
              placeholder="you@email.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 text-slate-500" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => handleChange({ password: e.target.value })}
              placeholder="••••••••"
              className="w-full pl-11 pr-12 py-3 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <CaptchaField
          captchaId={captchaId}
          captchaAnswer={formData.captchaAnswer}
          onCaptchaLoad={setCaptchaId}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
            Forgot password?
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition disabled:opacity-50"
        >
          {loading ? 'Signing in...' : (
            <>
              Sign In <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-slate-400 text-sm">
        New to {APP_NAME}?{' '}
        <Link to="/register" className="text-cyan-400 font-semibold hover:text-cyan-300 transition">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}
