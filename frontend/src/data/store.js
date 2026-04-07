import { create } from 'zustand'

export function computeRiskScore(s) {
  let score = 0
  const h = s.hourOfDay
  if (h >= 22 || h <= 4) score += 30
  else if (h >= 20) score += 14
  score += Math.min(s.appSwitchCount * 2, 20)
  score += Math.min(s.appUsageMinutes / 6, 14)
  score += Math.min(s.txFrequencyLastHour * 5, 20)
  if (s.isLateNight) score += 10
  return Math.min(Math.round(score), 100)
}

export function getExplanations(s) {
  const list = []
  if (s.isLateNight || s.hourOfDay >= 22)
    list.push({ icon: 'Moon', text: 'Late-night browsing', weight: 0.88, col: '#00E676' })
  if (s.appSwitchCount >= 8)
    list.push({ icon: 'Smartphone', text: `${s.appSwitchCount} app switches/hr`, weight: 0.71, col: '#FFB800' })
  if (s.txFrequencyLastHour >= 2)
    list.push({ icon: 'Zap', text: `${s.txFrequencyLastHour} purchase attempts`, weight: 0.64, col: '#FF4444' })
  if (s.appUsageMinutes >= 60)
    list.push({ icon: 'Timer', text: `${s.appUsageMinutes}m session`, weight: 0.42, col: '#4488FF' })
  return list.slice(0, 3)
}

export function generateHeatmap() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const data = []
  const risk = h => {
    if (h >= 22 || h <= 3) return 0.7 + Math.random() * 0.3
    if (h >= 6 && h <= 9)  return 0.05 + Math.random() * 0.1
    if (h >= 12 && h <= 14) return 0.3 + Math.random() * 0.2
    return 0.15 + Math.random() * 0.25
  }
  for (let d = 0; d < 7; d++)
    for (let h = 0; h < 24; h++)
      data.push({ day: days[d], hour: h, risk: Math.min(risk(h) + (d >= 5 ? 0.1 : 0), 1) })
  return data
}

export const savingsHistory = [
  { date: 'Mar 19', saved: 500 },
  { date: 'Mar 22', saved: 900 },
  { date: 'Mar 25', saved: 1200 },
  { date: 'Today', saved: 0 },
]

export const recentPauses = [
  { id:1, time:'11:47 PM', merchant:'Myntra', amount:2499, category:'Fashion', action:'cancelled', score:82 },
]

export const useStore = create((set, get) => ({
  appPhase: 'splash', // splash | onboarding | main
  setPhase: p => set({ appPhase: p }),

  activeScreen: 'home',
  setScreen: s => set({ activeScreen: s }),

  monthlyGoal: 0,
  setGoal: g => set({ monthlyGoal: g }),

  signals: { hourOfDay:23, appUsageMinutes:94, appSwitchCount:14, txFrequencyLastHour:3, isLateNight:true, daysSinceLastPurchase:0 },
  get riskScore() { return computeRiskScore(get().signals) },
  updateSignals: signals => set({ signals }),

  pauseVisible: false,
  pauseMerchant: null,
  demoView: 'list',
  setDemoView: (view) => set({ demoView: view }),
  triggerPause: async (merchant) => {
    set({ pauseVisible: true, pauseMerchant: merchant });
    const currentState = get();
    const currentSignals = currentState.signals;

    const body = {
      transaction_id: "tx_" + Date.now(),
      user_id: "demo_user_001",
      amount: merchant.amount,
      merchant_name: merchant.name,
      category: merchant.category,
      timestamp: new Date().toISOString(),
      app_usage_minutes: currentSignals.appUsageMinutes,
      app_switch_count: currentSignals.appSwitchCount,
      tx_frequency_last_hour: currentSignals.txFrequencyLastHour,
      is_late_night: currentSignals.isLateNight,
      days_since_last_purchase: currentSignals.daysSinceLastPurchase || 0
    };

    console.log("🚀 Payload heading to FastAPI:", JSON.stringify(body, null, 2));

    try {
      const response = await fetch('http://127.0.0.1:8000/predict_impulse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (response.ok) {
        const mlData = await response.json();
        console.log("✅ XGBoost Score Returned:", mlData.impulse_score);
        set({ riskScore: Math.round(mlData.impulse_score) });
      } else {
        console.error("Failed to fetch ML risk score, using fallback.");
      }
    } catch (error) {
      console.error("Failed to fetch ML risk score:", error);
    }
  },
  dismissPause: () => set({ pauseVisible:false, pauseMerchant:null }),

  currentBalance: 0,
  savingsGoal: 0,
  isOnboarded: false,
  setOnboardingData: (data) => set((state) => ({ ...state, ...data })),
  completeOnboarding: () => set({ isOnboarded: true, activeScreen: 'dashboard', appPhase: 'main' }),

  totalSaved: 1200,
  savedToday: 0,
  savedThisWeek: 1200,
  pausesToday: 0,
  pausesThisWeek: 3,
  streak: 2,

  heatmapData: generateHeatmap(),
}))
