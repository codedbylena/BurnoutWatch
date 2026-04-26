# API Contracts

## Scope

This pass defines ingestion and retrieval for normalized daily metric summaries. It does not calculate burnout scores yet.

## Endpoints

### `POST /metrics/ingest`

Accepts one or more normalized daily summaries from mobile device sync or manual entry.

Request shape:

```json
{
  "summaries": [
    {
      "worker_id": "worker-123",
      "local_date": "2026-04-25",
      "source_platform": "ios_healthkit",
      "permissions": {
        "sleep_duration_hours": "granted",
        "sleep_quality_proxy": "granted",
        "step_count": "granted"
      },
      "availability": {
        "sleep_duration_hours": "present",
        "sleep_quality_proxy": "missing",
        "step_count": "present"
      },
      "sleep_duration_hours": 7.4,
      "sleep_quality_proxy": null,
      "step_count": 10421,
      "resting_heart_rate_bpm": 57,
      "heart_rate_variability_ms": 38,
      "activity_minutes": 44,
      "workout_count": 1,
      "source_recorded_at": "2026-04-25T22:05:00Z"
    }
  ]
}
```

Response shape:

```json
{
  "ingested_count": 1,
  "summaries": [
    {
      "worker_id": "worker-123",
      "local_date": "2026-04-25",
      "source_platform": "ios_healthkit",
      "permissions": {},
      "availability": {},
      "sleep_duration_hours": 7.4,
      "sleep_quality_proxy": null,
      "step_count": 10421,
      "resting_heart_rate_bpm": 57,
      "heart_rate_variability_ms": 38,
      "activity_minutes": 44,
      "workout_count": 1,
      "sleep_quality_manual": null,
      "shift_count": null,
      "overtime_hours": null,
      "fatigue_rating": null,
      "stress_rating": null,
      "field_sources": {
        "sleep_duration_hours": "device",
        "step_count": "device"
      },
      "source_recorded_at": "2026-04-25T22:05:00Z",
      "ingested_at": "2026-04-26T00:00:00Z",
      "last_device_sync_at": "2026-04-25T22:05:00Z",
      "last_manual_entry_at": null
    }
  ]
}
```

### `GET /metrics/daily-summaries?worker_id=&start_date=&end_date=`

Returns canonical per-day summaries after merge precedence has been applied.

### `POST /recommendations/generate`

Accepts an already-computed burnout score context and returns safe worker-facing recommendation cards. This endpoint does not calculate or change the burnout score.

Request shape:

```json
{
  "worker_id": "worker-123",
  "local_date": "2026-04-26",
  "burnout_score": 68.4,
  "risk_tier": "high",
  "confidence": 0.82,
  "data_completeness": "partial",
  "top_contributors": [
    {
      "name": "sleep_duration_hours",
      "value": 4.8,
      "direction": "risk_increasing",
      "explanation": "Sleep was below the recovery target."
    }
  ],
  "daily_metrics": {
    "sleep_duration_hours": 4.8,
    "overtime_hours": 3.5
  }
}
```

Response shape:

```json
{
  "worker_id": "worker-123",
  "local_date": "2026-04-26",
  "risk_tier": "high",
  "summary": "Your current burnout risk is high based on elevated strain and reduced recovery signals.",
  "recommendations": [
    {
      "title": "Prioritize recovery before the next shift",
      "detail": "If possible, protect a longer sleep window and avoid taking extra overtime today.",
      "category": "recovery",
      "priority": "high"
    }
  ],
  "safety_note": "This is a wellness recommendation, not a medical diagnosis.",
  "generated_by": "mock",
  "generated_at": "2026-04-26T12:00:00Z"
}
```

Demo configuration:

```bash
LLM_PROVIDER=mock
```

Optional Hugging Face configuration:

```bash
LLM_PROVIDER=huggingface
LLM_MODEL=HuggingFaceTB/SmolLM2-360M-Instruct
HF_API_TOKEN=your_hugging_face_token
```

## Public Types

### `DailyMetricSummary`

Fields:

- `worker_id`
- `local_date`
- `source_platform`: `ios_healthkit`, `android_health_connect`, or `manual`
- `permissions`: per-metric `granted`, `denied`, or `unavailable`
- `availability`: per-metric `present`, `missing`, or `unavailable`
- health metrics:
  - `sleep_duration_hours`
  - `sleep_quality_proxy`
  - `step_count`
  - `resting_heart_rate_bpm`
  - `heart_rate_variability_ms`
  - `activity_minutes`
  - `workout_count`
- manual metrics:
  - `sleep_quality_manual`
  - `shift_count`
  - `overtime_hours`
  - `fatigue_rating`
  - `stress_rating`
- `field_sources`: per-field `device` or `manual`
- `source_recorded_at`
- `ingested_at`
- `last_device_sync_at`
- `last_manual_entry_at`

### `MetricAvailability`

Per-metric map with `present`, `missing`, or `unavailable`.

### `MetricPermissions`

Per-metric map with `granted`, `denied`, or `unavailable`.

### `ManualWorkInput`

Manual entry fields supported in v1:

- `sleep_duration_hours`
- `sleep_quality_manual`
- `shift_count`
- `overtime_hours`
- `fatigue_rating`
- `stress_rating`

### `MetricsIngestRequest`

Batch request wrapper containing `summaries: DailyMetricSummary[]`.

### `MetricsIngestResponse`

Response containing `ingested_count` and canonical merged `summaries`.

## Merge Precedence

- Device data is authoritative for health metrics.
- Manual values never overwrite non-null device health values.
- Manual health values only fill null device health fields.
- Manual values are authoritative for `shift_count`, `overtime_hours`, `fatigue_rating`, and `stress_rating`.
- `sleep_quality_proxy` is device-derived only. Manual sleep quality is captured separately as `sleep_quality_manual`.

## Validation Notes

- Device payloads must not send `shift_count`, `overtime_hours`, `fatigue_rating`, or `stress_rating`.
- Manual payloads must not send `sleep_quality_proxy`.
- Partial payloads are valid as long as the metric permission and availability state explain the gap.

## Mobile Sync Notes

- The mobile app now syncs the last 7 local calendar days on explicit user action.
- The app stores `worker_id` locally until a real auth flow exists.
- iOS reads HealthKit on iPhone only. Apple Watch data is included only after it syncs into HealthKit.
- Android reads Health Connect on the phone only. Wearable data is included only after the source app syncs it into Health Connect.
- Set `EXPO_PUBLIC_API_BASE_URL` when the mobile app cannot reach the backend through the simulator defaults.
