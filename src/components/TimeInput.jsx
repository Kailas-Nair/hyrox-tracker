import { useRef } from 'react'

export default function TimeInput({ idM, idS, valueM, valueS, onChangeM, onChangeS, labelClass = '', label = 'Time' }) {
  const sRef = useRef(null)

  function handleMChange(e) {
    const v = e.target.value
    onChangeM(v)
    if (v.length >= 2) sRef.current?.focus()
  }

  return (
    <div className="time-row">
      <span className={`time-label ${labelClass}`}>{label}</span>
      <input
        className="time-input"
        type="number"
        min="0"
        max="99"
        placeholder="mm"
        value={valueM}
        onChange={handleMChange}
      />
      <span className="time-sep">:</span>
      <input
        ref={sRef}
        className="time-input"
        type="number"
        min="0"
        max="59"
        placeholder="ss"
        value={valueS}
        onChange={e => onChangeS(e.target.value)}
      />
    </div>
  )
}
