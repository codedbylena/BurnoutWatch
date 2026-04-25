from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(frozen=True)
class FrameInput:
    frame_id: str
    timestamp_ms: int
    width: int = 640
    height: int = 480
    face_detected: bool = True
    eye_openness: float | None = None
    blink_detected: bool | None = None
    gaze_stability: float | None = None
    head_movement: float | None = None
    facial_symmetry: float | None = None
    scan_quality: float | None = None
    low_engagement: float | None = None
    negative_affect: float | None = None
    brow_tension: float | None = None
    jaw_tension: float | None = None
    mouth_tension: float | None = None
    expression_variance: float | None = None
    confidence: float | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class FaceLandmarkOutput:
    eye_openness: float
    blink_rate: float
    gaze_stability: float
    head_movement: float
    facial_symmetry: float
    scan_quality: float
    confidence: float


@dataclass(frozen=True)
class ExpressionOutput:
    low_engagement: float
    negative_affect: float
    brow_tension: float
    jaw_tension: float
    mouth_tension: float
    expression_variance: float
    confidence: float


@dataclass(frozen=True)
class FatigueSignals:
    eye_fatigue: float
    facial_tension: float
    low_engagement: float
    negative_affect: float
    scan_quality: float
    confidence: float


@dataclass(frozen=True)
class FacialFatigueResult:
    score: float
    signals: FatigueSignals
    landmark_output: FaceLandmarkOutput
    expression_output: ExpressionOutput
    confidence: float
    explanation: list[str]
