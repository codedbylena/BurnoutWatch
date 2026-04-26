# Architecture

## Ingestion Slice

This repo now has a first-pass ingestion architecture that stops at normalized daily summaries.

### Frontend

- Expo remains the app shell, but health integrations target Expo development builds rather than Expo Go.
- Real native integration now depends on `react-native-health` for iOS, `react-native-health-connect` for Android, `expo-health-connect` for Android config, and `expo-secure-store` for the local worker ID.
- `frontend/src/metrics/healthIngestionService.js` exposes the platform-neutral mobile contract:
  - `requestPermissions()`
  - `getAvailability()`
  - `fetchDailySummaries(workerId, startDate, endDate)`
- iOS uses a `HealthKitProvider`.
- Android uses a `HealthConnectProvider`.
- Both providers normalize native/source records into the backend ingest shape before upload.
- Manual entry is modeled separately and merged locally for UI use without blocking on device availability.
- The app now ships a minimal sync screen that stores `worker_id` locally, requests permissions, syncs the last 7 days, and reads back canonical summaries from the backend using `EXPO_PUBLIC_API_BASE_URL`.

### Backend

- FastAPI is the HTTP shell.
- SQLite stores one canonical summary row per `worker_id + local_date`.
- Canonical summaries persist merged values plus source metadata so later device syncs and manual edits remain deterministic.
- Retrieval returns merged daily summaries ready for later survey, facial-fatigue, and scoring layers.

## Supported Metrics By Platform

### HealthKit on iOS

- `sleep_duration_hours`
- `sleep_quality_proxy` when detailed sleep stage data exists
- `step_count`
- `resting_heart_rate_bpm`
- `heart_rate_variability_ms`
- `activity_minutes`
- `workout_count`

Apple Watch is not queried directly. The iPhone app reads HealthKit data already synced from Apple Watch into HealthKit.

### Health Connect on Android

- `sleep_duration_hours`
- `sleep_quality_proxy` only when stage/detail data is available in Health Connect
- `step_count`
- `resting_heart_rate_bpm`
- `heart_rate_variability_ms`
- `activity_minutes`
- `workout_count`

Android wearable data is indirect in v1. A watch only contributes if its companion/source app syncs those records into Health Connect on the phone.

### Manual Entry

- `sleep_duration_hours`
- `sleep_quality_manual`
- `shift_count`
- `overtime_hours`
- `fatigue_rating`
- `stress_rating`

Manual work metrics are primary in v1. Shift and overtime are not collected from device integrations in this pass.

## Permission And Fallback Model

- Every metric carries explicit permission state: `granted`, `denied`, or `unavailable`.
- Every metric carries explicit availability state: `present`, `missing`, or `unavailable`.
- Providers return partial summaries instead of throwing when permissions are denied or data is missing.
- Manual entry is always available for work metrics.
- Manual health values only fill gaps when the device metric is null.

## Known Limitations

- Expo development builds are required for real HealthKit and Health Connect native bindings.
- Expo Go is not sufficient for the production integration path.
- The default API URL assumes a local backend: `http://127.0.0.1:8000` on iOS and `http://10.0.2.2:8000` on Android. Physical devices should override it with `EXPO_PUBLIC_API_BASE_URL`.
- Android watch coverage depends on Health Connect sync behavior from source apps.
- `sleep_quality_proxy` is null when source sleep stage detail is absent.
- Burnout score calculation is intentionally out of scope for this slice.
