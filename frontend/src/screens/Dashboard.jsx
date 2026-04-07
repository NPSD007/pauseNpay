import React from 'react'
import { useStore, getExplanations, recentPauses } from '../data/store'
import RiskGauge from '../components/RiskGauge'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { savingsHistory } from '../data/store'
import { User, Flame, ShoppingBag, Pizza, Smartphone, Pause, Moon, Zap, Timer, PauseCircle } from 'lucide-react'

const Tip = ({ children }) => (
  <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:16, padding:'16px' }}>
    {children}
  </div>
)

const IconMap = { Moon, Smartphone, Zap, Timer }

export default function Dashboard() {
  const { signals, totalSaved, savedToday, streak, pausesToday, triggerPause, currentBalance, savingsGoal } = useStore()
  const score = useStore(s => computeRiskScoreLocal(s.signals))
  const explanations = getExplanations(signals)

  function computeRiskScoreLocal(s) {
    let v = 0
    const h = s.hourOfDay
    if (h >= 22 || h <= 4) v += 30
    else if (h >= 20) v += 14
    v += Math.min(s.appSwitchCount * 2, 20)
    v += Math.min(s.appUsageMinutes / 6, 14)
    v += Math.min(s.txFrequencyLastHour * 5, 20)
    if (s.isLateNight) v += 10
    return Math.min(Math.round(v), 100)
  }

  const riskColor = score >= 70 ? '#FF4444' : score >= 40 ? '#FFB800' : '#00E676'

  return (
    <div className="screen" style={{ background:'#000', paddingBottom:'120px' }}>
      {/* Header */}
      <div style={{ padding:'20px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:13, color:'#555', marginBottom:2 }}>Current Balance</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700 }}>₹{currentBalance.toLocaleString()}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:2 }}>SAVINGS GOAL</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:18, fontWeight:700, color:'#00E676' }}>₹{savingsGoal.toLocaleString()}</div>
        </div>
      </div>

      {/* Risk card */}
      <div style={{ margin:'16px 20px 0', padding:'24px 20px', background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:24, textAlign:'center' }}>
        <div className="label-green" style={{ marginBottom:16 }}>IMPULSE RISK SCORE · LIVE</div>
        <RiskGauge score={score} />

        {/* SHAP reasons */}
        {explanations.length > 0 && (
          <div style={{ marginTop:20, borderTop:'0.5px solid #1A1A1A', paddingTop:16, textAlign:'left' }}>
            <div style={{ fontSize:11, color:'#444', fontWeight:600, letterSpacing:'0.1em', marginBottom:12 }}>WHY THIS SCORE</div>
            {explanations.map((e, i) => {
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <span style={{ fontSize: 16 }}>{React.createElement(IconMap[e.icon] || Timer, { size: 16, color: e.col })}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, color:'#ccc', marginBottom:3 }}>{e.text}</div>
                    <div style={{ height:3, background:'#1A1A1A', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${e.weight*100}%`, background:e.col, borderRadius:2, boxShadow:`0 0 6px ${e.col}60`, transition:'width 1s ease' }}/>
                    </div>
                  </div>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:'#444' }}>{Math.round(e.weight*100)}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, margin:'12px 20px 0' }}>
        <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:18, padding:'18px 16px' }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:6 }}>SAVED TODAY</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#00E676' }}>₹{savedToday.toLocaleString()}</div>
          <div style={{ fontSize:12, color:'#444', marginTop:4 }}>{pausesToday} pauses triggered</div>
        </div>
        <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:18, padding:'18px 16px' }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:6 }}>TOTAL SAVED</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹{totalSaved.toLocaleString()}</div>
          <div style={{ marginTop: 8, height: 4, background: '#1A1A1A', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${Math.min((totalSaved / (savingsGoal || 1)) * 100, 100)}%`, background: '#00E676' }} />
          </div>
          <div style={{ fontSize:12, color:'#444', marginTop:6, display:'flex', alignItems:'center', gap:4 }}>
             <Flame size={14} color="#FFB800" /> {streak}-day streak ({Math.round((totalSaved / (savingsGoal || 1)) * 100)}% of goal)
          </div>
        </div>
      </div>

      {/* Savings chart */}
      <div style={{ margin:'12px 20px 0', background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'18px 12px 12px' }}>
        <div style={{ paddingLeft:8, marginBottom:12 }}>
          <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em' }}>SAVINGS TREND</div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={savingsHistory} margin={{top:0,right:4,left:-24,bottom:0}}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false} interval={2}/>
            <YAxis tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#111',border:'0.5px solid #222',borderRadius:10,fontFamily:'Inter',fontSize:12}} formatter={v=>[`₹${v}`,'Saved']}/>
            <Area type="monotone" dataKey="saved" stroke="#00E676" strokeWidth={2} fill="url(#g1)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Demo trigger */}
      <div style={{ margin:'12px 20px 0' }}>
        <button className="btn-green" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }} onClick={() => triggerPause({ name:'Myntra', amount:2499, items:3 })}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><PauseCircle size={18} /> Demo Pause</div>
        </button>
      </div>

      {/* Recent pauses */}
      <div style={{ margin:'16px 20px 0' }}>
        <div style={{ fontSize:11, color:'#555', fontWeight:600, letterSpacing:'0.08em', marginBottom:12 }}>RECENT PAUSES</div>
        {recentPauses.map(p => (
          <div key={p.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 0', borderBottom:'0.5px solid #111' }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'#111', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {p.category==='Fashion'?<ShoppingBag size={20} color="#fff"/>:p.category==='Food'?<Pizza size={20} color="#fff"/>:p.category==='Gadgets'?<Smartphone size={20} color="#fff"/>:<ShoppingBag size={20} color="#fff"/>}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600 }}>{p.merchant}</div>
              <div style={{ fontSize:12, color:'#555', marginTop:2 }}>{p.time} · {p.category}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:15, fontWeight:700, color: p.action==='cancelled'?'#00E676':'#555' }}>
                {p.action==='cancelled'?'+':'-'}₹{p.amount.toLocaleString()}
              </div>
              <div style={{
                fontSize:10, fontWeight:700, letterSpacing:'0.06em',
                color: p.action==='cancelled'?'#00E676':'#FF4444',
                marginTop:2,
              }}>{p.action==='cancelled'?'SAVED':'SPENT'}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height:8 }}/>
    </div>
  )
}
