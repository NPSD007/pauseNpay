# pauseNpay — Behavioral AI Spending Guard

> **Stop. Think. Pay Smart.**  
> Black + neon green fintech app that intercepts impulse purchases using on-device AI.

---

## 🚀 Run Locally (Desktop + Phone on same WiFi)

```bash
# 1. Unzip and enter folder
cd pausenpay

# 2. Install all dependencies
chmod +x install.sh && ./install.sh
# OR manually:
npm install && npm run start
```

**Open on your phone:**
1. Make sure your phone and laptop are on the **same WiFi**
2. Find your laptop's local IP:
   - Windows: run `ipconfig` → look for IPv4 Address
   - Mac/Linux: run `ifconfig` → look for `inet` under `en0`
3. Open `http://YOUR_IP:5173` in your phone's browser
4. For iPhone: tap Share → "Add to Home Screen" for full-screen app feel
5. For Android: tap ⋮ → "Add to Home Screen"

---

## 🌐 Deploy for Free (anyone can open on phone)

### Option A — Netlify (drag & drop, 2 minutes)
```bash
npm run build          # creates /dist folder
# Go to netlify.com → drag the /dist folder into the browser
# Get a live URL like: https://pausenpay.netlify.app
```

### Option B — Vercel (CLI, 1 minute)
```bash
npm run build
npx vercel --prod
# Follow prompts → get live URL instantly
```

### Option C — GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npx gh-pages -d dist
# Live at: https://YOUR_USERNAME.github.io/pausenpay
```

---

## 📱 App Flow

```
Splash Screen (2s)
      ↓
Onboarding — Set monthly savings goal
      ↓
Main App (Bottom Nav: Home · Pause · Map · AI · Save)
      ↓
Pause Modal (triggered on checkout)
```

---

## 📁 File Structure

```
pausenpay/
├── install.sh              ← One-click installer
├── netlify.toml            ← Netlify deployment config
├── vercel.json             ← Vercel deployment config
├── vite.config.js          ← host:true for phone LAN access
├── index.html              ← PWA meta tags, mobile viewport
└── src/
    ├── App.jsx             ← App shell, phase router
    ├── index.css           ← Design system (black + #00E676)
    ├── main.jsx            ← React entry
    ├── data/
    │   └── store.js        ← Zustand store + AI scoring engine
    ├── components/
    │   ├── BottomNav.jsx   ← Mobile tab bar
    │   ├── PauseModal.jsx  ← 10s countdown bottom sheet
    │   └── RiskGauge.jsx   ← Animated SVG arc gauge
    └── screens/
        ├── SplashScreen.jsx    ← PnP logo splash
        ├── OnboardingGoal.jsx  ← Monthly target setter
        ├── Dashboard.jsx       ← Risk score + recent pauses
        ├── PauseDemo.jsx       ← Tap merchant → trigger pause
        ├── Heatmap.jsx         ← 7d × 24h risk grid
        ├── Insights.jsx        ← Live signal tuner + SHAP
        ├── Savings.jsx         ← Money saved + goals
        └── Badges.jsx          ← Achievements + leaderboard
```

---

## 🎨 Design System

| Token       | Value     | Usage                  |
|-------------|-----------|------------------------|
| `--black`   | `#000000` | App background         |
| `--black-3` | `#111111` | Cards                  |
| `--green`   | `#00E676` | Primary accent / CTA   |
| `--green-2` | `#00C853` | Green gradient end     |
| `--white`   | `#FFFFFF` | Primary text           |
| `--grey-2`  | `#888888` | Secondary text         |
| `--red`     | `#FF4444` | High risk              |
| `--amber`   | `#FFB800` | Medium risk            |

Fonts: **Space Grotesk** (headings) + **Inter** (body)

---

## 🤖 AI Engine (in store.js)

```js
// Simulated XGBoost scoring — replace with real ONNX model
computeRiskScore({ hourOfDay, appUsageMinutes, appSwitchCount,
                   txFrequencyLastHour, isLateNight })
// Returns 0–100 impulse risk score

getExplanations(signals)
// Returns top SHAP-style feature contributions with weights
```

---

## 📦 All Dependencies

```json
"react": "^18.2.0"           — UI framework
"react-dom": "^18.2.0"       — DOM renderer
"react-router-dom": "^6.22"  — Routing
"framer-motion": "^11.0.8"   — Animations
"recharts": "^2.12.2"        — Charts (AreaChart, RadarChart)
"lucide-react": "^0.344.0"   — Icons
"zustand": "^4.5.2"          — State management
"date-fns": "^3.3.1"         — Date helpers
"clsx": "^2.1.0"             — Conditional classes
"vite": "^5.1.4"             — Build tool (devDep)
```

---

*"10 seconds is all it takes to turn an impulse into a decision."*
