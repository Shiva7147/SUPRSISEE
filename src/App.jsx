import { useState, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Sparkles, Heart, Rocket, Volume2, VolumeX, Calendar, Clock, MapPin, CheckCircle, Send } from 'lucide-react'
import { FireworksCanvas } from './components/FireworksCanvas'
import { Diya } from './components/Diya'
import { Countdown } from './components/Countdown'
import { playChime, playBurst } from './components/SoundEffects'
import './App.css'

function App() {
  const fireworksRef = useRef(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [diyaLit, setDiyaLit] = useState(false)
  const [rsvpStatus, setRsvpStatus] = useState(false)
  const [customWish, setCustomWish] = useState('')
  const [wishSent, setWishSent] = useState(false)

  // Trigger rocket launch at specific screen location
  const handleLaunchRocket = (palette) => {
    if (fireworksRef.current) {
      const w = window.innerWidth
      const h = window.innerHeight
      fireworksRef.current.launchRocket(
        w * 0.2 + Math.random() * (w * 0.6),
        h * 0.2 + Math.random() * (h * 0.35),
        palette
      )
    }
  }

  // Grand finale
  const handleGrandFinale = () => {
    if (fireworksRef.current) {
      fireworksRef.current.launchGrandFinale()
    }
    // Also trigger confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF1493', '#00F0FF', '#FFA500', '#7000FF']
    })
    playChime(784)
  }

  // RSVP Acceptance
  const handleAcceptInvite = () => {
    setRsvpStatus(true)
    handleGrandFinale()
    playBurst()
  }

  // Send sweet note
  const handleSendWish = (e) => {
    e.preventDefault()
    if (!customWish.trim()) return
    setWishSent(true)
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF69B4', '#FFD700', '#FF4500']
    })
    playChime(880)
  }

  return (
    <div className="diwali-app">
      {/* Dynamic Fireworks & Rocket Particle Canvas */}
      <FireworksCanvas ref={fireworksRef} soundEnabled={soundEnabled} />

      {/* Top Floating Bar */}
      <header className="top-nav">
        <div className="nav-brand">
          <span className="brand-sparkle">✨</span>
          <span className="brand-text">A Royal Invitation &bull; Diwali 2026</span>
        </div>

        <div className="nav-actions">
          <button 
            type="button" 
            className="sound-toggle-btn"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? "Mute Sound" : "Enable Sound Effects"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            <span>{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="main-content">
        <section className="hero-section">
          {/* Decorative Framing Diyas */}
          <div className="hero-diya-left">
            <Diya size={90} initiallyLit={true} />
          </div>

          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>EXCLUSIVELY FOR MY SUNSHINE</span>
            <Sparkles size={16} className="badge-icon" />
          </div>

          <h1 className="hero-title">
            The Sky Is Lit Up <br />
            <span className="gradient-text">Just For You, Sunshine</span>
          </h1>

          <p className="hero-subtitle">
            An intimate invitation to light up our worlds and celebrate the Festival of Lights together &mdash; 
            bridging thousands of miles with love, warmth, and golden skies.
          </p>

          {/* Featured Core Message Quote Box */}
          <div className="quote-banner no-sky-click">
            <div className="quote-sparkle-top">✨ 🪔 ✨</div>
            <blockquote className="heartfelt-quote">
              &ldquo;Maybe we&apos;re not together right now, but this is a sign that the sky is lit up for you right now. In no time it&apos;s going to be you and me, celebrating Diwali forever and ever.&rdquo;
            </blockquote>
            <div className="quote-tagline">
              &mdash; This is just the beginning of the new version of us &mdash;
            </div>
          </div>

          {/* Floating Action Controls for Flying Rockets */}
          <div className="rocket-controls no-sky-click">
            <button 
              type="button" 
              className="rocket-btn love-rocket"
              onClick={() => handleLaunchRocket(['#FF0844', '#FFB199', '#FA709A', '#FFD700'])}
            >
              <Rocket size={18} className="rocket-icon" />
              <span>Launch Love Rocket 🚀</span>
            </button>

            <button 
              type="button" 
              className="rocket-btn gold-rocket"
              onClick={() => handleLaunchRocket(['#FFD700', '#FFA500', '#FF8C00', '#FFF8DC'])}
            >
              <Sparkles size={18} className="rocket-icon" />
              <span>Golden Sparkler ✨</span>
            </button>

            <button 
              type="button" 
              className="rocket-btn finale-rocket"
              onClick={handleGrandFinale}
            >
              <span>🎆 Grand Fireworks Show!</span>
            </button>
          </div>
          <p className="sky-hint">💡 Tip: Tap or click anywhere in the night sky to shoot rockets!</p>

          <div className="hero-diya-right">
            <Diya size={90} initiallyLit={true} />
          </div>
        </section>

        {/* Live Portuguese Countdown & Time Card */}
        <section className="section-container">
          <Countdown />
        </section>

        {/* The Formal Invitation Card */}
        <section className="section-container">
          <div className="invitation-card no-sky-click">
            <div className="ornamental-header">
              <span className="rangoli-glyph">𑁍</span>
              <h2>Your Royal Diwali Invitation</h2>
              <span className="rangoli-glyph">𑁍</span>
            </div>

            <p className="invitation-greeting">
              Dearest <strong>Sunshine</strong>,
            </p>
            <p className="invitation-body">
              Distance can never dim the light we share. On this auspicious day of Diwali, 
              I don&apos;t need you to worry about time zones or calculate hours away. 
              All I want is <strong>your time</strong>, <strong>your presence</strong>, and <strong>you</strong>.
            </p>

            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon-box gold">
                  <Clock size={24} />
                </div>
                <div>
                  <div className="detail-label">TIME OF CELEBRATION</div>
                  <div className="detail-value">At 3:00 PM (Portuguese Time)</div>
                  <div className="detail-sub">Your local time &bull; European Standard Time</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon-box purple">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="detail-label">THE OCCASION</div>
                  <div className="detail-value">Diwali Celebration</div>
                  <div className="detail-sub">A festival of new beginnings &amp; pure love</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon-box rose">
                  <MapPin size={24} />
                </div>
                <div>
                  <div className="detail-label">VENUE</div>
                  <div className="detail-value">Our Virtual Sanctuary</div>
                  <div className="detail-sub">Direct video connection, right here in our hearts</div>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon-box emerald">
                  <Heart size={24} />
                </div>
                <div>
                  <div className="detail-label">WHAT TO BRING</div>
                  <div className="detail-value">Your Radiant Smile</div>
                  <div className="detail-sub">And your warmest presence</div>
                </div>
              </div>
            </div>

            {/* RSVP Acceptance Action */}
            <div className="rsvp-action-area">
              {!rsvpStatus ? (
                <button 
                  type="button" 
                  className="rsvp-accept-btn"
                  onClick={handleAcceptInvite}
                >
                  <Sparkles size={20} />
                  <span>Accept My Invitation &bull; I&apos;ll Be There At 3:00 PM!</span>
                  <Heart size={20} className="fill-current" />
                </button>
              ) : (
                <div className="rsvp-confirmed-badge">
                  <CheckCircle size={32} className="check-icon" />
                  <div>
                    <h3>Invitation Accepted with Love! ✨</h3>
                    <p>
                      It&apos;s a date, Sunshine! See you at <strong>3:00 PM Portuguese Time</strong>. 
                      The rockets are flying, the diyas are burning, and my world is already brighter.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* The New Version of Us Section */}
        <section className="section-container">
          <div className="story-card no-sky-click">
            <div className="story-header">
              <span className="story-subtitle">OUR CHAPTERS &bull; OUR PROMISE</span>
              <h2 className="story-title">The Beginning of the New Version of Us</h2>
            </div>

            <div className="pillars-grid">
              <div className="pillar-card">
                <div className="pillar-num">01</div>
                <h3>The Sky Lit Across Miles</h3>
                <p>
                  Every rocket shooting up into the night is carrying a message straight to Portugal. 
                  Though oceans lie between us today, this sky belongs to both of us.
                </p>
              </div>

              <div className="pillar-card highlight">
                <div className="pillar-num">02</div>
                <h3>Your Time, Your Presence</h3>
                <p>
                  At <strong>3:00 PM Portuguese Time</strong>, we pause the world. 
                  No rush, no distance &mdash; just you, me, sweets, and sharing our wishes together.
                </p>
              </div>

              <div className="pillar-card">
                <div className="pillar-num">03</div>
                <h3>Forever &amp; Ever</h3>
                <p>
                  This Diwali is our promise: very soon, we won&apos;t need screens or countdowns. 
                  It will be you and me, holding hands and lighting diyas together side-by-side forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Virtual Diya Ceremony */}
        <section className="section-container">
          <div className="ceremony-card no-sky-click">
            <h2 className="ceremony-title">Light Our Diya Together</h2>
            <p className="ceremony-desc">
              Click the sacred Diya below to ignite our flame. As it glows, a secret note for you will appear:
            </p>

            <div className="ceremony-diya-center">
              <Diya 
                size={140} 
                isInteractive={true} 
                initiallyLit={diyaLit} 
                onLight={() => setDiyaLit(true)} 
              />
            </div>

            {diyaLit && (
              <div className="secret-note-box">
                <div className="secret-note-sparkles">✨ 💛 ✨</div>
                <h4 className="secret-note-title">A Secret Note For Sunshine:</h4>
                <p className="secret-note-content">
                  You are the light in my Diwali, Sunshine. No matter how dark the night or how far the distance, 
                  you make everything glow. Thank you for being you, for your patience, for your laughter, 
                  and for choosing to build this beautiful future with me. Happy Diwali, my love!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Send a Sweet Note Back */}
        <section className="section-container">
          <div className="wish-card no-sky-click">
            <h3 className="wish-title">Leave a Wish or Note For Him</h3>
            <p className="wish-desc">Type a sweet thought before our 3:00 PM celebration:</p>

            {!wishSent ? (
              <form onSubmit={handleSendWish} className="wish-form">
                <input
                  type="text"
                  className="wish-input"
                  placeholder="e.g. Can't wait for 3:00 PM! Happy Diwali my love ❤️..."
                  value={customWish}
                  onChange={(e) => setCustomWish(e.target.value)}
                />
                <button type="submit" className="wish-submit-btn">
                  <Send size={18} />
                  <span>Send Wish</span>
                </button>
              </form>
            ) : (
              <div className="wish-sent-alert">
                ✨ Your message has been sealed with golden sparkles! Can&apos;t wait for 3:00 PM! ✨
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <p>
          Crafted with love for <strong>Sunshine</strong> &bull; Celebrating Diwali at <strong>3:00 PM (Portuguese Time)</strong>
        </p>
        <p className="footer-sub">
          &ldquo;In no time it&apos;s going to be you and me, celebrating Diwali forever and ever.&rdquo;
        </p>
      </footer>
    </div>
  )
}

export default App
