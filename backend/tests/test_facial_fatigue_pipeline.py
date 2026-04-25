from __future__ import annotations

import sys
from pathlib import Path
from unittest import TestCase, main


sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.ml import build_facial_fatigue_pipeline, build_mock_scan_frames


class FacialFatiguePipelineTest(TestCase):
    def test_profile_scores_are_ordered_by_risk(self) -> None:
        pipeline = build_facial_fatigue_pipeline()

        low = pipeline.analyze(build_mock_scan_frames("low_risk")).score
        moderate = pipeline.analyze(build_mock_scan_frames("moderate_risk")).score
        high = pipeline.analyze(build_mock_scan_frames("high_risk")).score

        self.assertLess(low, moderate)
        self.assertLess(moderate, high)

    def test_score_is_normalized(self) -> None:
        result = build_facial_fatigue_pipeline().analyze(build_mock_scan_frames("high_risk"))

        self.assertGreaterEqual(result.score, 0)
        self.assertLessEqual(result.score, 100)

    def test_fatigue_signals_are_normalized(self) -> None:
        result = build_facial_fatigue_pipeline().analyze(build_mock_scan_frames("moderate_risk"))
        signal_values = [
            result.signals.eye_fatigue,
            result.signals.facial_tension,
            result.signals.low_engagement,
            result.signals.negative_affect,
            result.signals.scan_quality,
        ]

        for value in signal_values:
            self.assertGreaterEqual(value, 0)
            self.assertLessEqual(value, 100)

    def test_confidence_is_normalized(self) -> None:
        result = build_facial_fatigue_pipeline().analyze(build_mock_scan_frames("low_risk"))

        self.assertGreaterEqual(result.confidence, 0)
        self.assertLessEqual(result.confidence, 1)


if __name__ == "__main__":
    main()
