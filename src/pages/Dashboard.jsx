import { motion } from 'framer-motion';
import {
  Activity,
  Droplets,
  Heart,
  Brain,
  Calendar,
  Pill,
  MapPin,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { APP_NAME } from '../constants/brand';
import BrandLogo from '../components/BrandLogo';

const trendData = [
  { day: 'Mon', score: 72 },
  { day: 'Tue', score: 78 },
  { day: 'Wed', score: 75 },
  { day: 'Thu', score: 82 },
  { day: 'Fri', score: 85 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 88 },
];

const diseaseTrend = [
  { name: 'Fever', cases: 42 },
  { name: 'Cold', cases: 38 },
  { name: 'BP', cases: 22 },
  { name: 'Diabetes', cases: 18 },
];

const aiSuggestions = [
  { title: 'Hydration Alert', desc: 'You are 40% below daily water goal. Drink 2 more glasses.', icon: Droplets, color: 'cyan' },
  { title: 'Medicine Reminder', desc: 'Take evening vitamin D supplement in 2 hours.', icon: Pill, color: 'emerald' },
  { title: 'Appointment', desc: 'Dr. Sharma — Cardiology checkup tomorrow 10:30 AM.', icon: Calendar, color: 'blue' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const healthScore = 85;

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex flex-col sm:flex-row sm:items-center gap-4">
        <BrandLogo size={56} className="rounded-2xl shadow-md" />
        <div>
        <p className="text-cyan-600 font-semibold text-sm uppercase tracking-widest mb-1">{APP_NAME} Dashboard</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-slate-500 mt-1">Real-time health analytics & AI insights</p>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Health Score', value: `${healthScore}%`, icon: Heart, color: 'from-rose-500 to-pink-500' },
          { label: 'BMI', value: '22.4', icon: Activity, color: 'from-cyan-500 to-blue-500' },
          { label: 'Water Today', value: '1.2L / 3L', icon: Droplets, color: 'from-blue-500 to-cyan-500' },
          { label: 'AI Risk', value: 'Low', icon: Brain, color: 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white/80 backdrop-blur border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Health score ring */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-cyan-600 to-emerald-600 p-6 text-white shadow-xl"
        >
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp size={20} /> Wellness Score
          </h3>
          <div className="flex items-center justify-center py-6">
            <div className="relative w-36 h-36">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${healthScore * 2.64} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">{healthScore}%</span>
            </div>
          </div>
          <p className="text-sm text-white/80 text-center">Excellent — keep up daily activity & hydration</p>
        </motion.div>

        {/* Trend chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
        >
          <h3 className="font-semibold text-slate-800 mb-4">7-Day Health Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} domain={[60, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} /> Disease Trends
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={diseaseTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Bar dataKey="cases" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-slate-800">AI Suggestions</h3>
          {aiSuggestions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-cyan-200 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                <s.icon className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{s.title}</p>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Nearby Hospitals', desc: '3 emergency centers within 2km', icon: MapPin },
          { title: 'Health Tip', desc: '30 min walk reduces cardiovascular risk by 20%', icon: Heart },
          { title: 'Symptom AI', desc: 'Last analysis: Low severity — monitor 48hrs', icon: Brain },
        ].map((card) => (
          <div key={card.title} className="p-5 rounded-2xl glass border border-slate-200/80">
            <card.icon className="w-6 h-6 text-cyan-600 mb-2" />
            <p className="font-semibold">{card.title}</p>
            <p className="text-sm text-muted mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
