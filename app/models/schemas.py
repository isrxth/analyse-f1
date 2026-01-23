from pydantic import BaseModel

class DriverRaceMetrics(BaseModel):
    driver_number: int
    laps_completed: int
    avg_lap_time: float
    best_lap: float
    pit_out_laps: int