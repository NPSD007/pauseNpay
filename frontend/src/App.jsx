import React, { useState } from 'react'
import BottomNav from './components/BottomNav'
import PauseModal from './components/PauseModal'
import SplashScreen from './screens/SplashScreen'
import OnboardingGoal from './screens/OnboardingGoal'
import Dashboard from './screens/Dashboard'
import PauseDemo from './screens/PauseDemo'
import Heatmap from './screens/Heatmap'
import Insights from './screens/Insights'
import Savings from './screens/Savings'
import { useStore } from './data/store'

const mainScreens = {
  home: Dashboard,
  demo: PauseDemo,
  heatmap: Heatmap,
  insights: Insights,
  savings: Savings,
}

export default function App() {
  const { activeScreen, setScreen, appPhase } = useStore()

  if (appPhase === 'splash') return <div className="app-shell"><SplashScreen /></div>
  if (appPhase === 'onboarding') return <div className="app-shell"><OnboardingGoal /></div>

  const Screen = mainScreens[activeScreen] || Dashboard

  return (
    <div className="app-shell">
      <Screen />
      <BottomNav />
      <PauseModal />
    </div>
  )
}
