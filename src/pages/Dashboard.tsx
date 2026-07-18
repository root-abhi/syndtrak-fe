import { useNavigate } from 'react-router-dom'
import { DEALS, AMENDMENTS } from '../data/mockData'

const METRICS = [
  { label: 'Active Deals', value: '5', sub: '+2 this quarter', color: '#1d7f7f' },
  { label: 'Total Commitments', value: '$4.85B', sub: 'Across 6 deals', color: '#2a6496' },
  { label: 'Pending Amendments', value: '1', sub: 'Voting closes Apr 5', color: '#e67e22' },
  { label: 'Lender Network', value: '10', sub: 'Active institutions', color: '#27ae60' },
]

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Active: 'badge-green',
    Closed: 'badge-gray',
    Syndication: 'badge-blue',
    Pending: 'badge-orange',
  }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Dashboard() {
  const navigate = useNavigate()

  const portfolioData = [
    { label: 'Industrials', pct: 25 },
    { label: 'Technology', pct: 10 },
    { label: 'Energy', pct: 16 },
    { label: 'Financial', pct: 6 },
    { label: 'Consumer', pct: 43 },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="page-subtitle">Portfolio overview as of Q1 2024</span>
      </div>

      <div className="metrics-grid">
        {METRICS.map(m => (
          <div className="metric-card" key={m.label} style={{ borderTopColor: m.color }}>
            <div className="metric-value" style={{ color: m.color }}>{m.value}</div>
            <div className="metric-label">{m.label}</div>
            <div className="metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Active Deals</span>
            <button className="btn-link" onClick={() => navigate('/deals')}>View all →</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Borrower</th>
                <th>Size</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {DEALS.filter(d => d.status !== 'Closed').map(deal => (
                <tr key={deal.id} className="clickable-row" onClick={() => navigate(`/deals/${deal.id}`)}>
                  <td>
                    <div className="deal-name">{deal.name}</div>
                    <div className="deal-id">{deal.id}</div>
                  </td>
                  <td>{deal.borrower}</td>
                  <td className="num">${deal.size}M</td>
                  <td><span className="role-tag">{deal.role}</span></td>
                  <td>{statusBadge(deal.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-right-col">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Sector Exposure</span>
            </div>
            <div className="sector-bars">
              {portfolioData.map(s => (
                <div className="sector-bar-row" key={s.label}>
                  <span className="sector-bar-label">{s.label}</span>
                  <div className="sector-bar-track">
                    <div className="sector-bar-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                  <span className="sector-bar-pct">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Amendment Activity</span>
            </div>
            {AMENDMENTS.map(a => (
              <div className="amendment-item" key={a.id}>
                <div className="amendment-title">{a.title}</div>
                <div className="amendment-meta">
                  {statusBadge(a.status)} &nbsp; Deadline: {a.deadline}
                </div>
                <div className="vote-bar-row">
                  <div className="vote-bar">
                    <div className="vote-for" style={{ width: `${(a.votesFor / a.totalLenders) * 100}%` }} />
                  </div>
                  <span className="vote-label">{a.votesFor}/{a.totalLenders} For</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
