import { useState } from 'react'
import { DOCUMENTS, DEALS } from '../data/mockData'

function statusBadge(status: string) {
  const map: Record<string, string> = { Final: 'badge-green', Draft: 'badge-orange' }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

const FILE_ICONS: Record<string, string> = {
  'Credit Agreement': '📋',
  'Term Sheet': '📄',
  'CIM': '🔒',
  'Presentation': '📊',
  'Financial Model': '📈',
  'Due Diligence': '🔍',
  'Amendment': '✎',
}

export default function Documents() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const types = ['All', ...Array.from(new Set(DOCUMENTS.map(d => d.type)))]

  const filtered = DOCUMENTS.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || d.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <span className="page-subtitle">{filtered.length} documents across all deals</span>
        </div>
        <button className="btn-primary">+ Upload Document</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search documents…"
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
              <th>Document</th>
              <th>Type</th>
              <th>Deal</th>
              <th>Size</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Access</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => {
              const deal = DEALS.find(d => d.id === doc.dealId)
              return (
                <tr key={doc.id} className="clickable-row">
                  <td>
                    <span style={{ marginRight: 8 }}>{FILE_ICONS[doc.type] ?? '📄'}</span>
                    <span className="deal-name">{doc.name}</span>
                  </td>
                  <td>{doc.type}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{deal?.name}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{doc.dealId}</div>
                  </td>
                  <td className="mono">{doc.size}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{doc.uploaded}</td>
                  <td>
                    {doc.restricted
                      ? <span className="badge badge-orange">Restricted</span>
                      : <span className="badge badge-gray">All Lenders</span>}
                  </td>
                  <td>{statusBadge(doc.status)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="empty-state">No documents match your search.</div>}
      </div>
    </div>
  )
}
