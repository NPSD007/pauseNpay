import React from 'react'
import { Moon, Sun, Smartphone, Calendar } from 'lucide-react'

// Hardcoded exact data matching the requirement
const gridData = [
  { label: 'Morning', values: [39, 48, 43, 48, 39, 38, 38] },
  { label: 'Afternoon', values: [35, 81, 0, 81, 5, 9, 9] },
  { label: 'Evening', values: [24, 45, 58, 45, 58, 83, 83] },
  { label: 'Late Night', values: [80, 69, 32, 69, 97, 97, 97] }
]

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

const getCellStyles = (value) => {
  if (value >= 71) return { backgroundColor: '#7CFF2D', color: '#000000' }
  if (value >= 41 && value <= 70) return { backgroundColor: '#4A8A34', color: '#FFFFFF' }
  return { backgroundColor: '#23311E', color: '#6B8263' }
}

export default function Heatmap() {
  return (
    <div className="screen" style={{ padding:'20px', paddingBottom:'120px', display: 'flex', flexDirection: 'column' }}>
      <div className="label-green" style={{ marginBottom:8 }}>RISK PATTERNS</div>
      <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, marginBottom:4 }}>Trigger Heatmap</div>
      <div style={{ fontSize:14, color:'#555', marginBottom:20 }}>Your high-risk spending windows</div>

      {/* Heatmap Grid Section */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {/* Row Labels (Time of Day) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingBottom: '32px' }}>
          {gridData.map(row => (
            <div key={row.label} style={{ fontSize: '12px', color: '#888', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '70px', paddingRight: '12px' }}>
              {row.label}
            </div>
          ))}
        </div>

        {/* The 4x7 Pill Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {gridData.map(row => (
            <div key={row.label} style={{ display: 'flex', gap: '8px' }}>
              {row.values.map((val, idx) => (
                <div key={idx} style={{
                  height: '48px',
                  width: '28px',
                  borderRadius: '24px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  ...getCellStyles(val)
                }}>
                  {val}
                </div>
              ))}
            </div>
          ))}

          {/* Column Labels (Days of Week) */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {DAYS.map((day, idx) => (
              <div key={idx} style={{ width: '28px', textAlign: 'center', fontSize: '12px', color: '#888', fontWeight: 'bold' }}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The Legend */}
      <div style={{ 
        background: '#0A0A0A', 
        borderRadius: '12px', 
        padding: '16px', 
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        border: '0.5px solid #1A1A1A'
      }}>
        {[
          { color: '#23311E', label: 'Low (0-40)' },
          { color: '#4A8A34', label: 'Medium (41-70)' },
          { color: '#7CFF2D', label: 'High (71-100)' }
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: item.color }} />
            <span style={{ fontSize: '12px', color: '#888' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="label-green" style={{ marginBottom:12 }}>KEY PATTERNS</div>
      {[
        { emoji: <Moon size={24} color="#FF4444" />, t:'Peak risk: 10 PM – 1 AM', d:'Your highest impulse window every night', col:'#FF4444' },
        { emoji: <Sun size={24} color="#00E676" />, t:'Safest: 7 AM – 11 AM', d:'Morning purchases are 3× more considered', col:'#00E676' },
        { emoji: <Smartphone size={24} color="#FFB800" />, t:'Social → Shopping pattern', d:'Instagram to Meesho in 87% of cases', col:'#FFB800' },
        { emoji: <Calendar size={24} color="#4488FF" />, t:'Riskiest day: Saturday night', d:'Score peaks at 94 after 10 PM weekends', col:'#4488FF' },
      ].map((ins,i) => (
        <div key={i} style={{
          display:'flex', gap:14, padding:'16px', borderRadius:16, marginBottom:10,
          background:'#0A0A0A', border:`0.5px solid ${ins.col}20`,
        }}>
          <span style={{ display:'flex' }}>{ins.emoji}</span>
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:ins.col, marginBottom:2 }}>{ins.t}</div>
            <div style={{ fontSize:13, color:'#555' }}>{ins.d}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
