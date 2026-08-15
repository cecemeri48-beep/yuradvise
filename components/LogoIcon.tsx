export default function LogoIcon({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-full h-full">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9"/>
            <stop offset="100%" stopColor="#0369a1"/>
          </linearGradient>
          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d"/>
            <stop offset="25%" stopColor="#fbbf24"/>
            <stop offset="50%" stopColor="#f59e0b"/>
            <stop offset="75%" stopColor="#d97706"/>
            <stop offset="100%" stopColor="#b45309"/>
          </linearGradient>
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706"/>
            <stop offset="100%" stopColor="#92400e"/>
          </linearGradient>
          <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7dd3fc"/>
            <stop offset="50%" stopColor="#38bdf8"/>
            <stop offset="100%" stopColor="#0284c7"/>
          </linearGradient>
          <filter id="shadow3D" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="6" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
          </filter>
        </defs>
        
        <circle cx="256" cy="256" r="248" fill="url(#bgGrad)" filter="url(#shadow3D)"/>
        <circle cx="256" cy="256" r="235" fill="none" stroke="url(#bandGrad)" stroke-width="3" opacity="0.6"/>
        
        {/* Blade */}
        <path d="M 256 60 Q 320 60 340 120 Q 360 180 340 250 Q 320 320 280 380 L 260 400 L 252 420 L 240 400 L 232 380 Q 192 320 172 250 Q 152 180 172 120 Q 192 60 256 60 Z" 
              fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2"/>
        
        {/* Blade highlight */}
        <path d="M 256 75 Q 305 75 325 125 Q 340 180 325 245 Q 310 310 270 370 L 256 390 L 242 370 Q 202 310 187 245 Q 172 180 187 125 Q 207 75 256 75 Z" 
              fill="rgba(255,255,255,0.25)"/>
        
        {/* Handle */}
        <path d="M 220 400 L 292 400 Q 310 400 310 415 L 310 470 Q 310 485 292 485 L 220 485 Q 202 485 202 470 L 202 415 Q 202 400 220 400 Z" 
              fill="url(#handleGrad)" stroke="#78350f" stroke-width="2"/>
        
        {/* Grip lines */}
        <line x1="215" y1="415" x2="297" y2="415" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <line x1="212" y1="435" x2="300" y2="435" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <line x1="210" y1="455" x2="302" y2="455" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <line x1="208" y1="470" x2="304" y2="470" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        
        {/* Blue band */}
        <rect x="210" y="438" width="92" height="22" rx="4" fill="url(#bandGrad)" filter="url(#shadow3D)"/>
        
        {/* Pommel */}
        <path d="M 215 485 L 297 485 Q 315 485 315 500 L 315 515 Q 315 530 297 530 L 215 530 Q 197 530 197 515 L 197 500 Q 197 485 215 485 Z" 
              fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2"/>
        
        {/* Center gem */}
        <circle cx="256" cy="507" r="14" fill="url(#bandGrad)" filter="url(#shadow3D)"/>
        <circle cx="256" cy="507" r="8" fill="#0ea5e9"/>
        
        {/* Guard */}
        <path d="M 190 385 L 322 385 Q 335 385 335 395 L 335 410 Q 335 420 322 420 L 190 420 Q 177 420 177 410 L 177 395 Q 177 385 190 385 Z" 
              fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2" filter="url(#shadow3D)"/>
        
        {/* Rivets */}
        <circle cx="195" cy="405" r="6" fill="#92400e"/>
        <circle cx="195" cy="405" r="3" fill="#fbbf24"/>
        <circle cx="317" cy="405" r="6" fill="#92400e"/>
        <circle cx="317" cy="405" r="3" fill="#fbbf24"/>
        
        {/* Text */}
        <text x="256" y="590" text-anchor="middle" fontFamily="Arial Black, Arial, sans-serif" fontSize="48" fontWeight="900" fill="#ffffff">BADIK</text>
      </svg>
    </div>
  )
}
