import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DEALS, PARTICIPANTS, DOCUMENTS } from '../data/mockData'

const TABS = ['Overview', 'Participants', 'Documents', 'Timeline']

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Active: 'badge-green',
    Closed: 'badge-gray',
    Syndication: 'badge-blue',
    Pending: 'badge-orange',
    Final: 'badge-green',
    Draft: 'badge-orange',
    Funded: 'badge-green',
    'Voting Open': 'badge-blue',
    Approved: 'badge-green',
  }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

const TIMELINE = [
  { date: '2024-01-15', event: 'Mandate awarded', detail: 'SyndTrak appointed as Bookrunner' },
  { date: '2024-02-01', event: 'CIM distributed', detail: 'Confidential Information Memorandum sent to 32 lenders' },
  { date: '2024-02-05', event: 'Lender presentation', detail: 'Management call — 18 lenders participated' },
  { date: '2024-02-20', event: 'Commitments received', detail: '18 lenders committed, deal fully subscribed' },
  { date: '2024-03-01', event: 'Allocations finalised', detail: 'All lender allocations confirmed and notified' },
  { date: '2024-03-14', event: 'Credit Agreement signed', detail: 'Execution version executed by all parties' },
  { date: '2024-03-15', event: 'Closing & funding', detail: 'Funds disbursed, deal closed successfully' },
]

export default function DealRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Overview')

  const deal = DEALS.find(d => d.id === id)
  if (!deal) {
    return (
      <div className="empty-state" style={{ marginTop: 80 }}>
        Deal not found. <button className="btn-link" onClick={() => navigate('/deals')}>Back to Deals</button>
      </div>
    )
  }

  const docs = DOCUMENTS.filter(d => d.dealId === deal.id)

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/deals')}>← Deals</button>
          <h1 className="page-title" style={{ marginTop: 4 }}>{deal.name}</h1>
          <span className="page-subtitle">{deal.id} · {deal.borrower} · {deal.sector}</span>
        </div>
        {statusBadge(deal.status)}
      </div>

      <div className="deal-summary-bar">
        {[
          { label: 'Deal Size', value: `$${deal.size}M` },
          { label: 'Type', value: deal.type },
          { label: 'Role', value: deal.role },
          { label: 'Spread', value: deal.spread },
          { label: 'Closing Date', value: deal.closingDate },
          { label: 'Maturity', value: deal.maturity },
          { label: 'Participants', value: `${deal.participants}` },
        ].map(kv => (
          <div className="deal-kv" key={kv.label}>
            <span className="deal-kv-label">{kv.label}</span>
            <span className="deal-kv-value">{kv.value}</span>
          </div>
        ))}
      </div>

      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t}
            className={`tab-btn${activeTab === t ? ' tab-btn--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' && (
        <div className="card">
          <h3 className="section-title">Deal Summary</h3>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 24 }}>
            {deal.name} is a {deal.type.toLowerCase()} of ${deal.size}M arranged for {deal.borrower} ({deal.sector} sector).
            SyndTrak acted as {deal.role}. The transaction closed on {deal.closingDate} with {deal.participants} lender participants,
            priced at {deal.spread} with a maturity date of {deal.maturity}.
          </p>
          <div className="overview-grid">
            <div className="overview-block">
              <div className="overview-block-title">Syndication Stats</div>
              <div className="kv-list">
                <div className="kv-row"><span>Total Lenders</span><span>{deal.participants}</span></div>
                <div className="kv-row"><span>Oversubscription</span><span>1.8×</span></div>
                <div className="kv-row"><span>Currency</span><span>{deal.currency}</span></div>
                <div className="kv-row"><span>Benchmark</span><span>SOFR</span></div>
              </div>
            </div>
            <div className="overview-block">
              <div className="overview-block-title">Key Dates</div>
              <div className="kv-list">
                <div className="kv-row"><span>Mandate Date</span><span>2024-01-15</span></div>
                <div className="kv-row"><span>Launch Date</span><span>2024-02-01</span></div>
                <div className="kv-row"><span>Closing Date</span><span>{deal.closingDate}</span></div>
                <div className="kv-row"><span>Maturity</span><span>{deal.maturity}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Participants' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Lender Participants ({PARTICIPANTS.length})</span>
            <span className="num" style={{ fontSize: 13 }}>
              Total: ${PARTICIPANTS.reduce((s, p) => s + p.commitment, 0)}M
            </span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Institution</th>
                <th>Type</th>
                <th>Region</th>
                <th>Commitment ($M)</th>
                <th>Allocation ($M)</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {PARTICIPANTS.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.institution}</strong></td>
                  <td>{p.type}</td>
                  <td>{p.region}</td>
                  <td className="num">{p.commitment}</td>
                  <td className="num">{p.allocation}</td>
                  <td>
                    <div style={{ fontSize: 13 }}>{p.contactName}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>{p.contactEmail}</div>
                  </td>
                  <td>{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Documents' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Documents ({docs.length})</span>
            <button className="btn-primary" style={{ fontSize: 12, padding: '4px 14px' }}>+ Upload</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Access</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id} className="clickable-row">
                  <td>
                    <span className="doc-icon">📄</span>
                    <span className="deal-name">{doc.name}</span>
                  </td>
                  <td>{doc.type}</td>
                  <td className="mono">{doc.size}</td>
                  <td>{doc.uploadedBy}</td>
                  <td>{doc.uploaded}</td>
                  <td>{doc.restricted ? <span className="badge badge-orange">Restricted</span> : <span className="badge badge-gray">All Lenders</span>}</td>
                  <td>{statusBadge(doc.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'Timeline' && (
        <div className="card">
          <h3 className="section-title">Deal Timeline</h3>
          <div className="timeline">
            {TIMELINE.map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className="timeline-dot" />
                <div className="timeline-body">
                  <div className="timeline-date">{t.date}</div>
                  <div className="timeline-event">{t.event}</div>
                  <div className="timeline-detail">{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
