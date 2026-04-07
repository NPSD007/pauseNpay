import React, { useEffect, useState } from 'react'

export default function RiskGauge({ score }) {
  const [displayed, setDisplayed] = useState(0)
  useEffect(() => {
    let v = 0
    const step = () => { v = Math.min(v + 2, score); setDisplayed(v); if (v < score) requestAnimationFrame(step) }
    const r = requestAnimationFrame(step)
    return () => cancelAnimationFrame(r)
  }, [score])

  const color = score >= 70 ? '#FF4444' : score >= 40 ? '#FFB800' : '#00E676'
  const label = score >= 70 ? 'HIGH RISK' : score >= 40 ? 'MEDIUM' : 'SAFE'
  const R = 72, cx = 90, cy = 90
  const startA = -220, sweepA = 260
  const toRad = d => d * Math.PI / 180
  const ax = a => cx + R * Math.cos(toRad(a))
  const ay = a => cy + R * Math.sin(toRad(a))
  const arc = (f, t) => {
    const lg = (t - f) > 180 ? 1 : 0
    return `M ${ax(f)} ${ay(f)} A ${R} ${R} 0 ${lg} 1 ${ax(t)} ${ay(t)}`
  }
  const endA = startA + sweepA
  const fillA = startA + sweepA * (displayed / 100)

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
      <svg width={180} height={160} viewBox="0 0 180 160">
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {/* Track */}
        <path d={arc(startA, endA)} fill="none" stroke="#1A1A1A" strokeWidth={14} strokeLinecap="round"/>
        {/* Fill */}
        {displayed > 0 && <path d={arc(startA, fillA)} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" filter="url(#glow)" style={{transition:'stroke 0.4s'}}/>}
        {/* Score */}
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={44} fontWeight={800} fontFamily="'Space Grotesk',sans-serif" fill={color}>{displayed}</text>
        <text x={cx} y={cy+18} textAnchor="middle" fontSize={10} fontFamily="'Space Grotesk',sans-serif" fill="#444" letterSpacing="3">/100</text>
      </svg>
      <div style={{
        display:'inline-flex', alignItems:'center', gap:7,
        padding:'6px 18px', borderRadius:100, marginTop:-8,
        background: score>=70 ? 'rgba(255,68,68,0.1)' : score>=40 ? 'rgba(255,184,0,0.1)' : 'rgba(0,230,118,0.1)',
        border: `0.5px solid ${color}40`,
      }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}`, display:'inline-block' }}/>
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color, letterSpacing:'0.1em', fontWeight:700 }}>{label}</span>
      </div>
    </div>
  )
}
