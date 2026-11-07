import { useState, useEffect } from 'react'

export function Countdown() {
  const [portugueseTime, setPortugueseTime] = useState('')
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isPast: false })

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()

      // Format current time in Portugal (Europe/Lisbon timezone)
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Lisbon',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
      setPortugueseTime(formatter.format(now))

      // Calculate target time: today at 15:00 (3:00 PM) in Europe/Lisbon
      // We parse the Lisbon parts to get the current Lisbon hour/min/sec
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Lisbon',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23'
      }).formatToParts(now)

      const lisbonHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10)
      const lisbonMinute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10)
      const lisbonSecond = parseInt(parts.find(p => p.type === 'second')?.value || '0', 10)

      // Target is 15:00:00 (3:00 PM)
      let targetSeconds = 15 * 3600
      let currentSeconds = lisbonHour * 3600 + lisbonMinute * 60 + lisbonSecond
      let diff = targetSeconds - currentSeconds

      if (diff <= 0 && diff > -14400) {
        // Within 4 hours after 3:00 PM -> Live Celebration mode!
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPast: true })
      } else {
        if (diff < 0) {
          // If past today's 3:00 PM, count to tomorrow's 3:00 PM
          diff += 24 * 3600
        }
        const h = Math.floor(diff / 3600)
        const m = Math.floor((diff % 3600) / 60)
        const s = diff % 60
        setTimeLeft({ hours: h, minutes: m, seconds: s, isPast: false })
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="countdown-card">
      <div className="countdown-header">
        <span className="live-badge">
          <span className="live-dot"></span> LIVE IN PORTUGAL
        </span>
        <div className="current-pt-time">
          Current Time: <strong>{portugueseTime}</strong> (Portuguese Time)
        </div>
      </div>

      <div className="event-time-pill">
        <span className="event-icon">🕒</span>
        <span className="event-label">Your Special Invitation:</span>
        <span className="event-highlight">3:00 PM (Portuguese Time)</span>
      </div>

      {timeLeft.isPast ? (
        <div className="celebration-active-banner">
          ✨ The Sky Is Lit Up! We Are Celebrating Together Right Now! ✨
        </div>
      ) : (
        <div className="countdown-grid">
          <div className="countdown-segment">
            <span className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <span className="countdown-divider">:</span>
          <div className="countdown-segment">
            <span className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <span className="countdown-divider">:</span>
          <div className="countdown-segment">
            <span className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      )}

      <div className="countdown-footer">
        No Indian time needed &bull; Just <strong>your time</strong>, <strong>your presence</strong>, and <strong>you</strong>.
      </div>
    </div>
  )
}
