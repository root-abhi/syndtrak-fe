import { useState, useEffect } from 'react'

const DATA_API = ''

function statusBadge(status: string) {
  const map: Record<string, string> = { 'Voting Open': 'badge-blue', Approved: 'badge-green', Rejected: 'badge-red', Pending: 'badge-orange' }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Amendments() {
  const [amendments, setAmendments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAmendments = () => {
    const token = localStorage.getItem('syndtrak_token')
    fetch(`${DATA_API}/api/amendments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setAmendments(d.amendments ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchAmendments() }, [])

  const handleVote = async (id: string, vote: string) => {
    const token = localStorage.getItem('syndtrak_token')
    const res = await fetch(`${DATA_API}/api/amendments/${id}/vote`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ vote }),
    })
    if (res.ok) fetchAmendments()
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Amendments</h1>
          <span className="page-subtitle">{loading ? 'Loading…' : `${amendments.length} amendments`}</span>
        </div>
        <button className="btn-primary">+ New Amendment</button>
      </div>

      {loading ? <div className="empty-state">Loading amendments…</div> : (
        <div className="amendments-list">
          {amendments.map((a: any) => {
            const totalVoted = a.votesFor + a.votesAgainst + a.votesAbstain
            const forPct = a.totalLenders > 0 ? (a.votesFor / a.totalLenders) * 100 : 0
            const againstPct = a.totalLenders > 0 ? (a.votesAgainst / a.totalLenders) * 100 : 0
            return (
              <div className="card amendment-card" key={a.id}>
                <div className="amendment-card-header">
                  <div>
                    <div className="amendment-id">{a.id}</div>
                    <h3 className="amendment-card-title">{a.title}</h3>
                    <div className="amendment-deal-ref"><code className="id-code">{a.dealId}</code></div>
                  </div>
                  {statusBadge(a.status)}
                </div>
                <p className="amendment-description">{a.description}</p>
                <div className="amendment-vote-section">
                  <div className="vote-stats">
                    <div className="vote-stat"><span className="vote-stat-num green">{a.votesFor}</span><span className="vote-stat-label">For</span></div>
                    <div className="vote-stat"><span className="vote-stat-num red">{a.votesAgainst}</span><span className="vote-stat-label">Against</span></div>
                    <div className="vote-stat"><span className="vote-stat-num gray">{a.votesAbstain}</span><span className="vote-stat-label">Abstain</span></div>
                    <div className="vote-stat"><span className="vote-stat-num">{a.totalLenders - totalVoted}</span><span className="vote-stat-label">Pending</span></div>
                  </div>
                  <div className="vote-progress-bar">
                    <div className="vote-progress-for" style={{ width: `${forPct}%` }} />
                    <div className="vote-progress-against" style={{ width: `${againstPct}%` }} />
                  </div>
                  <div className="vote-progress-labels"><span>{forPct.toFixed(0)}% for</span><span>{againstPct.toFixed(0)}% against</span></div>
                </div>
                <div className="amendment-footer">
                  <span>Voting deadline: <strong>{a.deadline}</strong></span>
                  {a.status === 'Voting Open' && (
                    <div className="vote-actions">
                      <button className="btn-vote btn-vote-for" onClick={() => handleVote(a.id, 'for')}>Vote For</button>
                      <button className="btn-vote btn-vote-against" onClick={() => handleVote(a.id, 'against')}>Vote Against</button>
                      <button className="btn-vote btn-vote-abstain" onClick={() => handleVote(a.id, 'abstain')}>Abstain</button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
