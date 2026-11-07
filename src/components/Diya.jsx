import { useState } from 'react'
import confetti from 'canvas-confetti'
import { playChime } from './SoundEffects'

export function Diya({ 
  isInteractive = false, 
  initiallyLit = true, 
  size = 120, 
  onLight,
  label = "Light Our Diya" 
}) {
  const [lit, setLit] = useState(initiallyLit)

  const handleToggle = () => {
    if (!isInteractive) return
    const newState = !lit
    setLit(newState)
    if (newState) {
      playChime(660)
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#FFA500', '#FF4500', '#FF1493']
      })
      if (onLight) onLight()
    }
  }

  const scale = size / 120

  return (
    <div 
      className={`diya-wrapper ${isInteractive ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
      onClick={handleToggle}
      title={isInteractive ? (lit ? "Our love burns bright ✨" : "Click to light the Diya") : "Diya of Love"}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none'
      }}
    >
      <div style={{ position: 'relative', width: size, height: size * 0.9 }}>
        {/* Soft feather glow behind flame without expensive blur filters */}
        {lit && (
          <div
            className="diya-aura"
            style={{
              position: 'absolute',
              top: 5 * scale,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 70 * scale,
              height: 70 * scale,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 170, 0, 0.55) 0%, rgba(255, 69, 0, 0.2) 45%, transparent 75%)',
              pointerEvents: 'none',
              animation: 'pulseGlow 2.5s infinite alternate ease-in-out'
            }}
          />
        )}

        {/* SVG Diya */}
        <svg
          viewBox="0 0 140 120"
          width={size}
          height={size * 0.86}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flame (Only visible when lit) */}
          {lit && (
            <g className="flame-group">
              {/* Outer Golden Flame */}
              <path
                d="M 70,12 C 58,35 52,48 55,58 C 58,68 64,74 70,74 C 76,74 82,68 85,58 C 88,48 82,35 70,12 Z"
                fill="url(#flameOuter)"
                className="flicker-outer"
              />
              {/* Inner White/Yellow Core */}
              <path
                d="M 70,26 C 63,40 60,48 62,55 C 64,62 67,65 70,65 C 73,65 76,62 78,55 C 80,48 77,40 70,26 Z"
                fill="url(#flameInner)"
                className="flicker-inner"
              />
              {/* Sparkle core dot */}
              <circle cx="70" cy="55" r="3" fill="#FFFFFF" />
            </g>
          )}

          {/* Wick */}
          <path
            d="M 70,72 Q 72,64 70,58"
            stroke="#3E2723"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Clay Oil Lamp Body */}
          <path
            d="M 20,74 C 20,95 45,108 70,108 C 95,108 120,95 120,74 C 112,77 92,80 70,80 C 48,80 28,77 20,74 Z"
            fill="url(#clayGradient)"
            stroke="#8D2F15"
            strokeWidth="1.5"
          />

          {/* Golden Rim & Floral Pattern */}
          <path
            d="M 20,74 C 35,78 52,80 70,80 C 88,80 105,78 120,74 C 105,72 88,70 70,70 C 52,70 35,72 20,74 Z"
            fill="url(#goldRimGradient)"
            stroke="#D97706"
            strokeWidth="1"
          />

          {/* Decorative Jewels along the rim */}
          <circle cx="45" cy="74" r="2" fill="#FEF08A" />
          <circle cx="58" cy="76" r="2.2" fill="#E11D48" />
          <circle cx="70" cy="77" r="2.5" fill="#FEF08A" />
          <circle cx="82" cy="76" r="2.2" fill="#E11D48" />
          <circle cx="95" cy="74" r="2" fill="#FEF08A" />

          {/* Base Pedestal */}
          <path
            d="M 52,107 L 88,107 L 94,114 C 94,116 92,118 88,118 L 52,118 C 48,118 46,116 46,114 Z"
            fill="url(#clayDarkGradient)"
            stroke="#5C1D06"
            strokeWidth="1.5"
          />

          {/* SVG Gradients */}
          <defs>
            <linearGradient id="flameOuter" x1="70" y1="12" x2="70" y2="74" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFF7ED" />
              <stop offset="25%" stopColor="#FEF08A" />
              <stop offset="65%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            <linearGradient id="flameInner" x1="70" y1="26" x2="70" y2="65" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="clayGradient" x1="70" y1="74" x2="70" y2="108" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C2410C" />
              <stop offset="50%" stopColor="#9A3412" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>

            <linearGradient id="clayDarkGradient" x1="70" y1="107" x2="70" y2="118" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7C2D12" />
              <stop offset="100%" stopColor="#451A03" />
            </linearGradient>

            <linearGradient id="goldRimGradient" x1="20" y1="74" x2="120" y2="74" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {isInteractive && (
        <span 
          style={{
            marginTop: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            color: lit ? '#FEF08A' : '#94A3B8',
            transition: 'color 0.2s ease'
          }}
        >
          {lit ? "✨ Our Flame Burns Bright ✨" : "👉 Tap to Light our Diya"}
        </span>
      )}
    </div>
  )
}
