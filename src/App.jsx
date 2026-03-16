import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './lib/supabase'
import LogRace from './components/LogRace'
import History from './components/History'
import Compare from './components/Compare'
import PBs from './components/PBs'

const TABS = ['log', 'history', 'compare', 'pbs']

const ICONS = {
  log: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
    </svg>
  ),
  compare: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  pbs: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
}

function Toast({ message, type, show }) {
  return (
    <div className={`toast ${type === 'error' ? 'error' : ''} ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('log')
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: 'ok' })
  const toastTimer = useRef(null)

  function showToast(message, type = 'ok') {
    clearTimeout(toastTimer.current)
    setToast({ show: true, message, type })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  const loadRaces = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      showToast('Failed to load races', 'error')
    } else {
      setRaces(data || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadRaces() }, [loadRaces])

  async function handleSave(raceData) {
    setSaving(true)
    const { error } = await supabase.from('races').insert([raceData])
    if (error) {
      showToast('Failed to save race', 'error')
    } else {
      showToast('Race saved!')
      setTab('history')
      await loadRaces()
    }
    setSaving(false)
  }

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-title">Hyrox<span>.</span></div>
        <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'Barlow Condensed', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {races.length} race{races.length !== 1 ? 's' : ''}
        </div>
      </div>

      {tab === 'log'     && <LogRace onSave={handleSave} saving={saving} />}
      {tab === 'history' && <History races={races} loading={loading} />}
      {tab === 'compare' && <Compare races={races} />}
      {tab === 'pbs'     && <PBs races={races} loading={loading} />}

      <nav className="bottom-nav">
        {TABS.map(t => (
          <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {ICONS[t]}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <Toast {...toast} />
    </div>
  )
}
