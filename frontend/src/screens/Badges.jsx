import React from 'react'
import { Flame, User, Moon, Bot, Trophy, Diamond } from 'lucide-react'

const badges = [
  { id:1, emoji: <Flame size={28} />, title:'7-Day Streak', desc:'Completed all pauses', unlocked:true },
  { id:2, emoji: <User size={28} />, title:'Mindful Spender', desc:'Saved ₹10,000+', unlocked:true },
  { id:3, emoji: <Moon size={28} />, title:'Night Guardian', desc:'Stopped 5 late buys', unlocked:true },
  { id:4, emoji: <Bot size={28} />, title:'AI Partner', desc:'Model calibrated', unlocked:true },
  { id:5, emoji: <Trophy size={28} />, title:'Iron Will', desc:'30-day streak', unlocked:false },
  { id:6, emoji: <Diamond size={28} />, title:'Diamond Saver', desc:'Saved ₹50,000+', unlocked:false },
]

const leaderboard = [
  { rank:1, name:'Priya K.',    saved:48200, streak:34, badge:'💎' },
  { rank:2, name:'Rahul M.',    saved:32100, streak:28, badge:'🏆' },
  { rank:3, name:'Ananya S.',   saved:29800, streak:21, badge:'🥉' },
  { rank:4, name:'You (Arjun)', saved:18420, streak:7,  badge:'🔥', isYou:true },
  { rank:5, name:'Kiran R.',    saved:14300, streak:5,  badge:'⚡' },
]

const reportCard = [
  { label:'Pauses completed', value:11, max:11, grade:'A+' },
  { label:'Override rate',    value:3,  max:11, grade:'A'  },
  { label:'Night stops',      value:5,  max:5,  grade:'A+' },
  { label:'Streak kept',      value:7,  max:7,  grade:'A+' },
]

export default function Badges() {
  return (
    <div className="screen" style={{ padding:'16px 20px', paddingBottom:'120px' }}>
      <div className="label-green" style={{ marginBottom:8 }}>GAMIFICATION</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:20 }}>
        Achievements
      </div>

      {/* Badge grid */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
        {badges.map(b => (
          <div key={b.id} style={{
            padding:'18px 12px', borderRadius:18, textAlign:'center',
            background: b.unlocked ? 'rgba(0,230,118,0.06)' : '#0A0A0A',
            border: `0.5px solid ${b.unlocked ? 'rgba(0,230,118,0.25)' : '#1A1A1A'}`,
            opacity: b.unlocked ? 1 : 0.45,
            transition:'transform 0.2s',
            position:'relative',
          }}
            onMouseEnter={e => { if(b.unlocked) e.currentTarget.style.transform='translateY(-3px)' }}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
          >
            {!b.unlocked && (
              <div style={{ position:'absolute', top:8, right:8, fontSize:10 }}>🔒</div>
            )}
            <div style={{ marginBottom:8, color: b.unlocked ? '#fff' : '#555', display: 'flex', justifyContent: 'center' }}>{b.emoji}</div>
            <div style={{ fontSize:12, fontWeight:700, color: b.unlocked?'#00E676':'#555', marginBottom:4 }}>
              {b.title}
            </div>
            <div style={{ fontSize:11, color:'#444', lineHeight:1.4 }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* Weekly report card */}
      <div style={{ background:'#0A0A0A', border:'0.5px solid #1A1A1A', borderRadius:20, padding:'20px', marginBottom:16 }}>
        <div className="label-green" style={{ marginBottom:16 }}>WEEKLY REPORT CARD</div>
        {reportCard.map((item,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <div style={{
              fontFamily:"'Space Grotesk',sans-serif", fontSize:20, fontWeight:800,
              color:'#00E676', width:36, textAlign:'right', flexShrink:0,
            }}>{item.grade}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:'#ccc', marginBottom:5 }}>{item.label}</div>
              <div style={{ height:4, background:'#1A1A1A', borderRadius:2 }}>
                <div style={{
                  height:'100%', borderRadius:2,
                  width:`${(item.value/item.max)*100}%`,
                  background:'#00E676',
                  boxShadow:'0 0 6px rgba(0,230,118,0.4)',
                }}/>
              </div>
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, color:'#444', minWidth:32, textAlign:'right' }}>
              {item.value}/{item.max}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
