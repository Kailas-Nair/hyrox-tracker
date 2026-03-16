import { STATIONS } from '../lib/constants'
import { fmtTime } from '../lib/utils'

function computePBs(races) {
  const stationPBs = {}
  STATIONS.forEach(st => { stationPBs[st.id] = Infinity })
  let bestTotal = Infinity
  let bestRox = Infinity

  races.forEach(r => {
    if (r.total < bestTotal) bestTotal = r.total
    if (r.roxzone && r.roxzone < bestRox) bestRox = r.roxzone
    STATIONS.forEach(st => {
      const t = r.splits[st.id]?.station || 0
      if (t && t < stationPBs[st.id]) stationPBs[st.id] = t
    })
  })

  return { stationPBs, bestTotal, bestRox }
}

export default function PBs({ races, loading }) {
  if (loading) return <div className="loading">Loading…</div>
  if (!races.length) return (
    <div className="empty-state">No races logged yet.</div>
  )

  const { stationPBs, bestTotal, bestRox } = computePBs(races)
  const singles = races.filter(r => r.mode === 'singles').length
  const doubles = races.filter(r => r.mode === 'doubles').length

  return (
    <div>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Best Finish</div>
          <div className="metric-value">{fmtTime(bestTotal)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Races Logged</div>
          <div className="metric-value">{races.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Best Roxzone</div>
          <div className="metric-value">{bestRox === Infinity ? '--' : fmtTime(bestRox)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Singles / Doubles</div>
          <div className="metric-value">{singles}S / {doubles}D</div>
        </div>
      </div>

      <div className="section-label">Station Personal Bests</div>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {STATIONS.map(st => (
          <div className="pb-row" key={st.id}>
            <span className="pb-station">{st.name}</span>
            <span className="pb-time">{stationPBs[st.id] === Infinity ? '--' : fmtTime(stationPBs[st.id])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
