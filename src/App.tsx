import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Deals from './pages/Deals'
import DealRoom from './pages/DealRoom'
import Lenders from './pages/Lenders'
import Documents from './pages/Documents'
import Amendments from './pages/Amendments'

const SLIDES = [
  { heading: 'The New Standard\nin Deal Site Management', sub: 'Integrated syndicated loan deal management and secure data rooms' },
  { heading: 'Seamless Collaboration\nAcross Markets', sub: 'Real-time deal tracking and communication for all market participants' },
  { heading: 'Secure Data Rooms\nBuilt for Finance', sub: 'Bank-grade security with granular access controls for sensitive documents' },
  { heading: 'Accelerate Deal\nExecution', sub: 'Streamline workflows from mandate to closing with powerful automation' },
  { heading: 'Global Reach,\nLocal Precision', sub: 'Supporting syndicated loan markets across the Americas, EMEA, and APAC' },
]

const API_URL = 'http://ac5dae7ab48374f2d9790293fdc829a8-113266431.ap-south-1.elb.amazonaws.com'

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
      <button className="carousel-arrow prev" onClick={prev}>&#8249;</button>
      <button className="carousel-arrow next" onClick={next}>&#8250;</button>
      <div className="carousel-dots">
        {SLIDES.map((_, idx) => (
          <button key={idx} className={`carousel-dot${idx === current ? ' active' : ''}`} onClick={() => setCurrent(idx)} />
        ))}
      </div>
    </div>
  )
}

interface AuthState {
  username: string
  role: string
  token: string
}

function LoginPage({ onLogin }: { onLogin: (auth: AuthState) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      localStorage.setItem('syndtrak_role', data.user.role)
      onLogin({ username: data.user.username, role: data.user.role, token: data.token })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page-header">
        <div className="brand">
          <div className="brand-dots">
            {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
          </div>
          <span className="brand-name">SyndTrak</span>
        </div>
      </div>

      <div className="login-page-body">
        <HeroCarousel />
        <div className="login-panel">
          <div className="login-panel-inner">
            <h2 className="login-panel-title">Sign in to SyndTrak</h2>
            <p className="login-panel-sub">Syndicated Loan Deal Management Platform</p>
            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field-v">
                <label htmlFor="username">User ID</label>
                <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" placeholder="Enter your user ID" />
              </div>
              <div className="login-field-v">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" placeholder="••••••••" />
              </div>
              {error && <div className="login-error-v">{error}</div>}
              <button type="submit" className="btn-login-v" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <div className="login-footer-note">
              Authorized users only. Access is monitored and logged.
            </div>
          </div>
        </div>
      </div>

      <footer className="login-page-footer">
        <span>© 2024 SyndTrak · FIS Global · All rights reserved</span>
        <span className="footer-divider">|</span>
        <span>For support: <a href="mailto:support@syndtrak.example.com">support@syndtrak.example.com</a></span>
      </footer>
    </div>
  )
}

export default function App() {
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const username = localStorage.getItem('syndtrak_user')
    const token = localStorage.getItem('syndtrak_token')
    const role = localStorage.getItem('syndtrak_role') ?? 'user'
    return username && token ? { username, token, role } : null
  })

  const handleLogout = () => {
    localStorage.removeItem('syndtrak_token')
    localStorage.removeItem('syndtrak_user')
    localStorage.removeItem('syndtrak_role')
    setAuth(null)
  }

  if (!auth) {
    return <LoginPage onLogin={setAuth} />
  }

  return (
    <BrowserRouter>
      <Layout username={auth.username} role={auth.role} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/deals/:id" element={<DealRoom />} />
          <Route path="/lenders" element={<Lenders />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/amendments" element={<Amendments />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
