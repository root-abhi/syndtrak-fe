import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DEALS } from '../data/mockData'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Active: 'badge-green',
    Closed: 'badge-gray',
    Syndication: 'badge-blue',
    Pending: 'badge-orange',
  }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Deals() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = DEALS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.borrower.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || d.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalSize = filtered.reduce((s, d) => s + d.size, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Deals</h1>
          <span className="page-subtitle">{filtered.length} deals · ${(totalSize / 1000).toFixed(1)}B total</span>
        </div>
        <button className="btn-primary">+ New Deal</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search deals or borrowers…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-tabs">
          {['All', 'Active', 'Syndication', 'Pending', 'Closed'].map(s => (
            <button
              key={s}
              className={`filter-tab${statusFilter === s ? ' filter-tab--active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Deal ID</th>
              <th>Deal Name</th>
              <th>Borrower</th>
              <th>Type</th>
              <th>Size</th>
              <th>Role</th>
              <th>Spread</th>
              <th>Closing Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(deal => (
              <tr key={deal.id} className="clickable-row" onClick={() => navigate(`/deals/${deal.id}`)}>
                <td><code className="id-code">{deal.id}</code></td>
                <td>
                  <div className="deal-name">{deal.name}</div>
                  <div className="deal-sector">{deal.sector}</div>
                </td>
                <td>{deal.borrower}</td>
                <td>{deal.type}</td>
                <td className="num">${deal.size}M</td>
                <td><span className="role-tag">{deal.role}</span></td>
                <td className="mono">{deal.spread}</td>
                <td>{deal.closingDate}</td>
                <td>{statusBadge(deal.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">No deals match your search.</div>
        )}
      </div>
    </div>
  )
}
