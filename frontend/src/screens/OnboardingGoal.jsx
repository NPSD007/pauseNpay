import React, { useState } from 'react'
import { useStore } from '../data/store'

export default function OnboardingGoal() {
  const { setOnboardingData, completeOnboarding } = useStore()
  const [step, setStep] = useState(1)
  const [balance, setBalance] = useState('')
  const [goal, setGoalValue] = useState('')

  const handleContinue = () => {
    if (step === 1) {
      setOnboardingData({ currentBalance: Number(balance) || 15000 })
      setStep(2)
    } else {
      setOnboardingData({ savingsGoal: Number(goal) || 12500 })
      completeOnboarding()
    }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', padding:'24px', background:'#000' }}>
      {/* Progress bar — matches your screenshot exactly */}
      <div className="progress-bar-top" style={{ '--progress': step === 1 ? '30%' : '60%' }}>
        <div style={{ height:'100%', width: step === 1 ? '30%' : '60%', background:'#00E676', borderRadius:'0 2px 2px 0', transition:'width 0.4s' }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Gold image area */}
        <div style={{
          display:'flex', justifyContent:'center', alignItems:'center',
          padding: '32px 0 0',
        }}>
          <div style={{
            width: 220, height: 220, borderRadius: 24,
            background: 'linear-gradient(145deg, #0D2420, #091A16)',
            display:'flex', alignItems:'center', justifyContent:'center',
            position:'relative', overflow:'hidden',
          }}>
            {/* Gold bars emoji art */}
            <div style={{ fontSize: 80, filter: 'drop-shadow(0 8px 24px rgba(255,184,0,0.4))' }}>{step === 1 ? '🏦' : '🪙'}</div>
            <div style={{ position:'absolute', bottom:20, fontSize:32 }}></div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'32px 0', display:'flex', flexDirection:'column' }}>
          {/* Heading — matches screenshot typography */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:38, fontWeight:700, lineHeight:1.1, letterSpacing:'-0.02em' }}>
              <span style={{ color:'#fff' }}>{step === 1 ? 'What is your ' : 'What is your '}</span>
              <span style={{ color:'#00E676', fontStyle:'italic' }}>{step === 1 ? 'current' : 'savings'}</span>
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:38, fontWeight:700, lineHeight:1.1, letterSpacing:'-0.02em' }}>
              <span style={{ color:'#00E676', fontStyle:'italic' }}>{step === 1 ? 'balance' : 'goal'}</span>
              <span style={{ color:'#fff' }}>{step === 1 ? ' right now?' : ' for this month?'}</span>
            </div>
            <p style={{ fontSize:15, color:'#888', marginTop:14, lineHeight:1.6 }}>
              {step === 1 
                ? 'We need to know your safe spending limit to protect you from overdrafts.' 
                : 'Precision in planning leads to acceleration in results. Define your mindful target.'}
            </p>
          </div>

          {/* Input — matches screenshot */}
          <div style={{ marginBottom:32 }}>
            <div className="label-green" style={{ marginBottom:16 }}>
              {step === 1 ? 'AVAILABLE BALANCE' : 'MONTHLY TARGET'}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:36, fontWeight:700, color:'#fff' }}>₹</span>
              <input
                className="input-line"
                type="number"
                placeholder={step === 1 ? "e.g., 25,000" : "e.g., 1,000"}
                value={step === 1 ? balance : goal}
                onChange={e => step === 1 ? setBalance(e.target.value) : setGoalValue(e.target.value)}
                inputMode="numeric"
              />
            </div>
          </div>

          {/* Stats row — matches screenshot (Only show on step 2 for realism, or customize) */}
          {step === 2 && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'#1A1A1A', borderRadius:16, overflow:'hidden', marginBottom:'auto' }}>
              <div style={{ padding:'20px', background:'#000' }}>
                <div style={{ fontSize:20, marginBottom:6 }}></div>
                <div className="label-green" style={{ fontSize:10, marginBottom:6 }}>RECOMMENDED</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹12,500</div>
              </div>
              <div style={{ padding:'20px', background:'#000' }}>
                <div style={{ fontSize:20, marginBottom:6 }}></div>
                <div style={{ fontSize:10, fontWeight:700, color:'#888', letterSpacing:'0.1em', marginBottom:6 }}>LAST MONTH</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:26, fontWeight:700, color:'#fff' }}>₹8,000</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA — matches screenshot */}
      <div style={{ paddingBottom: '30px', marginTop: 'auto' }}>
        <button className="btn-green" onClick={handleContinue} style={{ fontSize:18, width: '100%' }}>
          Continue <span style={{ fontSize:20 }}>→</span>
        </button>
      </div>
    </div>
  )
}
