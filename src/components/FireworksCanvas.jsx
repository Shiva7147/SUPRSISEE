import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { playRocketLaunch } from './SoundEffects'

const PALETTES = [
  ['#FF3366', '#FF9933', '#FFFF33', '#FF0066', '#FFD700'], // Radiant Warmth
  ['#00F0FF', '#7000FF', '#FF00A0', '#00FF88', '#FFF'],    // Electric Aurora
  ['#FFD700', '#FFA500', '#FF4500', '#FF69B4', '#FFF8DC'], // Golden Diwali
  ['#38EF7D', '#11998E', '#4E54C8', '#8F94FB', '#FFDF00'], // Emerald & Sapphire
  ['#FF0844', '#FFB199', '#FA709A', '#FEE140', '#FFFFFF']  // Rose Romance
]

export const FireworksCanvas = forwardRef(function FireworksCanvas({ soundEnabled = true }, ref) {
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const rocketsRef = useRef([])
  const particlesRef = useRef([])

  // Expose launch function to parent
  useImperativeHandle(ref, () => ({
    launchRocket(targetX, targetY, customPalette) {
      triggerLaunch(targetX, targetY, customPalette)
    },
    launchGrandFinale() {
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const tx = w * 0.15 + Math.random() * (w * 0.7)
          const ty = h * 0.15 + Math.random() * (h * 0.45)
          triggerLaunch(tx, ty)
        }, i * 220)
      }
    }
  }))

  const triggerLaunch = (targetX, targetY, customPalette) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const w = canvas.width
    const h = canvas.height

    const startX = targetX ? targetX + (Math.random() * 80 - 40) : Math.random() * w
    const startY = h + 10
    const endX = targetX || Math.random() * (w * 0.8) + w * 0.1
    const endY = targetY || Math.random() * (h * 0.5) + h * 0.1

    const palette = customPalette || PALETTES[Math.floor(Math.random() * PALETTES.length)]

    rocketsRef.current.push({
      x: startX,
      y: startY,
      targetX: endX,
      targetY: endY,
      speed: 12 + Math.random() * 4,
      angle: Math.atan2(endY - startY, endX - startX),
      distanceToTarget: Math.hypot(endX - startX, endY - startY),
      distanceTraveled: 0,
      palette,
      trail: [],
      hue: Math.random() * 360
    })

    if (soundEnabled) {
      playRocketLaunch()
    }
  }

  const createExplosion = (x, y, palette) => {
    const particleCount = 75 + Math.floor(Math.random() * 45)
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 8 + 2
      const color = palette[Math.floor(Math.random() * palette.length)]
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
        color,
        size: Math.random() * 3 + 1.5,
        friction: 0.96,
        gravity: 0.12,
        sparkle: Math.random() > 0.4
      })
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Ambient automatic rockets
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        const w = window.innerWidth
        const h = window.innerHeight
        triggerLaunch(
          Math.random() * (w * 0.8) + w * 0.1,
          Math.random() * (h * 0.4) + h * 0.15
        )
      }
    }, 2400)

    // Render loop
    const render = () => {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'

      // Update and draw rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i]
        const vx = Math.cos(r.angle) * r.speed
        const vy = Math.sin(r.angle) * r.speed

        r.x += vx
        r.y += vy
        r.distanceTraveled += Math.hypot(vx, vy)

        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 7) r.trail.shift()

        // Draw rocket trail
        ctx.beginPath()
        for (let t = 0; t < r.trail.length; t++) {
          const pt = r.trail[t]
          ctx.lineTo(pt.x, pt.y)
        }
        ctx.strokeStyle = '#FFE066'
        ctx.lineWidth = 2.5
        ctx.shadowColor = '#FF9900'
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0

        // Check if reached destination
        if (r.distanceTraveled >= r.distanceToTarget || r.y <= r.targetY) {
          createExplosion(r.targetX, r.targetY, r.palette)
          rocketsRef.current.splice(i, 1)
        }
      }

      // Update and draw explosion particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.vx *= p.friction
        p.vy *= p.friction
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.alpha -= p.decay

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.sparkle && Math.random() > 0.5 ? p.size * 1.5 : p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    // Interactive click to fire
    const handleClick = (e) => {
      // Don't trigger if clicked on an interactive button or card that handles its own clicks
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.no-sky-click')) {
        return
      }
      triggerLaunch(e.clientX, e.clientY)
    }
    window.addEventListener('pointerdown', handleClick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', handleClick)
      clearInterval(interval)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [soundEnabled])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  )
})
