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
