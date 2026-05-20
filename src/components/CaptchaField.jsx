import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { authAPI } from '../services/api';

export default function CaptchaField({ captchaId, captchaAnswer, onChange, onCaptchaLoad }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const loadCaptcha = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.getCaptcha();
      if (data.success) {
        setQuestion(data.question);
        onCaptchaLoad(data.captchaId);
        onChange({ captchaAnswer: '' });
      }
    } catch {
      setQuestion('3 + 5 = ?');
      onCaptchaLoad('fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">Security Check</label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-600/50 text-cyan-300 font-mono text-sm">
          {loading ? '...' : question || 'Loading...'}
        </div>
        <button
          type="button"
          onClick={loadCaptcha}
          className="p-2.5 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 transition"
          title="Refresh CAPTCHA"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <input
        type="text"
        value={captchaAnswer}
        onChange={(e) => onChange({ captchaAnswer: e.target.value })}
        placeholder="Enter answer"
        className="mt-2 w-full px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition text-sm"
        required
      />
      <input type="hidden" value={captchaId || ''} readOnly />
    </div>
  );
}
