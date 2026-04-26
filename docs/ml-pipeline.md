# ML Pipeline

The facial fatigue pipeline uses two model paths that can run with deterministic mock inputs during the hackathon and later be replaced by real on-device or server-side models.

Backend code calls the pipeline through:

```python
from app.ml import build_facial_fatigue_pipeline

result = build_facial_fatigue_pipeline().analyze(frames)
```

## Model Paths

The face landmark and geometry model estimates eye openness, blink rate, gaze stability, head movement, facial symmetry, scan quality, and model confidence.

The expression and affect fatigue model estimates low engagement, negative affect, brow tension, jaw tension, mouth tension, expression variance, and model confidence.

## Signal Mapping

Raw outputs are mapped into normalized fatigue signals:

- `eye_fatigue`: higher when eye openness is low, blink rate is unusually low or high, or gaze stability is poor.
- `facial_tension`: combines brow, jaw, and mouth tension with a light facial symmetry penalty.
- `low_engagement`: combines expression engagement, reduced expression variance, and reduced head movement.
- `negative_affect`: combines negative affect proxy and brow tension.
- `scan_quality`: passes through landmark scan quality as a 0-100 signal.
- `confidence`: combines landmark confidence, expression confidence, and scan quality.

All fatigue signals except `confidence` are returned on a 0-100 scale. `confidence` is returned on a 0-1 scale.

## Scoring Formula

```text
facial_fatigue_score =
  eye_fatigue * 0.40
+ facial_tension * 0.25
+ low_engagement * 0.20
+ negative_affect * 0.10
+ quality_adjustment * 0.05
```

`quality_adjustment` is `100 - scan_quality`, so low-quality scans lightly increase uncertainty-related risk.

## Risk Tiers

The score is clamped to 0-100 and mapped into demo-facing tiers:

- `low`: `0 <= score < 35`
- `moderate`: `35 <= score < 65`
- `high`: `65 <= score <= 100`

## API-Ready Result

`FacialFatigueResult` returns:

- `score`: fatigue score from 0-100.
- `risk_tier`: `low`, `moderate`, or `high`.
- `signals`: normalized custom metrics: `eye_fatigue`, `facial_tension`, `low_engagement`, `negative_affect`, `scan_quality`, and `confidence`.
- `raw_outputs`: nested `landmark` and `expression` model outputs for debugging and later model validation.
- `confidence`: 0-1 confidence copied from the mapped signal confidence.
- `explanation`: top weighted contributors to the score.

## Mock-Compatible Models

The current models are deterministic and mock-friendly so the demo remains stable without camera access or bundled ML artifacts. The pipeline accepts structured frame inputs, which lets demo profiles produce low, moderate, and high risk scores without depending on external model runtimes.

Run the backend-side demo from the repository root:

```bash
python -m backend.app.ml.demo_facial_fatigue
```

The command prints JSON results for `low_risk`, `moderate_risk`, and `high_risk`.

## Future Model Replacement

The mock implementations can be replaced behind the same interfaces with MediaPipe face landmarks, ONNX models, or TFLite models. Real implementations should preserve the `predict(frames)` contracts and continue returning normalized outputs so downstream scoring and API behavior do not need to change.

The likely replacement path is:

- MediaPipe Face Landmarker for geometry and scan quality.
- ONNX or TFLite expression model for engagement, affect, and tension proxies.
- The existing mapper and score thresholds remain in place until validated calibration data justifies changing them.
