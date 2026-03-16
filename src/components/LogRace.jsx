import { useState, useCallback } from 'react'
import { STATIONS, RUNS } from '../lib/constants'
import { toSecs, fmtTime } from '../lib/utils'
import TimeInput from './TimeInput'

const emptyTimes = () => {
  const t = {}
  STATIONS.forEach(s => { t[s.id] = { r1m: '', r1s: '', r2m: '', r2s: '' } })
  RUNS.forEach(r => { t[r.id] = { m: '', s: '' } })
  t.rox = { m: '', s: '' }
  return t
}

const emptyAssign = () => {
  const a = {}
  STATIONS.forEach(s => { a[s.id] = 'both' })
  return a
}

export default function LogRace({ onSave, saving }) {
  const [mode, setMode] = useState('singles')
  const [r1name, setR1name] = useState('')
  const [r2name, setR2name] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [times, setTimes] = useState(emptyTimes)
  const [assignments, setAssignments] = useState(emptyAssign)

  const setTime = useCallback((key, field, val) => {
    setTimes(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }))
  }, [])

  function setMode2(m) {
    setMode(m)
    setAssignments(emptyAssign())
  }

  function assignStation(stId, racer) {
    setAssignments(prev => ({ ...prev, [stId]: racer }))
  }

  function calcTotal() {
    let total = 0
    RUNS.forEach(r => { total += toSecs(times[r.id]?.m, times[r.id]?.s) })
    STATIONS.forEach(st => {
      const v1 = toSecs(times[st.id]?.r1m, times[st.id]?.r1s)
      const v2 = toSecs(times[st.id]?.r2m, times[st.id]?.r2s)
      total += Math.max(v1, v2)
    })
    total += toSecs(times.rox?.m, times.rox?.s)
    return total
  }

  function handleSave() {
    const total = calcTotal()
    if (total === 0) return

    const splits = {}
    STATIONS.forEach(st => {
      const v1 = toSecs(times[st.id]?.r1m, times[st.id]?.r1s)
      const v2 = toSecs(times[st.id]?.r2m, times[st.id]?.r2s)
      splits[st.id] = {
        r1: v1,
        r2: v2,
        assigned: assignments[st.id],
        station: Math.max(v1, v2),
      }
    })

    const runs = {}
    RUNS.forEach(r => { runs[r.id] = toSecs(times[r.id]?.m, times[r.id]?.s) })

    onSave({
      date,
      location: location || 'Hyrox',
      mode,
      r1name: r1name || 'Racer 1',
      r2name: r2name || 'Racer 2',
      splits,
      runs,
      roxzone: toSecs(times.rox?.m, times.rox?.s),
      total,
    })

    setTimes(emptyTimes())
    setLocation('')
  }

  const total = calcTotal()
  const isDoubles = mode === 'doubles'
  const r1Label = r1name || 'Racer 1'
  const r2Label = r2name || 'Racer 2'

  return (
    <div>
      <div className="card">
        <div className="toggle-group">
          <button className={mode === 'singles' ? 'active' : ''} onClick={() => setMode2('singles')}>Singles</button>
          <button className={mode === 'doubles' ? 'active' : ''} onClick={() => setMode2('doubles')}>Doubles</button>
        </div>

        <div className="form-row">
          <label>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div className="form-row" style={{ marginBottom: isDoubles ? 12 : 0 }}>
          <label>Location / Event</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Cape Town Hyrox 2026" />
        </div>

        {isDoubles && (
          <div className="doubles-names">
            <div className="form-row" style={{ margin: 0 }}>
              <label>Racer 1</label>
              <input type="text" value={r1name} onChange={e => setR1name(e.target.value)} placeholder="Name" />
            </div>
            <div className="form-row" style={{ margin: 0 }}>
              <label>Racer 2</label>
              <input type="text" value={r2name} onChange={e => setR2name(e.target.value)} placeholder="Name" />
            </div>
          </div>
        )}
      </div>

      {/* Roxzone */}
      <div className="section-label">Roxzone</div>
      <div className="roxzone-card">
        <TimeInput
          label="Total"
          labelClass=""
          valueM={times.rox.m} valueS={times.rox.s}
          onChangeM={v => setTime('rox', 'm', v)}
          onChangeS={v => setTime('rox', 's', v)}
        />
      </div>

      {/* Runs */}
      <div className="section-label">Running Legs</div>
      {RUNS.map(r => (
        <div className="station-card" key={r.id}>
          <div className="station-header">
            <div>
              <div className="station-name">{r.name}</div>
              <div className="station-dist">1km</div>
            </div>
          </div>
          <TimeInput
            label="Time"
            valueM={times[r.id].m} valueS={times[r.id].s}
            onChangeM={v => setTime(r.id, 'm', v)}
            onChangeS={v => setTime(r.id, 's', v)}
          />
        </div>
      ))}

      {/* Stations */}
      <div className="section-label">Workout Stations</div>
      {STATIONS.map(st => {
        const assigned = assignments[st.id]
        const showR1 = !isDoubles || assigned === 'r1' || assigned === 'both'
        const showR2 = isDoubles && (assigned === 'r2' || assigned === 'both')

        return (
          <div className="station-card" key={st.id}>
            <div className="station-header">
              <div>
                <div className="station-name">{st.name}</div>
                <div className="station-dist">{st.dist}</div>
              </div>
            </div>

            {isDoubles && (
              <div className="assign-row">
                <button className={`racer-tag r1 ${assigned === 'r1' ? 'active' : ''}`} onClick={() => assignStation(st.id, 'r1')}>{r1Label}</button>
                <button className={`racer-tag r2 ${assigned === 'r2' ? 'active' : ''}`} onClick={() => assignStation(st.id, 'r2')}>{r2Label}</button>
                <button className={`racer-tag both ${assigned === 'both' ? 'active' : ''}`} onClick={() => assignStation(st.id, 'both')}>Both</button>
              </div>
            )}

            {showR1 && (
              <TimeInput
                label={isDoubles && assigned === 'both' ? r1Label : 'Time'}
                labelClass={isDoubles && assigned === 'both' ? 'r1c' : ''}
                valueM={times[st.id].r1m} valueS={times[st.id].r1s}
                onChangeM={v => setTime(st.id, 'r1m', v)}
                onChangeS={v => setTime(st.id, 'r1s', v)}
              />
            )}
            {showR2 && (
              <TimeInput
                label={r2Label}
                labelClass="r2c"
                valueM={times[st.id].r2m} valueS={times[st.id].r2s}
                onChangeM={v => setTime(st.id, 'r2m', v)}
                onChangeS={v => setTime(st.id, 'r2s', v)}
              />
            )}
          </div>
        )
      })}

      <div className="total-bar">
        <span className="total-label">Finish Time</span>
        <span className="total-time">{total > 0 ? fmtTime(total) : '--:--'}</span>
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={saving || total === 0}>
        {saving ? 'Saving…' : 'Save Race'}
      </button>
    </div>
  )
}
