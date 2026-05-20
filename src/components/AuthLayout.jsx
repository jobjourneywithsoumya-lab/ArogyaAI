import { motion } from 'framer-motion';
import { Activity, Shield, Zap } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../constants/brand';
import BrandLogo from './BrandLogo';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-600/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-8">
            <BrandLogo size={56} className="rounded-2xl shadow-lg shadow-cyan-500/30" />
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{APP_NAME}</h1>
              <p className="text-cyan-300/80 text-sm font-medium">{APP_TAGLINE}</p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            {title || 'Next-Gen Emergency & Wellness Platform'}
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-md leading-relaxed">
            {subtitle || 'Secure AI-powered diagnostics, smart appointments, digital pharmacy, and real-time health intelligence.'}
          </p>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'JWT + bcrypt secured authentication' },
              { icon: Activity, text: 'AI symptom analysis & health insights' },
              { icon: Zap, text: 'Instant emergency SOS & hospital finder' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3 text-slate-300"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span>{text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-4 py-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <BrandLogo size={40} className="rounded-xl" />
            <span className="text-2xl font-bold text-white">{APP_NAME}</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/40 p-8">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
