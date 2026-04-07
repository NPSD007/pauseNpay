import React, { useEffect, useState, useRef } from 'react'
import { useStore, getExplanations } from '../data/store'
import { AlertTriangle, Pause, ShieldAlert, XCircle, Clock, Smartphone, Zap, Moon, Timer } from 'lucide-react'

export default function PauseModal() {
  const { pauseVisible, pauseMerchant, currentBalance, dismissPause, signals } = useStore()
  const [secs, setSecs] = useState(10)
  const [ready, setReady] = useState(false)
  const ref = useRef()

  const explanations = getExplanations(signals)

  useEffect(() => {
    if (!pauseVisible) { setSecs(10); setReady(false); clearInterval(ref.current); return }
    setSecs(10); setReady(false)
    ref.current = setInterval(() => {
      setSecs(s => { if (s <= 1) { setReady(true); clearInterval(ref.current); return 0 } return s - 1 })
    }, 1000)
    return () => clearInterval(ref.current)
  }, [pauseVisible])

  if (!pauseVisible) return null

  const pct = ((10 - secs) / 10) * 100
  const R = 52, circ = 2 * Math.PI * R
  const dash = circ - (circ * pct / 100)

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:1000,
      background:'rgba(0,0,0,0.95)',
      display:'flex', alignItems:'flex-end',
      backdropFilter:'blur(8px)',
    }}>
      <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
      <div style={{
        width:'100%', maxWidth:'430px', margin:'0 auto',
        background:'#0A0A0A', borderRadius:'28px 28px 0 0',
        border:'0.5px solid #1A1A1A', borderBottom:'none',
        animation:'sheetUp 0.35s cubic-bezier(0.34,1.2,0.64,1)',
        paddingBottom:'env(safe-area-inset-bottom)',
      }}>
        {/* Green top accent */}
        <div style={{ height:3, background:'linear-gradient(90deg,#00E676,#00C853)', borderRadius:'28px 28px 0 0' }}/>

        {/* Handle */}
        <div style={{ display:'flex', justifyContent:'center', padding:'12px 0 8px' }}>
          <div style={{ width:36, height:4, borderRadius:2, background:'#222' }}/>
        </div>

        <div style={{ padding:'8px 24px 28px' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:'#00E676', letterSpacing:'0.12em', marginBottom:6 }}>
                <Pause size={14} color="var(--green, #00E676)" /> PAUSE GUARD ACTIVE
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, lineHeight:1.1 }}>
                Hold on a sec...
              </div>
            </div>
            <div style={{ textAlign:'right', background:'#111', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontSize:15, fontWeight:700 }}>{pauseMerchant?.name||'Myntra'}</div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:'#00E676' }}>
                ₹{(pauseMerchant?.amount||2499).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Balance Warning */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'var(--amber-dim, rgba(255, 184, 0, 0.08))',
            border: '0.5px solid rgba(245,158,11,0.3)', padding: '12px 16px',
            borderRadius: 'var(--r-md, 14px)', marginTop: '20px', marginBottom: '24px'
          }}>
            <AlertTriangle size={16} color="var(--amber, #FFB800)" />
            <span style={{ color: 'var(--amber, #FFB800)', fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', lineHeight: '1.4' }}>
              WARNING: This purchase consumes {(( (pauseMerchant?.amount || 2499) / (currentBalance || 15000) ) * 100).toFixed(1)}% of your ₹{(currentBalance || 15000).toLocaleString()} liquid balance.
            </span>
          </div>

          {/* Countdown ring */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
            <div style={{ position:'relative', width:130, height:130 }}>
              <svg width={130} height={130} style={{transform:'rotate(-90deg)'}}>
                <circle cx={65} cy={65} r={R} fill="none" stroke="#1A1A1A" strokeWidth={10}/>
                <circle cx={65} cy={65} r={R} fill="none"
                  stroke={ready?'#00E676':'#00E676'}
                  strokeWidth={10} strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={dash}
                  style={{transition:'stroke-dashoffset 1s linear', filter:'drop-shadow(0 0 10px #00E67680)'}}
                />
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                {ready
                  ? <span style={{ fontSize:40 }}><XCircle size={48} color="#00E676" /></span>
                  : <>
                      <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:46, fontWeight:800, color:'#00E676', lineHeight:1 }}>{secs}</span>
                      <span style={{ fontSize:10, color:'#444', letterSpacing:'0.1em', marginTop:2 }}>BREATHE</span>
                    </>
                }
              </div>
            </div>
          </div>

          {/* XAI reasons */}
          <div style={{ background:'#111', borderRadius:16, padding:'16px', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:700, color:'#00E676', letterSpacing:'0.1em', marginBottom:12 }}>
              <ShieldAlert size={14} color="var(--green, #00E676)" /> WHY YOU'RE BEING PAUSED
            </div>
            {explanations.map((e, i) => {
              const IconMap = { Moon, Smartphone, Zap, Clock, Timer }
              const IconComponent = IconMap[e.icon] || Zap
              return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom: i<explanations.length-1?12:0 }}>
                <div style={{ width:34, height:34, borderRadius:10, background:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <IconComponent size={20} color={e.col} />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, color:'#ccc' }}>{e.text}</div>
                  <div style={{ height:3, background:'#1A1A1A', borderRadius:2, marginTop:6 }}>
                    <div style={{ height:'100%', width:`${e.weight*100}%`, background:e.col, borderRadius:2, boxShadow:`0 0 6px ${e.col}` }}/>
                  </div>
                </div>
              </div>
              )
            })}
          </div>

          {/* Buttons */}
          <div style={{ display:'grid', gap:10 }}>
            <button
              disabled={!ready}
              onClick={dismissPause}
              style={{
                padding:'17px', borderRadius:16, fontSize:16, fontWeight:700, fontFamily:"'Inter',sans-serif",
                background: ready ? '#00E676' : '#111',
                color: ready ? '#000' : '#333',
                border: `0.5px solid ${ready ? '#00E676' : '#222'}`,
                cursor: ready ? 'pointer' : 'default',
                transition:'all 0.4s ease',
                boxShadow: ready ? '0 0 24px rgba(0,230,118,0.3)' : 'none',
              }}
            >
              {ready ? 'Proceed to pay →' : `Wait ${secs}s to unlock...`}
            </button>
            <button onClick={dismissPause} style={{
              padding:'16px', borderRadius:16, fontSize:16, fontWeight:500, fontFamily:"'Inter',sans-serif",
              background:'transparent', color:'#00E676',
              border:'0.5px solid rgba(0,230,118,0.3)',
              cursor:'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}>
              <XCircle size={18} /> Save to wishlist instead
            </button>
          </div>

          <div style={{ textAlign:'center', marginTop:16, fontSize:11, color:'#333' }}>
            10-second delays reduce impulse spending by 47% · AI Model v2.1
          </div>
        </div>
      </div>
    </div>
  )
}
