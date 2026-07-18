import { AMENDMENTS, DEALS } from '../data/mockData'

function statusBadge(status: string) {
  const map: Record<string, string> = {
    'Voting Open': 'badge-blue',
    Approved: 'badge-green',
    Rejected: 'badge-red',
    Pending: 'badge-orange',
  }
  return <span className={`badge ${map[status] ?? 'badge-gray'}`}>{status}</span>
}

export default function Amendments() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Amendments</h1>
          <span className="page-subtitle">{AMENDMENTS.length} amendments · 1 vote open</span>
        </div>
        <button className="btn-primary">+ New Amendment</button>
      </div>

      <div className="amendments-list">
        {AMENDMENTS.map(a => {
          const deal = DEALS.find(d => d.id === a.dealId)
          const totalVoted = a.votesFor + a.votesAgainst + a.votesAbstain
          const forPct = a.totalLenders > 0 ? (a.votesFor / a.totalLenders) * 100 : 0
          const againstPct = a.totalLenders > 0 ? (a.votesAgainst / a.totalLenders) * 100 : 0

          return (
            <div className="card amendment-card" key={a.id}>
              <div className="amendment-card-header">
                <div>
                  <div className="amendment-id">{a.id}</div>
                  <h3 className="amendment-card-title">{a.title}</h3>
                  <div className="amendment-deal-ref">
                    {deal?.name} · <code className="id-code">{a.dealId}</code>
                  </div>
                </div>
                {statusBadge(a.status)}
              </div>

              <p className="amendment-description">{a.description}</p>

              <div className="amendment-vote-section">
                <div className="vote-stats">
                  <div className="vote-stat">
                    <span className="vote-stat-num green">{a.votesFor}</span>
                    <span className="vote-stat-label">For</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-stat-num red">{a.votesAgainst}</span>
                    <span className="vote-stat-label">Against</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-stat-num gray">{a.votesAbstain}</span>
                    <span className="vote-stat-label">Abstain</span>
                  </div>
                  <div className="vote-stat">
                    <span className="vote-stat-num">{a.totalLenders - totalVoted}</span>
                    <span className="vote-stat-label">Pending</span>
                  </div>
                </div>

                <div className="vote-progress-bar">
                  <div className="vote-progress-for" style={{ width: `${forPct}%` }} />
                  <div className="vote-progress-against" style={{ width: `${againstPct}%` }} />
                </div>
                <div className="vote-progress-labels">
                  <span>{forPct.toFixed(0)}% for</span>
                  <span>{againstPct.toFixed(0)}% against</span>
                </div>
              </div>

              <div className="amendment-footer">
                <span>Voting deadline: <strong>{a.deadline}</strong></span>
                {a.status === 'Voting Open' && (
                  <div className="vote-actions">
                    <button className="btn-vote btn-vote-for">Vote For</button>
                    <button className="btn-vote btn-vote-against">Vote Against</button>
                    <button className="btn-vote btn-vote-abstain">Abstain</button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
