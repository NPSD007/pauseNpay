import React from 'react'
import { useStore } from '../data/store'

const tabs = [
  { id:'home', label:'Home', icon:(a) => (
    <svg fill="none" viewBox="0 0 24 24" stroke={a?'#00E676':'#555'} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H15v-6h-6v6H3.75A.75.75 0 013 21V9.75z"/>
    </svg>
  )},
  { id:'demo', label:'Pause', icon:(a) => (
    <svg fill={a?'#00E676':'none'} viewBox="0 0 24 24" stroke={a?'#00E676':'#555'} strokeWidth={2}>
      <rect x="6" y="5" width="4" height="14" rx="1"/>
      <rect x="14" y="5" width="4" height="14" rx="1"/>
    </svg>
  )},
  { id:'heatmap', label:'Map', icon:(a) => (
    <svg fill="none" viewBox="0 0 24 24" stroke={a?'#00E676':'#555'} strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { id:'insights', label:'AI', icon:(a) => (
    <svg fill="none" viewBox="0 0 24 24" stroke={a?'#00E676':'#555'} strokeWidth={2}>
      <circle cx="12" cy="12" r="3"/><path strokeLinecap="round" d="M12 5v2M12 17v2M5 12H3M21 12h-2M7.05 7.05L5.64 5.64M18.36 18.36l-1.41-1.41M7.05 16.95l-1.41 1.41M18.36 5.64l-1.41 1.41"/>
    </svg>
  )},
  { id:'savings', label:'Save', icon:(a) => (
    <svg fill="none" viewBox="0 0 24 24" stroke={a?'#00E676':'#555'} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
    </svg>
  )},
]

export default function BottomNav() {
  const { activeScreen, setScreen } = useStore()
  return (
    <nav className="bottom-nav">
      {tabs.map(t => {
        const active = activeScreen === t.id
        return (
          <button key={t.id} className={`nav-item${active?' active':''}`} onClick={() => setScreen(t.id)}>
            {t.icon(active)}
            <span>{t.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
