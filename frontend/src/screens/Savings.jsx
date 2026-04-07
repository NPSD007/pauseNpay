import React from 'react'
import { useStore, savingsHistory } from '../data/store'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Smartphone, Flame } from 'lucide-react'

export default function Savings() {
  const { totalSaved, streak, monthlyGoal } = useStore()
  const goal = monthlyGoal || 12500
  const pct = Math.min(Math.round((totalSaved / (goal * 3)) * 100), 100)

  const goals = [
    { label:'New iPhone 16', target:79999, emoji: <Smartphone size={28} color="#fff" /> },
  ]

  return (
    <div className="screen" style={{ padding:'16px 20px', paddingBottom: '120px' }}>
      <div className="label-green" style={{ marginBottom:8 }}>SAVINGS TRACKER</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:20 }}>
        Your Money Saved
      </div>

      {/* Hero */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:24, padding:'28px 24px', marginBottom:16, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', width:200, height:200, borderRadius:'50%', background:'rgba(0,230,118,0.04)', filter:'blur(30px)' }}/>
        <div style={{ fontSize:13, color:'#555', marginBottom:8 }}>TOTAL SAVED SINCE JOINING</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:52, fontWeight:800, color:'#00E676', lineHeight:1 }}>
          ₹{totalSaved.toLocaleString()}
        </div>
        <div style={{ fontSize:14, color:'#555', marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <Flame size={16} color="#FFB800" /> {streak}-day mindful streak
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:24, paddingTop:20, borderTop:'0.5px solid #1A1A1A' }}>
          {[{l:'Pauses',v:'47'},{l:'Override rate',v:'23%'},{l:'Days active',v:'63'}].map((s,i)=>(
            <div key={i}>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:22, fontWeight:700, color:'#fff' }}>{s.v}</div>
              <div style={{ fontSize:11, color:'#444', marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly goal progress */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px', marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:600 }}>Monthly goal progress</div>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:14, fontWeight:700, color:'#00E676' }}>{pct}%</div>
        </div>
        <div style={{ height:8, background:'#1A1A1A', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
          <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#00C853,#00E676)', borderRadius:4, boxShadow:'0 0 12px rgba(0,230,118,0.4)', transition:'width 1s ease' }}/>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <span style={{ fontSize:12, color:'#555' }}>₹{totalSaved.toLocaleString()} saved</span>
          <span style={{ fontSize:12, color:'#555' }}>Goal: ₹{goal.toLocaleString()}/mo × 3</span>
        </div>
      </div>

      {/* Chart */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px', marginBottom:16 }}>
        <div className="label-green" style={{ marginBottom:12 }}>SAVINGS TIMELINE</div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={savingsHistory} margin={{top:0,right:0,left:-24,bottom:0}}>
            <defs>
              <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E676" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00E676" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false} interval={2}/>
            <YAxis tick={{fill:'#333',fontSize:9}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'#111',border:'0.5px solid #222',borderRadius:10,fontSize:12}} formatter={v=>[`₹${v}`,'Saved']}/>
            <Area type="monotone" dataKey="saved" stroke="#00E676" strokeWidth={2} fill="url(#sg)" dot={false}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Goals */}
      <div className="label-green" style={{ marginBottom:12 }}>SAVINGS GOALS</div>
      {goals.map((g,i) => {
        const p = Math.min(Math.round((totalSaved/g.target)*100),100)
        return (
          <div key={i} style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:18, padding:'18px', marginBottom:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ display:'flex' }}>{g.emoji}</span>
                <div>
                  <div style={{ fontSize:15, fontWeight:700 }}>{g.label}</div>
                  <div style={{ fontSize:12, color:'#555', marginTop:2 }}>Target: ₹{g.target.toLocaleString()}</div>
                </div>
              </div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800, color:'#00E676' }}>{p}%</div>
            </div>
            <div style={{ height:6, background:'#1A1A1A', borderRadius:3 }}>
              <div style={{ height:'100%', width:`${p}%`, background:'linear-gradient(90deg,#00C853,#00E676)', borderRadius:3, boxShadow:'0 0 8px rgba(0,230,118,0.3)' }}/>
            </div>
          </div>
        )
      })}
    </div>
  )
}
