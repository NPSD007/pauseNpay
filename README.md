# pauseNpay — Behavioral AI Spending Guard

> **Stop. Think. Pay Smart.**  
> Black + neon green fintech app that intercepts impulse purchases using on-device AI.

---

## � Tech Stack

- **Frontend:** React (via Vite), Zustand (State/ML Risk mapping), Framer Motion, Recharts
- **Backend:** Python, FastAPI, XGBoost, Pandas, SHAP, scikit-learn

---

## 🏗 Structure Overview for Deployment

This repository acts as a monorepo consisting of two parts:

### 1. Frontend (`/frontend`)
*   **Framework**: React Native Web / Vite / React DOM
*   **Deployment**: Ideal for Vercel, Netlify, or any static hosting.
*   **Build Settings**: The root folder is `frontend/`. Build command is `npm run build` or `vite build`.
*   **Environment**: Create a `VITE_API_URL` environment variable containing the production URL of your backend.

### 2. Backend (`/backend`)
*   **Framework**: Python, FastAPI
*   **Deployment**: Ideal for Render or Heroku.
*   **Start Command**: Located in the root `backend/` directory. Typically, Render will use `uvicorn main:app --host 0.0.0.0 --port $PORT`.
*   **Port Setup**: `os.environ.get("PORT", 8000)` ensures it complies with dynamic port assignments in cloud environments.

---

## �🚀 Run Locally (Desktop + Phone on same WiFi)

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
cd frontend/src
npm install
npm dev start
```
## Live Demo
**https://pause-npay.vercel.app/**

## Concept
This prototype demonstrates how localized AI interventions can establish healthier financial habits by inserting a mindful "pause" right before a potential impulse "pay."
