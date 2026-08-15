import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = parseInt(searchParams.get('size') || '192')

  // Create SVG logo inline - BADIK DAGGER
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#0369a1"/>
    </linearGradient>
    <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fcd34d"/>
      <stop offset="25%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="75%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
    <linearGradient id="bandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7dd3fc"/>
      <stop offset="50%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="shadow3D" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="6" dy="8" stdDeviation="6" flood-color="#000" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="248" fill="url(#bgGrad)" filter="url(#shadow3D)"/>
  
  <!-- Inner decorative ring -->
  <circle cx="256" cy="256" r="235" fill="none" stroke="url(#bandGrad)" stroke-width="3" opacity="0.6"/>
  
  <!-- BADIK DAGGER -->
  <!-- BLADE -->
  <path d="M 256 60 Q 320 60 340 120 Q 360 180 340 250 Q 320 320 280 380 L 260 400 L 252 420 L 240 400 L 232 380 Q 192 320 172 250 Q 152 180 172 120 Q 192 60 256 60 Z" 
        fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2"/>
  
  <!-- Blade center ridge -->
  <path d="M 256 75 Q 305 75 325 125 Q 340 180 325 245 Q 310 310 270 370 L 256 390 L 242 370 Q 202 310 187 245 Q 172 180 187 125 Q 207 75 256 75 Z" 
        fill="rgba(255,255,255,0.25)"/>
  
  <!-- Blade left highlight -->
  <path d="M 240 80 Q 185 80 170 130 Q 155 180 175 245 Q 195 310 235 365" 
        fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="4" stroke-linecap="round"/>
  
  <!-- Blade right highlight -->
  <path d="M 272 365 Q 312 310 332 245 Q 352 180 337 130 Q 322 80 266 80" 
        fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3" stroke-linecap="round"/>
  
  <!-- HANDLE -->
  <path d="M 220 400 L 292 400 Q 310 400 310 415 L 310 470 Q 310 485 292 485 L 220 485 Q 202 485 202 470 L 202 415 Q 202 400 220 400 Z" 
        fill="url(#handleGrad)" stroke="#78350f" stroke-width="2"/>
  
  <!-- Handle grip lines -->
  <line x1="215" y1="415" x2="297" y2="415" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <line x1="212" y1="435" x2="300" y2="435" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <line x1="210" y1="455" x2="302" y2="455" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <line x1="208" y1="470" x2="304" y2="470" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  
  <!-- Handle highlight -->
  <path d="M 225 405 L 287 405 Q 303 405 303 418 L 303 460 Q 303 478 287 478 L 225 478 Q 209 478 209 460 L 209 418 Q 209 405 225 405 Z" 
        fill="rgba(255,255,255,0.15)"/>
  
  <!-- BLUE BAND around handle -->
  <rect x="210" y="438" width="92" height="22" rx="4" fill="url(#bandGrad)" filter="url(#shadow3D)"/>
  <rect x="212" y="440" width="88" height="8" rx="3" fill="rgba(255,255,255,0.4)"/>
  
  <!-- POMMEL (bottom cap) -->
  <path d="M 215 485 L 297 485 Q 315 485 315 500 L 315 515 Q 315 530 297 530 L 215 530 Q 197 530 197 515 L 197 500 Q 197 485 215 485 Z" 
        fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2"/>
  
  <!-- Center gem on pommel -->
  <circle cx="256" cy="507" r="14" fill="url(#bandGrad)" filter="url(#shadow3D)"/>
  <circle cx="256" cy="507" r="8" fill="#0ea5e9"/>
  <circle cx="254" cy="505" r="4" fill="rgba(255,255,255,0.6)"/>
  
  <!-- GUARD (cross-piece) -->
  <path d="M 190 385 L 322 385 Q 335 385 335 395 L 335 410 Q 335 420 322 420 L 190 420 Q 177 420 177 410 L 177 395 Q 177 385 190 385 Z" 
        fill="url(#bladeGrad)" stroke="#92400e" stroke-width="2" filter="url(#shadow3D)"/>
  
  <!-- Guard highlight -->
  <path d="M 195 390 L 317 390 L 317 398 L 195 398 Z" fill="rgba(255,255,255,0.3)"/>
  
  <!-- Rivets on guard -->
  <circle cx="195" cy="405" r="6" fill="#92400e"/>
  <circle cx="195" cy="405" r="3" fill="#fbbf24"/>
  <circle cx="317" cy="405" r="6" fill="#92400e"/>
  <circle cx="317" cy="405" r="3" fill="#fbbf24"/>
  
  <!-- SPARKLE EFFECTS -->
  <g fill="#fef3c7" opacity="0.9">
    <path d="M 160 100 L 165 115 L 180 120 L 165 125 L 160 140 L 155 125 L 140 120 L 155 115 Z"/>
    <path d="M 350 180 L 354 192 L 366 196 L 354 200 L 350 212 L 346 200 L 334 196 L 346 192 Z"/>
    <path d="M 200 40 L 203 50 L 213 53 L 203 56 L 200 66 L 197 56 L 187 53 L 197 50 Z" opacity="0.7"/>
  </g>
  
  <!-- BADIK TEXT -->
  <text x="256" y="590" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="48" font-weight="900" fill="#ffffff" filter="url(#shadow3D)">
    BADIK
  </text>
</svg>`

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
