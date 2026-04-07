import React from 'react'
import { useStore } from '../data/store'

const navItems = [
  { id: 'dashboard', icon: '◉', label: 'Dashboard' },
  { id: 'pause', icon: '⏸', label: 'Pause Demo' },
  { id: 'heatmap', icon: '▦', label: 'Heatmap' },
  { id: 'insights', icon: '◈', label: 'Insights' },
  { id: 'savings', icon: '◆', label: 'Savings' },
  { id: 'badges', icon: '✦', label: 'Badges' },
]

export default function Sidebar() {
  const { activeScreen, setScreen } = useStore()

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: 'var(--ink)',
      borderRight: '0.5px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '28px 0',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 32px', borderBottom: '0.5px solid var(--border)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: 'var(--violet-light)' }}>PAUSE</span>
          <span style={{ color: 'var(--text-3)' }}>n</span>
          <span style={{ color: 'var(--neon)' }}>PAY</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          BEHAVIORAL AI v1.0
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '20px 12px', flex: 1 }}>
        {navItems.map(item => {
          const active = activeScreen === item.id
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 'var(--r-md)',
                marginBottom: 4,
                background: active ? 'var(--violet-dim)' : 'transparent',
                border: active ? '0.5px solid rgba(124,106,247,0.3)' : '0.5px solid transparent',
                color: active ? 'var(--violet-light)' : 'var(--text-3)',
                fontSize: 14,
                fontFamily: 'var(--font-body)',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s ease',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-1)' }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' } }}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'var(--violet)' }} />}
            </button>
          )
        })}
      </nav>

      {/* AI Status */}
      <div style={{ padding: '16px 20px', margin: '0 12px', borderRadius: 'var(--r-md)', background: 'var(--neon-dim)', border: '0.5px solid rgba(0,229,195,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--neon)', boxShadow: '0 0 6px var(--neon)', display: 'inline-block' }} />
          <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--neon)', letterSpacing: '0.06em' }}>AI ENGINE LIVE</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>XGBoost + SHAP</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>On-device inference</div>
      </div>
    </aside>
  )
}
