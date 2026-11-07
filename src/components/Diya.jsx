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
        particleCount: 50,
        spread: 70,
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
        {/* Glow Halo behind flame */}
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
              background: 'radial-gradient(circle, rgba(255, 170, 0, 0.65) 0%, rgba(255, 69, 0, 0.25) 50%, transparent 80%)',
              filter: 'blur(8px)',
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
              <circle cx="70" cy="55" r="3.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Wick */}
          <path
            d="M 70,72 Q 72,64 70,58"
            stroke="#3E2723"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Earthen Lamp / Diya Body */}
          {/* Base shadow */}
          <ellipse cx="70" cy="108" rx="42" ry="7" fill="rgba(0,0,0,0.35)" filter="blur(2px)" />

          {/* Outer Terracotta Bowl */}
          <path
            d="M 22,70 C 22,96 44,106 70,106 C 96,106 118,96 118,70 C 104,78 88,82 70,82 C 52,82 36,78 22,70 Z"
            fill="url(#terracottaGrad)"
            stroke="#D97706"
            strokeWidth="1.5"
          />

          {/* Rim with Golden Ornamentation */}
          <ellipse
            cx="70"
            cy="70"
            rx="48"
            ry="12"
            fill="url(#rimGrad)"
            stroke="#F59E0B"
            strokeWidth="1.8"
          />

          {/* Golden engraved dots on rim */}
          <circle cx="34" cy="71" r="1.8" fill="#FEF08A" />
          <circle cx="46" cy="74" r="1.8" fill="#FEF08A" />
          <circle cx="58" cy="76" r="1.8" fill="#FEF08A" />
          <circle cx="70" cy="77" r="2.2" fill="#FEF08A" />
          <circle cx="82" cy="76" r="1.8" fill="#FEF08A" />
          <circle cx="94" cy="74" r="1.8" fill="#FEF08A" />
          <circle cx="106" cy="71" r="1.8" fill="#FEF08A" />

          {/* Inner Oil pool reflection */}
          <ellipse
            cx="70"
            cy="71"
            rx="38"
            ry="7.5"
            fill="url(#oilGrad)"
          />

          {/* Gradients */}
          <defs>
            <linearGradient id="terracottaGrad" x1="70" y1="70" x2="70" y2="106" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EA580C" />
              <stop offset="0.6" stopColor="#C2410C" />
              <stop offset="1" stopColor="#7C2D12" />
            </linearGradient>

            <linearGradient id="rimGrad" x1="22" y1="70" x2="118" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#FDE68A" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>

            <radialGradient id="oilGrad" cx="70" cy="71" r="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" stopOpacity="0.8" />
              <stop offset="0.7" stopColor="#B45309" stopOpacity="0.9" />
              <stop offset="1" stopColor="#451A03" />
            </radialGradient>

            <linearGradient id="flameOuter" x1="70" y1="12" x2="70" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.3" stopColor="#FBBF24" />
              <stop offset="0.7" stopColor="#F97316" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>

            <linearGradient id="flameInner" x1="70" y1="26" x2="70" y2="65" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#FEF08A" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {isInteractive && (
        <span 
          style={{
            marginTop: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: lit ? '#FCD34D' : '#94A3B8',
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            textShadow: lit ? '0 0 10px rgba(251, 191, 36, 0.7)' : 'none'
          }}
        >
          {lit ? '✨ Glowing For You' : `🪔 Click: ${label}`}
        </span>
      )}
    </div>
  )
}
