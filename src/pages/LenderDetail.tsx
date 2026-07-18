import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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

export default function LenderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lender, setLender] = useState<Lender | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('syndtrak_token')
    fetch(`${LENDER_API}/api/lenders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json() })
      .then(d => { setLender(d); setLoading(false) })
      .catch(() => { setError('Lender not found'); setLoading(false) })
  }, [id])

  if (loading) return <div className="empty-state" style={{ marginTop: 80 }}>Loading…</div>
  if (error || !lender) return (
    <div className="empty-state" style={{ marginTop: 80 }}>
      {error} <button className="btn-link" onClick={() => navigate('/lenders')}>Back to Lenders</button>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/lenders')}>← Lenders</button>
          <h1 className="page-title" style={{ marginTop: 4 }}>{lender.institution}</h1>
          <span className="page-subtitle">{lender.type} · {lender.region}</span>
        </div>
        {statusBadge(lender.status)}
      </div>

      <div className="deal-summary-bar">
        {[
          { label: 'Total Commitment', value: `$${(lender.totalCommitment / 1000).toFixed(2)}B` },
          { label: 'Active Deals', value: `${lender.activeDeals}` },
          { label: 'AUM', value: `$${(lender.aum / 1000).toFixed(0)}B` },
          { label: 'Credit Rating', value: lender.rating },
          { label: 'Region', value: lender.region },
          { label: 'Onboarded', value: lender.onboarded },
        ].map(kv => (
          <div className="deal-kv" key={kv.label}>
            <span className="deal-kv-label">{kv.label}</span>
            <span className="deal-kv-value">{kv.value}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title" style={{ padding: 0, marginBottom: 20 }}>Institution Details</h3>
          <div className="kv-list" style={{ gap: 14 }}>
            <div className="kv-row"><span>Institution</span><strong>{lender.institution}</strong></div>
            <div className="kv-row"><span>Type</span><span>{lender.type}</span></div>
            <div className="kv-row"><span>Region</span><span>{lender.region}</span></div>
            <div className="kv-row"><span>Credit Rating</span><span className="mono">{lender.rating}</span></div>
            <div className="kv-row"><span>Status</span><span>{statusBadge(lender.status)}</span></div>
            <div className="kv-row"><span>Address</span><span style={{ fontSize: 12, color: '#555', textAlign: 'right', maxWidth: 220 }}>{lender.address}</span></div>
          </div>

          <div style={{ borderTop: '1px solid #f0f2f5', marginTop: 20, paddingTop: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1a3a3a', marginBottom: 14 }}>Notes</h3>
            <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{lender.notes}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 className="section-title" style={{ padding: 0, marginBottom: 20 }}>Primary Contact</h3>
            <div className="sidebar-user" style={{ marginBottom: 16 }}>
              <div className="user-avatar" style={{ width: 44, height: 44, fontSize: 18, background: '#1d7f7f' }}>
                {lender.contact[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#1a3a3a', fontSize: 15 }}>{lender.contact}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{lender.type} Representative</div>
              </div>
            </div>
            <div className="kv-list" style={{ gap: 10 }}>
              <div className="kv-row">
                <span>Email</span>
                <a href={`mailto:${lender.email}`} style={{ fontSize: 13, color: '#1d7f7f' }}>{lender.email}</a>
              </div>
              <div className="kv-row"><span>Phone</span><span className="mono" style={{ fontSize: 12 }}>{lender.phone}</span></div>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 className="section-title" style={{ padding: 0, marginBottom: 16 }}>Deal Participation</h3>
            {lender.deals.length === 0 ? (
              <div style={{ fontSize: 13, color: '#aaa' }}>No deals on record</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lender.deals.map(d => (
                  <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f2f5' }}>
                    <code className="id-code">{d}</code>
                    <button className="btn-link" onClick={() => navigate(`/deals/${d}`)}>View →</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
