import { useState } from 'react'
import './App.css'

const SLIDES = [
  {
    heading: 'The New Standard\nin Deal Site Management',
    sub: 'Integrated syndicated loan deal management and secure data rooms',
  },
  {
    heading: 'Seamless Collaboration\nAcross Markets',
    sub: 'Real-time deal tracking and communication for all market participants',
  },
  {
    heading: 'Secure Data Rooms\nBuilt for Finance',
    sub: 'Bank-grade security with granular access controls for sensitive documents',
  },
  {
    heading: 'Accelerate Deal\nExecution',
    sub: 'Streamline workflows from mandate to closing with powerful automation',
  },
  {
    heading: 'Global Reach,\nLocal Precision',
    sub: 'Supporting syndicated loan markets across the Americas, EMEA, and APAC',
  },
]

function HeroCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(i => (i + 1) % SLIDES.length)

  return (
    <div className="hero-carousel">
      {SLIDES.map((slide, idx) => (
        <div key={idx} className={`hero-slide${idx === current ? ' active' : ''}`}>
          <div className="hero-content">
            <h2>{slide.heading}</h2>
            <p>{slide.sub}</p>
          </div>
        </div>
      ))}

      <button className="carousel-arrow prev" onClick={prev} aria-label="Previous slide">
        &#8249;
      </button>
      <button className="carousel-arrow next" onClick={next} aria-label="Next slide">
        &#8250;
      </button>

      <div className="carousel-dots">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot${idx === current ? ' active' : ''}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

const API_URL = 'http://ac5dae7ab48374f2d9790293fdc829a8-113266431.ap-south-1.elb.amazonaws.com'

function LoginHeader() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<string | null>(
    () => localStorage.getItem('syndtrak_user')
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('syndtrak_token', data.token)
      localStorage.setItem('syndtrak_user', data.user.username)
      setLoggedInUser(data.user.username)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('syndtrak_token')
    localStorage.removeItem('syndtrak_user')
    setLoggedInUser(null)
    setUsername('')
    setPassword('')
  }

  return (
    <div className="login-header">
      <div className="brand">
        <div className="brand-dots">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <span className="brand-name">SyndTrak</span>
      </div>

      {loggedInUser ? (
        <div className="login-row">
          <span className="logged-in-msg">Welcome, <strong>{loggedInUser}</strong></span>
          <button className="btn-login" onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form className="login-row" onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="username">User ID</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <span className="login-error">{error}</span>}
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in…' : 'Login to SyndTrak'}
          </button>
        </form>
      )}
    </div>
  )
}

function AnnouncementBanner() {
  return (
    <div className="announcement-banner">
      <p>
        <strong>
          SyndTrak will be undergoing scheduled maintenance. We apologize for any
          inconvenience this may cause.
        </strong>
      </p>
    </div>
  )
}

function PageFooter() {
  return (
    <footer className="page-footer">
      <div className="footer-contact">
        For additional information about SyndTrak, please contact your regional support
        team or email{' '}
        <a href="mailto:support@syndtrak.example.com">support@syndtrak.example.com</a>
      </div>

      <div className="footer-schedule">
        <span className="footer-schedule-label">Maintenance Schedule:</span>
        <span>
          <span className="footer-schedule-label">Regular Maintenance:</span>{' '}
          Sunday 2 am to 7 am ET
        </span>
        <span className="footer-divider">|</span>
        <span>
          <span className="footer-schedule-label">Low Risk Maintenance:</span>{' '}
          Tuesday and Thursday 2 am to 6 am ET
        </span>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="page-wrapper">
      <LoginHeader />
      <AnnouncementBanner />
      <HeroCarousel />
      <PageFooter />
    </div>
  )
}
