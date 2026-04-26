# Scoring Model

BurnoutWatch calculates a deterministic burnout risk score from canonical daily summaries. Phone and watch data are represented by HealthKit or Health Connect summaries; watch data is included after it syncs into the phone health store.

## Inputs

The scorer uses the existing merged `DailyMetricSummary` records:

- Device health: `sleep_duration_hours`, `sleep_quality_proxy`, `step_count`, `resting_heart_rate_bpm`, `heart_rate_variability_ms`, `activity_minutes`, and `workout_count`.
- Manual work and self-report: `sleep_quality_manual`, `shift_count`, `overtime_hours`, `fatigue_rating`, and `stress_rating`.

Device values remain authoritative for health metrics. Manual sleep duration only fills missing device sleep, and manual sleep quality is used only when device sleep quality is unavailable.

## Score Formula

Each day is scored from `0-100` using weighted risk categories:

- Recovery risk: `35%`
- Workload risk: `25%`
- Physiological strain: `20%`
- Self-report risk: `20%`

The final score uses the requested date range, normally the last 7 days. Newer days get more weight with a `0.9` decay for each previous day. Missing fields lower confidence and are not treated as zero-risk. If a full category is missing, available categories are reweighted for that day.

Risk tiers:

- `low`: `0 <= score < 35`
- `moderate`: `35 <= score < 65`
- `high`: `65 <= score <= 100`

## Output

`GET /scoring/burnout` returns:

- `burnout_score`
- `risk_tier`
- `confidence`
- `contributors`
- `days_used`
- `start_date` and `end_date`

The implementation lives in `backend/app/scoring/`. The frontend demo mode mirrors the same calculation in memory so the hackathon demo can show a final score without a backend or native health data.
