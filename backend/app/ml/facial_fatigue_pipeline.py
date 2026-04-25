from __future__ import annotations

from .expression_fatigue_model import ExpressionFatigueModel
from .face_landmark_model import FaceLandmarkModel
from .fatigue_signal_mapper import FatigueSignalMapper
from .types import FacialFatigueResult, FatigueSignals, FrameInput


def _clamp_score(value: float) -> float:
    return max(0.0, min(100.0, value))


class FacialFatiguePipeline:
    def __init__(
        self,
        landmark_model: FaceLandmarkModel | None = None,
        expression_model: ExpressionFatigueModel | None = None,
        mapper: FatigueSignalMapper | None = None,
    ) -> None:
        self.landmark_model = landmark_model or FaceLandmarkModel()
        self.expression_model = expression_model or ExpressionFatigueModel()
        self.mapper = mapper or FatigueSignalMapper()

    def analyze(self, frames: list[FrameInput]) -> FacialFatigueResult:
        landmark_output = self.landmark_model.predict(frames)
        expression_output = self.expression_model.predict(frames)
        signals = self.mapper.map(landmark_output, expression_output)
        quality_adjustment = 100.0 - signals.scan_quality

        score = (
            signals.eye_fatigue * 0.40
            + signals.facial_tension * 0.25
            + signals.low_engagement * 0.20
            + signals.negative_affect * 0.10
            + quality_adjustment * 0.05
        )

        return FacialFatigueResult(
            score=round(_clamp_score(score), 2),
            signals=signals,
            landmark_output=landmark_output,
            expression_output=expression_output,
            confidence=signals.confidence,
            explanation=self._explain(signals),
        )

    def _explain(self, signals: FatigueSignals) -> list[str]:
        factors = {
            "eye fatigue": signals.eye_fatigue,
            "facial tension": signals.facial_tension,
            "low engagement": signals.low_engagement,
            "negative affect": signals.negative_affect,
            "scan quality penalty": 100.0 - signals.scan_quality,
        }
        ranked = sorted(factors.items(), key=lambda item: item[1], reverse=True)
        return [f"{label}: {round(value, 2)}" for label, value in ranked[:3]]
