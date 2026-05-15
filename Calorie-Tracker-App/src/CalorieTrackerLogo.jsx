export function CalorieTrackerLogo({ size = 120 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.25))' }}
    >
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="url(#bgGradient)" opacity="0.3" />

      {/* Apple body - Main purple gradient */}
      <path
        d="M 60 25
           C 45 25, 35 35, 35 50
           C 35 55, 36 60, 38 65
           C 40 75, 42 82, 45 88
           C 48 94, 52 98, 60 98
           C 68 98, 72 94, 75 88
           C 78 82, 80 75, 82 65
           C 84 60, 85 55, 85 50
           C 85 35, 75 25, 60 25 Z"
        fill="url(#appleGradient)"
        stroke="url(#appleStroke)"
        strokeWidth="2"
      />

      {/* Apple highlight - lighter purple */}
      <ellipse
        cx="50"
        cy="45"
        rx="12"
        ry="18"
        fill="url(#highlightGradient)"
        opacity="0.4"
      />

      {/* Stem - gray to black */}
      <path
        d="M 60 25 Q 58 18, 62 15 Q 64 13, 63 10"
        stroke="url(#stemGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Leaf - purple accent */}
      <path
        d="M 62 15 Q 70 12, 75 15 Q 77 16, 76 18 Q 74 20, 70 19 Q 65 18, 62 16"
        fill="url(#leafGradient)"
        stroke="#1F1F1F"
        strokeWidth="1"
      />

      {/* Leaf vein detail */}
      <path
        d="M 68 16 Q 72 17, 74 18"
        stroke="#6B21A8"
        strokeWidth="0.5"
        fill="none"
      />

      {/* Calorie counter badge - circular */}
      <circle cx="60" cy="60" r="18" fill="url(#badgeGradient)" opacity="0.95" />
      <circle cx="60" cy="60" r="18" fill="none" stroke="#1F1F1F" strokeWidth="2" />

      {/* Calorie number */}
      <text
        x="60"
        y="58"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="14"
        fontWeight="bold"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        CAL
      </text>

      {/* Bite mark - top right */}
      <path
        d="M 75 40 Q 80 38, 83 42 Q 85 45, 83 48 Q 80 52, 75 50"
        fill="#1A1A1A"
        opacity="0.6"
      />

      {/* Small bite detail circles */}
      <circle cx="79" cy="43" r="1.5" fill="#0A0A0A" opacity="0.4" />
      <circle cx="81" cy="47" r="1.5" fill="#0A0A0A" opacity="0.4" />

      {/* Gradients */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        <linearGradient id="appleGradient" x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="40%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#6B21A8" />
        </linearGradient>

        <linearGradient id="appleStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id="highlightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        <linearGradient id="stemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4B5563" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>

        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <radialGradient id="badgeGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#2D2D2D" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </radialGradient>
      </defs>
    </svg>
  );
}
