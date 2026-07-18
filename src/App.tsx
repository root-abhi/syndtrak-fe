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

function LoginHeader() {
  const [userId, setUserId] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: connect to backend auth endpoint
    console.log('Login with userId:', userId)
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

      <form className="login-row" onSubmit={handleLogin}>
        <div className="login-field">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            autoComplete="username"
          />
        </div>
        <button type="submit" className="btn-login">
          Login to SyndTrak
        </button>
      </form>
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
