import { useState } from 'react'
import { LENDERS } from '../data/mockData'

function statusBadge(status: string) {
  const map: Record<string, string> = { Active: 'badge-green', 'On Hold': 'badge-orange', Inactive: 'badge-gray' }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Lenders() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const types = ['All', ...Array.from(new Set(LENDERS.map(l => l.type)))]

  const filtered = LENDERS.filter(l => {
    const matchSearch = l.institution.toLowerCase().includes(search.toLowerCase()) ||
      l.contact.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || l.type === typeFilter
    return matchSearch && matchType
  })

  const totalCommitment = filtered.reduce((s, l) => s + l.totalCommitment, 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Lenders</h1>
          <span className="page-subtitle">{filtered.length} institutions · ${(totalCommitment / 1000).toFixed(1)}B committed</span>
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
            {filtered.map(l => (
              <tr key={l.id} className="clickable-row">
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
        {filtered.length === 0 && <div className="empty-state">No lenders match your search.</div>}
      </div>
    </div>
  )
}
