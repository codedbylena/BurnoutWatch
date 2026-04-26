# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial project structure.
- Frontend scaffold.
- Backend scaffold.
- ML module structure.
- LLM module structure.
- Documentation structure.
- Project-level ignore files.
- Facial fatigue ML pipeline under `backend/app/ml`.
  - Uses two deterministic model paths for the current v1: face landmark/geometry and expression/affect.
  - Maps raw model outputs into normalized custom metrics: `eye_fatigue`, `facial_tension`, `low_engagement`, `negative_affect`, `scan_quality`, and `confidence`.
  - Returns an API-ready `FacialFatigueResult` with a 0-100 `score`, `risk_tier`, normalized `signals`, nested `raw_outputs`, 0-1 `confidence`, and top contributing `explanation` values.
  - Supports seeded demo profiles for `low_risk`, `moderate_risk`, and `high_risk` through `build_mock_scan_frames`.
  - Can be called from backend code with `build_facial_fatigue_pipeline().analyze(frames)`.
  - Includes a demo command: `python -m backend.app.ml.demo_facial_fatigue`.
  - Documents the scoring formula, risk tiers, signal mapping, and future MediaPipe/ONNX/TFLite replacement path in `docs/ml-pipeline.md`.
  - Adds unit coverage for score ordering, normalization, confidence bounds, risk tier thresholds, API payload shape, and empty or low-quality scans.
- Health metrics ingestion foundation across mobile and backend.
  - Adds Expo development-build health ingestion services for iOS HealthKit and Android Health Connect.
  - Normalizes daily summaries for sleep, steps, resting heart rate, HRV, activity minutes, workout count, permissions, and availability.
  - Adds manual fallback support for sleep, sleep quality, shifts, overtime, fatigue rating, and stress rating.
  - Adds FastAPI endpoints for `POST /metrics/ingest` and `GET /metrics/daily-summaries`.
  - Persists canonical SQLite daily summaries by `worker_id` and `local_date`.
  - Applies deterministic merge precedence where device health metrics win and manual work metrics remain authoritative.
  - Documents supported metrics, permissions, payloads, fallback behavior, and known platform limitations.
  - Adds backend and frontend tests for normalization, validation, merge behavior, manual fallback, and retrieval.
- Device Metric Sync dashboard for the Expo app.
  - Adds responsive Overview, Readiness, Manual, and Manual Entry screens.
  - Shows connector status, API target, worker identity, canonical summaries, permission state, and merge readiness.
  - Lets workers submit manual fallback and work metrics into the same backend ingest pipeline.
- Native Expo app routing for the check-in and metrics flows.
  - Adds a native login, dashboard, check-in prep, check-in, and burnout status flow.
  - Routes Dashboard to Device Metric Sync without modifying teammate-owned UI component files.
  - Keeps the teammate-style check-in experience and the new ingestion dashboard connected in one app flow.
- LLM recommendation-layer handoff documentation.
  - Defines the LLM as a recommendation layer, not the burnout scoring brain.
  - Documents the planned `Scoring Calculator -> RecommendationContext -> RecommendationService -> LLM Client` flow.
  - Recommends mock responses for stable demos and local Gemma through Ollama for the first real LLM provider path.
