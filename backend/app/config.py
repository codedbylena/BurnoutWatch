from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    app_name: str = "BurnoutWatch Metrics API"
    app_version: str = "0.1.0"
    sqlite_db_path: str = str(Path(__file__).resolve().parents[1] / "burnoutwatch.db")


def get_settings() -> Settings:
    return Settings(
        sqlite_db_path=os.getenv(
            "BURNOUTWATCH_DB_PATH",
            str(Path(__file__).resolve().parents[1] / "burnoutwatch.db"),
        )
    )
