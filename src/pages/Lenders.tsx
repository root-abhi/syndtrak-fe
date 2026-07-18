import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LENDER_API = 'http://ac645ca6e443a426ea013ccf505d97c5-44806407.ap-south-1.elb.amazonaws.com'

interface Lender {
  id: number
  institution: string
  type: string
  totalCommitment: number
  activeDeals: number
  status: string
  region: string
  rating: string
  contact: string
  email: string
  phone: string
  onboarded: string
  address: string
  aum: number
  deals: string[]
  notes: string
}

function statusBadge(status: string) {
  const map: Record<string, string> = { Active: 'badge-green', 'On Hold': 'badge-orange', Inactive: 'badge-gray' }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Lenders() {
  const navigate = useNavigate()
  const [lenders, setLenders] = useState<Lender[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    const token = localStorage.getItem('syndtrak_token')
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (typeFilter !== 'All') params.set('type', typeFilter)

    fetch(`${LENDER_API}/api/lenders?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setLenders(d.lenders ?? []); setLoading(false) })
      .catch(() => { setError('Failed to load lenders'); setLoading(false) })
  }, [search, typeFilter])

  const types = ['All', ...Array.from(new Set(lenders.map(l => l.type)))]
  const totalCommitment = lenders.reduce((s, l) => s + l.totalCommitment, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lenders</h1>
          <span className="page-subtitle">
            {loading ? 'Loading…' : `${lenders.length} institutions · $${(totalCommitment / 1000).toFixed(1)}B committed`}
          </span>
        </div>
        <button className="btn-primary">+ Add Lender</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search institutions or contacts…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {types.map(t => (
            <button
              key={t}
              className={`filter-tab${typeFilter === t ? ' filter-tab--active' : ''}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="login-error-v" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Institution</th>
              <th>Type</th>
              <th>Region</th>
              <th>Rating</th>
              <th>Total Commitment</th>
              <th>Active Deals</th>
              <th>Primary Contact</th>
              <th>Onboarded</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="empty-state">Loading lenders…</td></tr>
            ) : lenders.map(l => (
              <tr key={l.id} className="clickable-row" onClick={() => navigate(`/lenders/${l.id}`)}>
                <td><strong>{l.institution}</strong></td>
                <td>{l.type}</td>
                <td>{l.region}</td>
                <td><span className="mono">{l.rating}</span></td>
                <td className="num">${(l.totalCommitment / 1000).toFixed(2)}B</td>
                <td className="num">{l.activeDeals}</td>
                <td style={{ fontSize: 13 }}>{l.contact}</td>
                <td style={{ fontSize: 12, color: '#888' }}>{l.onboarded}</td>
                <td>{statusBadge(l.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && lenders.length === 0 && <div className="empty-state">No lenders found.</div>}
      </div>
    </div>
  )
}
