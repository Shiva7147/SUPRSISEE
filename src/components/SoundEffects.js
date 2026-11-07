// Lightweight Web Audio API Synthesizer (Zero external dependencies, Zero memory leaks)
let audioCtx = null
let noiseBuffer = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// Pre-create noise buffer once to avoid per-explosion allocations
function getNoiseBuffer(ctx) {
  if (noiseBuffer) return noiseBuffer
  try {
    const bufferSize = Math.floor(ctx.sampleRate * 0.12)
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3))
    }
    return noiseBuffer
  } catch (e) {
    return null
  }
}

// Gentle chime for Diya and RSVP
export function playChime(freq = 528) {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.35, ctx.currentTime + 0.6)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  } catch (e) {
    // Ignore audio context errors silently
  }
}

// Firework launch whistle
export function playRocketLaunch() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(260, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.35)

    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch (e) {
    // Ignore
  }
}

// Lightweight pop sound
export function playBurst() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.15, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.25)

    // Optional quick sparkle noise
    const buffer = getNoiseBuffer(ctx)
    if (buffer) {
      const noise = ctx.createBufferSource()
      noise.buffer = buffer
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.04, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      noise.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start()
      noise.stop(ctx.currentTime + 0.15)
    }
  } catch (e) {
    // Ignore
  }
}
