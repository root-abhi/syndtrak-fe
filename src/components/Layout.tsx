import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: '▦' },
  { path: '/deals', label: 'Deals', icon: '◈' },
  { path: '/lenders', label: 'Lenders', icon: '⊞' },
  { path: '/documents', label: 'Documents', icon: '❑' },
  { path: '/amendments', label: 'Amendments', icon: '✎' },
]

interface LayoutProps {
  username: string
  role: string
  onLogout: () => void
  children: React.ReactNode
}

export default function Layout({ username, role, onLogout, children }: LayoutProps) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    onLogout()
    navigate('/', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar--collapsed'}`}>
        <div className="sidebar-brand" onClick={() => setSidebarOpen(o => !o)}>
          <div className="brand-dots-sm">
            {Array.from({ length: 10 }).map((_, i) => <span key={i} />)}
          </div>
          {sidebarOpen && <span className="sidebar-brand-name">SyndTrak</span>}
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' nav-item--active' : ''}`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {sidebarOpen && (
            <div className="sidebar-user">
              <div className="user-avatar">{username[0].toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{username}</div>
                <div className="user-role">{role}</div>
              </div>
            </div>
          )}
          <button className="btn-logout" onClick={handleLogout} title="Logout">⏻</button>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-breadcrumb" id="page-title-portal" />
          <div className="topbar-right">
            <span className="topbar-env">PRODUCTION</span>
            <span className="topbar-user">Welcome, <strong>{username}</strong></span>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}
