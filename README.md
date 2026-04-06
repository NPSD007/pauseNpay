# pauseNpay

**pauseNpay** is a fintech mobile application prototype designed to align your transactions with your actual intentions. By introducing "premium friction," the app actively monitors your digital footprint (like screen time and app usage sequences) to predict and prevent impulse buying in real-time.

## Key Features
- **Mindful Onboarding:** A sleek 6-step wizard to calibrate financial goals and current liquidity.
- **Predictive Risk Heatmap:** Visualizes daily impulse risk windows based on user behavior and time.
- **Real-time ML Risk Scoring:** Powered by a FastAPI backend analyzing app sequences and screen time.
- **Proactive Interventions:** Utilizes local push notifications to alert users during high-risk windows.
- **Premium UI/UX:** Built with React Native, featuring a dark-mode core with high-contrast neon green accents.

## Tech Stack
- **Frontend:** React Native, Expo, TypeScript
- **Backend:** Python, FastAPI, XGBoost

## Getting Started

### 1. Run the Backend
Start the FastAPI server from the project root:
```bash
python -m uvicorn main:app --reload
```

### 2. Run the Frontend
Navigate to the frontend directory and start the Expo development server:
```bash
cd dopamine-frontend
npm install
npx expo start
```

## Concept
This prototype demonstrates how localized AI interventions can establish healthier financial habits by inserting a mindful "pause" right before a potential impulse "pay."
