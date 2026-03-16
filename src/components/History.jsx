import { useState } from 'react'
import { STATIONS, RUNS } from '../lib/constants'
import { fmtTime } from '../lib/utils'

function getPBTotal(races) {
  return races.length ? Math.min(...races.map(r => r.total)) : Infinity
}

export default function History({ races, loading }) {
  const [expanded, setExpanded] = useState(null)

  if (loading) return <div className="loading">Loading races…</div>
  if (!races.length) return (
    <div className="empty-state">No races logged yet.<br />Log your first race to see history.</div>
  )

  const pbTotal = getPBTotal(races)

  return (
    <div>
      {races.map((race, i) => {
        const isExpanded = expanded === race.id
        const isPB = race.total === pbTotal
        const isDoubles = race.mode === 'doubles'

        return (
          <div
            key={race.id}
            className={`race-card ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setExpanded(isExpanded ? null : race.id)}
          >
            <div className="race-header">
              <div>
                <div className="race-loc">{race.location}</div>
                <div className="race-meta">
                  {race.date}{isDoubles ? ` · ${race.r1name} & ${race.r2name}` : ''}
                </div>
              </div>
              <div className="race-right">
                <div className="race-total">{fmtTime(race.total)}</div>
                <div className="badges">
                  {isPB && <span className="badge pb">PB</span>}
                  {isDoubles && <span className="badge dbl">Doubles</span>}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="splits-wrap">
                <table className="splits-table">
                  <thead>
                    <tr>
                      <th>Segment</th>
                      <th>{isDoubles ? race.r1name : 'Time'}</th>
                      {isDoubles && <th>{race.r2name}</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {race.roxzone > 0 && (
                      <tr className="roxzone-row">
                        <td>Roxzone</td>
                        <td className="val" style={{ color: '#ffaa44' }}>{fmtTime(race.roxzone)}</td>
                        {isDoubles && <td></td>}
                      </tr>
                    )}
                    {RUNS.map(r => (
                      race.runs[r.id] > 0 && (
                        <tr key={r.id} className="run-row">
                          <td>{r.name}</td>
                          <td className="val">{fmtTime(race.runs[r.id])}</td>
                          {isDoubles && <td></td>}
                        </tr>
                      )
                    ))}
                    {STATIONS.map(st => {
                      const sp = race.splits[st.id] || {}
                      return (
                        <tr key={st.id}>
                          <td>{st.name}</td>
                          <td className="val">{sp.r1 ? fmtTime(sp.r1) : '--'}</td>
                          {isDoubles && <td className="val">{sp.r2 ? fmtTime(sp.r2) : '--'}</td>}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
