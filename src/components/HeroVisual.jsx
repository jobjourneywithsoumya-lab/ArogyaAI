/** Modern healthcare dashboard illustration (replaces cartoon doctor hero) */
export default function HeroVisual() {
  return (
    <svg
      viewBox="0 0 400 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hero-platform-img"
      role="img"
      aria-label="ArogyaAI health dashboard illustration"
    >
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdfa" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Device frame */}
      <rect x="40" y="30" width="320" height="360" rx="28" fill="url(#cardGrad)" filter="url(#shadow)" />
      <rect x="40" y="30" width="320" height="56" rx="28" fill="url(#bgGrad)" />
      <rect x="40" y="58" width="320" height="28" fill="url(#bgGrad)" />
      <circle cx="72" cy="58" r="8" fill="white" fillOpacity="0.9" />
      <text x="95" y="63" fill="white" fontSize="14" fontWeight="700" fontFamily="system-ui,sans-serif">
        ArogyaAI
      </text>
      <text x="95" y="78" fill="white" fillOpacity="0.85" fontSize="10" fontFamily="system-ui,sans-serif">
        Live Health Dashboard
      </text>

      {/* Heart rate wave */}
      <path
        d="M60 200 L90 200 L100 170 L115 230 L130 160 L145 210 L160 200 L340 200"
        stroke="#0d9488"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="60" y="155" fill="#64748b" fontSize="11" fontFamily="system-ui,sans-serif">
        Vitals Monitor
      </text>
      <text x="60" y="250" fill="#0f766e" fontSize="22" fontWeight="700" fontFamily="system-ui,sans-serif">
        98%
      </text>
      <text x="60" y="268" fill="#64748b" fontSize="10" fontFamily="system-ui,sans-serif">
        Wellness Score
      </text>

      {/* AI insight card */}
      <rect x="200" y="140" width="140" height="90" rx="14" fill="#ecfdf5" stroke="#99f6e4" strokeWidth="1.5" />
      <circle cx="225" cy="168" r="14" fill="#14b8a6" fillOpacity="0.2" />
      <path
        d="M220 168 L224 172 L232 162"
        stroke="#0d9488"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="248" y="165" fill="#134e4a" fontSize="11" fontWeight="600" fontFamily="system-ui,sans-serif">
        AI Insight
      </text>
      <text x="210" y="185" fill="#64748b" fontSize="9" fontFamily="system-ui,sans-serif">
        Symptom check
      </text>
      <text x="210" y="200" fill="#64748b" fontSize="9" fontFamily="system-ui,sans-serif">
        Low risk · Hydrate
      </text>
      <text x="210" y="218" fill="#0d9488" fontSize="9" fontWeight="600" fontFamily="system-ui,sans-serif">
        View care plan →
      </text>

      {/* Stats pills */}
      <rect x="60" y="290" width="85" height="48" rx="12" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
      <text x="72" y="312" fill="#1e40af" fontSize="9" fontFamily="system-ui,sans-serif">
        Appointments
      </text>
      <text x="72" y="328" fill="#1e3a8a" fontSize="14" fontWeight="700" fontFamily="system-ui,sans-serif">
        2 today
      </text>

      <rect x="155" y="290" width="85" height="48" rx="12" fill="#fef3c7" stroke="#fde68a" strokeWidth="1" />
      <text x="167" y="312" fill="#92400e" fontSize="9" fontFamily="system-ui,sans-serif">
        Medicines
      </text>
      <text x="167" y="328" fill="#78350f" fontSize="14" fontWeight="700" fontFamily="system-ui,sans-serif">
        3 due
      </text>

      <rect x="250" y="290" width="85" height="48" rx="12" fill="#fce7f3" stroke="#fbcfe8" strokeWidth="1" />
      <text x="262" y="312" fill="#9d174d" fontSize="9" fontFamily="system-ui,sans-serif">
        SOS Ready
      </text>
      <text x="262" y="328" fill="#831843" fontSize="14" fontWeight="700" fontFamily="system-ui,sans-serif">
        24/7
      </text>

      {/* Floating accent */}
      <circle cx="330" cy="120" r="36" fill="#0d9488" fillOpacity="0.12" />
      <circle cx="330" cy="120" r="22" fill="#14b8a6" fillOpacity="0.25" />
      <text x="330" y="125" textAnchor="middle" fill="#0f766e" fontSize="11" fontWeight="700" fontFamily="system-ui,sans-serif">
        AI
      </text>
    </svg>
  );
}
