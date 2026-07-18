import { useState, useEffect } from 'react'

const DATA_API = ''

const FILE_ICONS: Record<string, string> = {
  'Credit Agreement': '📋', 'Term Sheet': '📄', 'CIM': '🔒',
  'Presentation': '📊', 'Financial Model': '📈', 'Due Diligence': '🔍', 'Amendment': '✎',
}

function statusBadge(status: string) {
  const map: Record<string, string> = { Final: 'badge-green', Draft: 'badge-orange' }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Documents() {
  const [docs, setDocs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  useEffect(() => {
    const token = localStorage.getItem('syndtrak_token')
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    fetch(`${DATA_API}/api/documents?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setDocs(d.documents ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [search])

  const types = ['All', ...Array.from(new Set(docs.map((d: any) => d.type)))]
  const filtered = typeFilter === 'All' ? docs : docs.filter((d: any) => d.type === typeFilter)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <span className="page-subtitle">{loading ? 'Loading…' : `${filtered.length} documents`}</span>
        </div>
        <button className="btn-primary">+ Upload Document</button>
      </div>
      <div className="toolbar">
        <input className="search-input" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)} />
        <div className="filter-tabs">
          {types.map(t => (
            <button key={t} className={`filter-tab${typeFilter === t ? ' filter-tab--active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="card">
        <table className="data-table">
          <thead>
            <tr><th>Document</th><th>Type</th><th>Deal</th><th>Size</th><th>Uploaded By</th><th>Date</th><th>Access</th><th>Status</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="empty-state">Loading documents…</td></tr>
            ) : filtered.map((doc: any) => (
              <tr key={doc.id} className="clickable-row">
                <td><span style={{ marginRight: 8 }}>{FILE_ICONS[doc.type] ?? '📄'}</span><span className="deal-name">{doc.name}</span></td>
                <td>{doc.type}</td>
                <td><code className="id-code">{doc.dealId}</code></td>
                <td className="mono">{doc.size}</td>
                <td>{doc.uploadedBy}</td>
                <td>{doc.uploaded}</td>
                <td>{doc.restricted ? <span className="badge badge-orange">Restricted</span> : <span className="badge badge-gray">All Lenders</span>}</td>
                <td>{statusBadge(doc.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && <div className="empty-state">No documents found.</div>}
      </div>
    </div>
  )
}
