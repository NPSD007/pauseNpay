import React from 'react'
import { useStore, computeRiskScore, getExplanations } from '../data/store'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import { Clock, Smartphone, Shuffle, CreditCard, Moon } from 'lucide-react'

export default function Insights() {
  const { signals, updateSignals } = useStore()
  const score = computeRiskScore(signals)
  const explanations = getExplanations(signals)
  const riskColor = score>=70?'#FF4444':score>=40?'#FFB800':'#00E676'

  const sliders = [
    { key:'hourOfDay', label:'Hour of day', icon: <Clock size={16} />, min:0, max:23, fmt:v=>`${v}:00` },
    { key:'appUsageMinutes', label:'Session length', icon: <Smartphone size={16} />, min:0, max:180, fmt:v=>`${v}m` },
    { key:'appSwitchCount', label:'App switches', icon: <Shuffle size={16} />, min:0, max:30, fmt:v=>`${v}×` },
    { key:'txFrequencyLastHour', label:'Tx attempts', icon: <CreditCard size={16} />, min:0, max:10, fmt:v=>`${v}×` },
  ]

  const radar = [
    { s:'Late night', A: signals.isLateNight?90:signals.hourOfDay>=20?50:12 },
    { s:'Session', A: Math.min(signals.appUsageMinutes/1.8,100) },
    { s:'Switches', A: Math.min(signals.appSwitchCount/0.3,100) },
    { s:'Tx freq', A: Math.min(signals.txFrequencyLastHour*10,100) },
    { s:'Risk', A: score },
  ]

  return (
    <div className="screen" style={{ padding:'20px', paddingBottom: '120px' }}>
      <div className="label-green" style={{ marginBottom:8 }}>EXPLAINABLE AI</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:4 }}>Live Insights</div>
      <div style={{ fontSize:14, color:'#555', marginBottom:20 }}>Move sliders — watch AI respond in real-time</div>

      {/* Live score */}
      <div style={{
        padding:'20px', borderRadius:20, marginBottom:20, textAlign:'center',
        background: score>=70?'rgba(255,68,68,0.06)':score>=40?'rgba(255,184,0,0.06)':'rgba(0,230,118,0.06)',
        border:`0.5px solid ${riskColor}30`,
      }}>
        <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.1em', marginBottom:8 }}>LIVE RISK SCORE</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:64, fontWeight:800, color:riskColor, lineHeight:1 }}>{score}</div>
        <div style={{ fontSize:13, color:'#888', marginTop:8 }}>
          {score>=70?'⚠️ Pause would trigger now':score>=40?'⚡ Monitoring elevated risk':'✓ No intervention needed'}
        </div>
      </div>

      {/* Sliders */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px', marginBottom:16 }}>
        <div className="label-green" style={{ marginBottom:16 }}>SIGNAL TUNER</div>
        {sliders.map(({ key, label, icon, min, max, fmt }) => (
          <div key={key} style={{ marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span>{icon}</span>
                <span style={{ fontSize:14, color:'#ccc' }}>{label}</span>
              </div>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:'#00E676' }}>
                {fmt(signals[key])}
              </span>
            </div>
            <input type="range" min={min} max={max} value={signals[key]}
              onChange={e => {
                const val = Number(e.target.value)
                const ns = { ...signals, [key]: val }
                if (key==='hourOfDay') ns.isLateNight = val>=22||val<=4
                updateSignals(ns)
              }}
              style={{
                width:'100%', height:4, borderRadius:2, outline:'none',
                appearance:'none', WebkitAppearance:'none', cursor:'pointer',
                background:`linear-gradient(to right,#00E676 ${((signals[key]-min)/(max-min))*100}%,#1A1A1A 0%)`,
              }}
            />
            <style>{`input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#00E676;border:3px solid #000;cursor:pointer;box-shadow:0 0 10px rgba(0,230,118,0.5)}`}</style>
          </div>
        ))}

        {/* Late night toggle */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px', background:'#111', borderRadius:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span><Moon size={16} /></span>
            <span style={{ fontSize:14, color:'#ccc' }}>Late-night mode</span>
          </div>
          <button onClick={() => updateSignals({...signals, isLateNight:!signals.isLateNight})}
            style={{
              width:48, height:26, borderRadius:13, border:'none', cursor:'pointer', position:'relative',
              background: signals.isLateNight?'#00E676':'#2A2A2A', transition:'background 0.3s',
            }}>
            <div style={{
              width:20, height:20, borderRadius:'50%', background:'#fff',
              position:'absolute', top:3, transition:'left 0.3s',
              left: signals.isLateNight?'25px':'3px',
            }}/>
          </button>
        </div>
      </div>

      {/* Radar */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px', marginBottom:16 }}>
        <div className="label-green" style={{ marginBottom:4 }}>SIGNAL RADAR</div>
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radar}>
            <PolarGrid stroke="#1A1A1A"/>
            <PolarAngleAxis dataKey="s" tick={{fill:'#444',fontSize:11,fontFamily:'Inter'}}/>
            <Radar dataKey="A" stroke="#00E676" fill="#00E676" fillOpacity={0.15} strokeWidth={2}/>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
