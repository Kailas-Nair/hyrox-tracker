import { useState, useEffect } from 'react'
import { STATIONS } from '../lib/constants'
import { fmtTime } from '../lib/utils'

const COLORS = ['c1', 'c2', 'c3']
const DOT_COLORS = ['#ff4444', '#4488ff', '#ffaa44']

export default function Compare({ races }) {
  const [selected, setSelected] = useState([null, null, null])

  useEffect(() => {
    if (races.length >= 2) {
      setSelected([races[0]?.id ?? null, races[1]?.id ?? null, null])
    }
  }, [races])

  if (races.length < 2) return (
    <div className="empty-state">Log at least 2 races<br />to compare station times.</div>
  )

  const chosenRaces = selected.map(id => races.find(r => r.id === id) || null)

  function handleSelect(i, val) {
    const next = [...selected]
    next[i] = val === '' ? null : parseInt(val, 10)
    setSelected(next)
  }

  return (
    <div>
      <div className="card">
        <div className="compare-selects">
          {[0, 1, 2].map(i => (
            <div className="compare-select-row" key={i}>
              <label className={`c${i + 1}`}>{i + 1}</label>
              <select value={selected[i] ?? ''} onChange={e => handleSelect(i, e.target.value)}>
                <option value="">— none —</option>
                {races.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.date} · {r.location} ({fmtTime(r.total)})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        {STATIONS.map(st => {
          const times = chosenRaces.map(r => r ? (r.splits[st.id]?.station || 0) : 0)
          const maxT = Math.max(...times, 1)

          return (
            <div className="bar-section" key={st.id}>
              <div className="bar-station-label">{st.name} <span style={{ color: 'var(--text3)', fontWeight: 400 }}>{st.dist}</span></div>
              {chosenRaces.map((r, i) => {
                if (!r) return null
                const t = times[i]
                const pct = t ? Math.round((t / maxT) * 100) : 0
                return (
                  <div className="bar-row" key={i}>
                    <div className="bar-dot" style={{ background: DOT_COLORS[i] }} />
                    <div className="bar-wrap">
                      <div className={`bar-fill ${COLORS[i]}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="bar-time">{t ? fmtTime(t) : '--'}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
