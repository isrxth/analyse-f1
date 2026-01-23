from fastapi import APIRouter
from app.services.openf1 import get_race_sessions, get_laps
from app.services.analytics import laps_to_dataframe, driver_race_metrics
from app.core.config import MIN_SUPPORTED_YEAR

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "version": "0.1"}

@router.get("/race/{year}/metrics")
def race_metrics(year: int):
    """Returns driver metrics for the first race in the given year"""
    if year < MIN_SUPPORTED_YEAR:
        return {"error": f"Data available only from {MIN_SUPPORTED_YEAR} onwards"}

    sessions = get_race_sessions(year)
    if not sessions:
        return {"error": "No race sessions found for this year"}

    #(v0.1)
    session_key = sessions[0]["session_key"]

    laps = get_laps(session_key)
    df = laps_to_dataframe(laps)
    metrics = driver_race_metrics(df)

    return metrics.to_dict(orient="records")
