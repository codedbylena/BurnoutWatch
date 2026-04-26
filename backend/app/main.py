from __future__ import annotations

from functools import lru_cache

from fastapi import Depends, FastAPI, Query

from .config import Settings, get_settings
from .metrics import (
    DailyMetricSummary,
    MetricsIngestRequest,
    MetricsIngestResponse,
    MetricsRepository,
    MetricsService,
)


@lru_cache(maxsize=1)
def get_metrics_service() -> MetricsService:
    settings: Settings = get_settings()
    repository = MetricsRepository(settings.sqlite_db_path)
    return MetricsService(repository)


app = FastAPI(
    title=get_settings().app_name,
    version=get_settings().app_version,
)


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/metrics/ingest", response_model=MetricsIngestResponse)
def ingest_metrics(
    request: MetricsIngestRequest,
    service: MetricsService = Depends(get_metrics_service),
) -> MetricsIngestResponse:
    summaries = service.ingest_summaries(request.summaries)
    return MetricsIngestResponse(ingested_count=len(summaries), summaries=summaries)


@app.get("/metrics/daily-summaries", response_model=list[DailyMetricSummary])
def get_daily_summaries(
    worker_id: str = Query(min_length=1),
    start_date: str = Query(pattern=r"^\d{4}-\d{2}-\d{2}$"),
    end_date: str = Query(pattern=r"^\d{4}-\d{2}-\d{2}$"),
    service: MetricsService = Depends(get_metrics_service),
):
    return service.list_daily_summaries(worker_id=worker_id, start_date=start_date, end_date=end_date)
