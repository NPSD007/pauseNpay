# pauseNpay

A Behavioral AI-based financial guard.

## Structure Overview for Deployment

This repository acts as a monorepo consisting of two parts:

### 1. Frontend (`/frontend`)
*   **Framework**: React Native / Vite
*   **Deployment**: Ideal for Vercel, Netlify, or any static hosting.
*   **Build Settings**: The root folder is `frontend/`. Build command is `npm run build` or `vite build`.
*   **Environment**: Create a `VITE_API_URL` environment variable containing the production URL of your backend.

### 2. Backend (`/backend`)
*   **Framework**: Python, FastAPI
*   **Deployment**: Ideal for Render or Heroku.
*   **Start Command**: Located in the root `backend/` directory. Typically, Render will use `uvicorn main:app --host 0.0.0.0 --port $PORT`.
*   **Port Setup**: `os.environ.get("PORT", 8000)` ensures it complies with dynamic port assignments in cloud environments.
