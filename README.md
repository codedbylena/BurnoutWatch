# BurnoutWatch
BurnoutWatch is an AI-powered mobile app that predicts healthcare worker burnout using shift patterns, overtime, and recovery trends. It supports patient care and hospital safety through early intervention, aligning with CareDevi's mission of practical AI-driven healthcare innovation. 

## Hackathon Demo Mode

For a reliable demo without a native HealthKit/Health Connect build or a reachable backend, run the frontend with:

```bash
cd frontend
EXPO_PUBLIC_DEMO_MODE=1 npm start
```

Demo mode uses seeded phone-health summaries and an in-memory metrics API client. The app still exercises the same permission, sync, canonical summary, and manual fallback screens, but labels the connector as demo mode.

For the real backend/device path:

```bash
uvicorn backend.app.main:app --reload
cd frontend
EXPO_PUBLIC_API_BASE_URL=http://<computer-lan-ip>:8000 npm start
```

Use an Expo development build for native HealthKit or Health Connect reads. Expo Go cannot validate those native health APIs.

## Camera Face-Scan Flow

The check-in camera button now opens the phone camera (via `expo-image-picker`), captures a photo, and sends metadata to:

- `POST /ml/facial-fatigue/analyze-photo`

The backend runs the facial-fatigue pipeline and blends that score into the deterministic burnout score.

Install frontend dependencies after pulling latest changes:

```bash
cd frontend
npm install
```
