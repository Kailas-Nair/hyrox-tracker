export function toSecs(m, s) {
  return (parseInt(m) || 0) * 60 + (parseInt(s) || 0)
}

export function fmtTime(secs) {
  if (!secs || secs === Infinity || secs === 0) return '--'
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function secsToMM(secs) {
  if (!secs) return { m: '', s: '' }
  return {
    m: String(Math.floor(secs / 60)),
    s: String(secs % 60).padStart(2, '0'),
  }
}
