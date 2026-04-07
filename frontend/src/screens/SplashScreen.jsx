import React, { useEffect } from 'react'
import { useStore } from '../data/store'

export default function SplashScreen() {
  const { setPhase } = useStore()
  useEffect(() => {
    const t = setTimeout(() => setPhase('onboarding'), 2200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: '#000', height: '100vh',
      animation: 'fadeIn 0.5s ease',
    }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulseLogo { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* PnP Logo — matches your brand exactly */}
      <div style={{ animation: 'pulseLogo 2s ease-in-out infinite', marginBottom: 32 }}>
        <svg width="160" height="100" viewBox="0 0 160 100">
          {/* Left P — white */}
          <text x="0" y="82" fontFamily="'Space Grotesk', sans-serif" fontSize="88" fontWeight="700" fill="white">P</text>
          {/* n — green swoosh style */}
          <text x="52" y="82" fontFamily="'Space Grotesk', sans-serif" fontSize="88" fontWeight="700" fill="#00E676">n</text>
          {/* Right P — white */}
          <text x="104" y="82" fontFamily="'Space Grotesk', sans-serif" fontSize="88" fontWeight="700" fill="white">P</text>
          {/* Swoosh curve on n */}
          <path d="M58 20 Q80 -10 102 20" fill="none" stroke="#00E676" strokeWidth="6" strokeLinecap="round"/>
        </svg>
      </div>

      <div style={{ animation: 'slideUp 0.6s ease 0.3s both' }}>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28, fontWeight: 600, color: '#fff',
          letterSpacing: '-0.02em', textAlign: 'center',
        }}>
          pauseNpay
        </div>
        <div style={{ fontSize: 13, color: '#555', textAlign: 'center', marginTop: 8 }}>
          Behavioral AI · Stop. Think. Pay Smart.
        </div>
      </div>

      {/* Loading bar */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 2, background: '#1A1A1A', borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: '#00E676', borderRadius: 1,
          animation: 'loadBar 2s ease forwards',
        }} />
        <style>{`@keyframes loadBar { from{width:0%} to{width:100%} }`}</style>
      </div>
    </div>
  )
}
