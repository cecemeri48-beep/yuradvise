export default function LogoIcon({ 
  className = 'w-12 h-12',
  variant = 'full',
  showBadge = true
}: { 
  className?: string
  variant?: 'full' | 'gold' | 'monochrome'
  showBadge?: boolean
}) {
  return (
    <div className={className}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512" 
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Deep Royal Sapphire background gradient */}
          <linearGradient id="bgGradLux" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b132b" />
            <stop offset="50%" stopColor="#1c2541" />
            <stop offset="100%" stopColor="#090d16" />
          </linearGradient>

          {/* Imperial Metallic Gold gradient */}
          <linearGradient id="goldGradLux" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="85%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          {/* Gold Shine overlay gradient */}
          <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
            <stop offset="50%" stopColor="#fef08a" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#d97706" stopOpacity="0"/>
          </linearGradient>

          {/* Emerald accent gradient */}
          <linearGradient id="emeraldGradLux" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* 3D Drop Shadow filter */}
          <filter id="shadow3DLux" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
          </filter>

          {/* Glow filter */}
          <filter id="glowLux" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Rounded Square Badge */}
        {showBadge && (
          <g>
            <rect 
              x="16" y="16" 
              width="480" height="480" 
              rx="96" ry="96" 
              fill={variant === 'monochrome' ? '#0f172a' : 'url(#bgGradLux)'} 
              filter="url(#shadow3DLux)"
            />
            {/* Outer Gold Border */}
            <rect 
              x="20" y="20" 
              width="472" height="472" 
              rx="92" ry="92" 
              fill="none" 
              stroke="url(#goldGradLux)" 
              strokeWidth="3" 
              strokeOpacity="0.7"
            />
            {/* Inner Subtle Ring */}
            <rect 
              x="30" y="30" 
              width="452" height="452" 
              rx="82" ry="82" 
              fill="none" 
              stroke="rgba(255,255,255,0.1)" 
              strokeWidth="1.5" 
            />
          </g>
        )}

        {/* ===== BADIK GRAPHIC MOTIF ===== */}
        <g filter="url(#shadow3DLux)">

          {/* 1. BADIK HANDLE (GAGANG BADIK) */}
          {/* Main Handle Curve */}
          <path 
            d="M 232 150 C 228 110 220 75 240 50 C 260 25 305 18 340 18 C 365 18 385 24 395 38 C 402 48 398 62 385 68 C 365 76 330 75 308 92 C 290 106 280 125 280 150 Z" 
            fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'}
          />
          {/* Handle Highlight / Bevel */}
          {variant !== 'monochrome' && (
            <path 
              d="M 242 55 C 260 32 300 25 335 25 C 360 25 378 30 384 40 C 370 44 338 52 316 68 C 296 83 285 105 282 145 L 274 145 C 274 125 284 102 300 88 C 322 70 360 70 375 62 Z" 
              fill="url(#goldShine)"
            />
          )}
          {/* Handle Ring Collar (Cincin Badik) */}
          <rect 
            x="226" y="138" 
            width="60" height="14" 
            rx="3" 
            fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} 
            stroke="#451a03" 
            strokeWidth="1"
          />

          {/* 2. CENTRAL EMBLEM (RCS.CBS EMBLEM BLOCK) */}
          {/* Outer Crest Plaque */}
          <rect 
            x="130" y="152" 
            width="252" height="160" 
            rx="20" ry="20" 
            fill={variant === 'monochrome' ? '#1e293b' : '#0b132b'} 
            stroke={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} 
            strokeWidth="5"
          />
          {/* Inner Decorative Border */}
          <rect 
            x="138" y="160" 
            width="236" height="144" 
            rx="14" ry="14" 
            fill="none" 
            stroke={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} 
            strokeWidth="1.5" 
            strokeDasharray="6 3"
            strokeOpacity="0.8"
          />

          {/* BADIK Text Branding inside Emblem */}
          <g textAnchor="middle" fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'}>
            {/* BADIK Text */}
            <text 
              x="256" y="235" 
              fontSize="44" 
              fontWeight="900" 
              fontFamily="system-ui, -apple-system, sans-serif" 
              letterSpacing="4"
            >
              BADIK
            </text>
          </g>

          {/* Corner Stud Accents on Emblem */}
          <circle cx="152" cy="174" r="3.5" fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} />
          <circle cx="360" cy="174" r="3.5" fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} />
          <circle cx="152" cy="290" r="3.5" fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} />
          <circle cx="360" cy="290" r="3.5" fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'} />

          {/* 3. BADIK BLADE (MATA BADIK) */}
          {/* Main Blade Shape */}
          <path 
            d="M 170 312 L 342 312 L 325 365 C 300 425 272 468 256 488 C 240 468 212 425 187 365 Z" 
            fill={variant === 'monochrome' ? '#ffffff' : 'url(#goldGradLux)'}
          />

          {/* Center Spine Line (Tulak Badik) */}
          <line 
            x1="256" y1="312" 
            x2="256" y2="480" 
            stroke="rgba(0,0,0,0.35)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Left Edge Bevel Reflection */}
          {variant !== 'monochrome' && (
            <path 
              d="M 256 312 L 170 312 L 187 365 C 212 425 240 468 256 488 Z" 
              fill="rgba(255,255,255,0.18)"
            />
          )}

          {/* Right Edge Shadow */}
          {variant !== 'monochrome' && (
            <path 
              d="M 256 312 L 342 312 L 325 365 C 300 425 272 468 256 488 Z" 
              fill="rgba(0,0,0,0.15)"
            />
          )}
        </g>
      </svg>
    </div>
  )
}
