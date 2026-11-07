import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { playRocketLaunch, playBurst } from './SoundEffects'

const PALETTES = [
  ['#FF3366', '#FF9933', '#FFFF33', '#FF0066', '#FFD700'], // Radiant Warmth
  ['#00F0FF', '#7000FF', '#FF00A0', '#00FF88', '#FFFFFF'], // Electric Aurora
  ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#FFF8DC'], // Golden Diwali
  ['#38EF7D', '#11998E', '#4E54C8', '#8F94FB', '#FFDF00'], // Emerald & Sapphire
  ['#FF0844', '#FFB199', '#FA709A', '#FEE140', '#FFFFFF']  // Rose Romance
]

const MAX_PARTICLES = 100 // Hard cap to guarantee 60 FPS on any phone/laptop

export const FireworksCanvas = forwardRef(function FireworksCanvas({ soundEnabled = false }, ref) {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const rocketsRef = useRef([])
  const particlesRef = useRef([])
  const soundEnabledRef = useRef(soundEnabled)

  useEffect(() => {
    soundEnabledRef.current = soundEnabled
  }, [soundEnabled])

  // Expose launch functions
  useImperativeHandle(ref, () => ({
    launchRocket(targetX, targetY, customPalette) {
      triggerLaunch(targetX, targetY, customPalette)
    },
    launchGrandFinale() {
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          const tx = w * 0.2 + Math.random() * (w * 0.6)
          const ty = h * 0.15 + Math.random() * (h * 0.35)
          triggerLaunch(tx, ty)
        }, i * 200)
      }
    }
  }))

  const triggerLaunch = (targetX, targetY, customPalette) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height

    const startX = targetX ? targetX + (Math.random() * 60 - 30) : Math.random() * (w * 0.8) + w * 0.1
    const startY = h + 10
    const endX = targetX || Math.random() * (w * 0.8) + w * 0.1
    const endY = targetY || Math.random() * (h * 0.45) + h * 0.1

    const palette = customPalette || PALETTES[Math.floor(Math.random() * PALETTES.length)]

    // Avoid overcrowding
    if (rocketsRef.current.length > 5) return

    rocketsRef.current.push({
      x: startX,
      y: startY,
      targetX: endX,
      targetY: endY,
      speed: 14 + Math.random() * 4,
      angle: Math.atan2(endY - startY, endX - startX),
      distanceToTarget: Math.hypot(endX - startX, endY - startY),
      distanceTraveled: 0,
      palette,
      trail: []
    })

    if (soundEnabledRef.current) {
      playRocketLaunch()
    }
  }

  const createExplosion = (x, y, palette) => {
    const particleCount = 28 + Math.floor(Math.random() * 12)
    const currentCount = particlesRef.current.length

    // If close to cap, trim oldest
    if (currentCount + particleCount > MAX_PARTICLES) {
      particlesRef.current.splice(0, (currentCount + particleCount) - MAX_PARTICLES)
    }

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.4 - 0.2)
      const speed = Math.random() * 6 + 2
      const color = palette[Math.floor(Math.random() * palette.length)]
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.02 + Math.random() * 0.02,
        color,
        size: Math.random() * 2.5 + 1.5,
        friction: 0.95,
        gravity: 0.14
      })
    }

    if (soundEnabledRef.current) {
      playBurst()
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Ambient automatic rocket every 4.5 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !document.hidden) {
        const w = window.innerWidth
        const h = window.innerHeight
        triggerLaunch(
          Math.random() * (w * 0.7) + w * 0.15,
          Math.random() * (h * 0.35) + h * 0.12
        )
      }
    }, 4500)

    // Ultra-optimized 60fps render loop
    const render = () => {
      // Fast fade out without destination-out overhead
      ctx.fillStyle = 'rgba(10, 6, 20, 0.22)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update & Draw Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i]
        const vx = Math.cos(r.angle) * r.speed
        const vy = Math.sin(r.angle) * r.speed

        r.x += vx
        r.y += vy
        r.distanceTraveled += Math.hypot(vx, vy)

        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 5) r.trail.shift()

        // Draw crisp streak
        ctx.beginPath()
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t]
          ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = '#FFDF70'
        ctx.lineWidth = 2
        ctx.stroke()

        // Reached destination?
        if (r.distanceTraveled >= r.distanceToTarget || r.y <= r.targetY) {
          createExplosion(r.targetX, r.targetY, r.palette)
          rocketsRef.current.splice(i, 1)
        }
      }

      // Update & Draw Explosion Particles (No shadowBlur, fast draw)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.vx *= p.friction
        p.vy = p.vy * p.friction + p.gravity
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      clearInterval(interval)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, []) // Empty dependency array -> set up once, never tear down

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
})
