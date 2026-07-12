from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.services.openf1 import get_race_sessions, get_laps, get_session_result, get_drivers
from app.services.analytics import laps_to_dataframe, driver_race_metrics
from app.core.config import MIN_SUPPORTED_YEAR

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "version": "0.1"}

@router.get("/race/{year}/sessions")
def race_sessions(year: int):
    """Returns all race sessions for the given year"""
    try:
        if year < MIN_SUPPORTED_YEAR:
            return JSONResponse(status_code=400, content={"error": f"Data available only from {MIN_SUPPORTED_YEAR} onwards"})

        try:
            sessions = get_race_sessions(year)
        except Exception as api_err:
            print(f"OpenF1 API request error for year {year}: {api_err}")
            status_code = 500
            detail_msg = str(api_err)
            if "Too Many Requests" in detail_msg or "429" in detail_msg:
                status_code = 429
                detail_msg = "OpenF1 API Rate Limit exceeded (Too Many Requests). Please wait a few seconds and try again."
            raise HTTPException(status_code=status_code, detail=detail_msg)

        if not sessions:
            return []

        return [{
            "session_key": s["session_key"],
            "session_name": s["session_name"],
            "meeting_key": s["meeting_key"],
            "country_name": s.get("country_name", ""),
            "location": s.get("location", ""),
            "date_start": s.get("date_start", "")
        } for s in sessions]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sessions: {str(e)}")

@router.get("/race/{year}/metrics")
def race_metrics(year: int, session_key: int = None):
    """Returns driver metrics for a specific race session, defaulting to the first one in the given year"""
    try:
        if year < MIN_SUPPORTED_YEAR:
            return JSONResponse(status_code=400, content={"error": f"Data available only from {MIN_SUPPORTED_YEAR} onwards"})

        if not session_key:
            sessions = get_race_sessions(year)
            if not sessions:
                return []
            session_key = sessions[0]["session_key"]

        try:
            laps = get_laps(session_key)
        except Exception as api_err:
            # If the session_key is mock or OpenF1 returns 404/error, return empty list instead of crashing
            print(f"OpenF1 API error for session {session_key}: {api_err}")
            return []

        df = laps_to_dataframe(laps)
        metrics = driver_race_metrics(df)

        records = metrics.to_dict(orient="records")
        # Ensure NaN values are replaced with None (null in JSON) to ensure valid JSON responses
        for record in records:
            for key, val in record.items():
                if isinstance(val, float) and (val != val):  # check NaN
                    record[key] = None

        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database aggregation failed: {str(e)}")

@router.get("/race/{year}/results")
def race_results(year: int, session_key: int):
    """Returns final finished standings results for the given session"""
    try:
        if year < MIN_SUPPORTED_YEAR:
            return JSONResponse(status_code=400, content={"error": f"Data available only from {MIN_SUPPORTED_YEAR} onwards"})

        try:
            results = get_session_result(session_key)
        except Exception as api_err:
            print(f"OpenF1 API error for session_result {session_key}: {api_err}")
            return []

        # Replace NaN/Null with None just in case
        for r in results:
            for k, v in r.items():
                if isinstance(v, float) and (v != v):
                    r[k] = None

        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch session results: {str(e)}")

@router.get("/race/{year}/drivers")
def race_drivers(year: int, session_key: int):
    """Returns list of drivers for the specific race session"""
    try:
        if year < MIN_SUPPORTED_YEAR:
            return JSONResponse(status_code=400, content={"error": f"Data available only from {MIN_SUPPORTED_YEAR} onwards"})

        try:
            drivers = get_drivers(session_key)
        except Exception as api_err:
            print(f"OpenF1 API error for drivers {session_key}: {api_err}")
            return []

        # Replace NaN/Null with None
        for d in drivers:
            for k, v in d.items():
                if isinstance(v, float) and (v != v):
                    d[k] = None

        return drivers
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch drivers: {str(e)}")
