from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/race/{year}/metrics")
def get_metrics(year: int):
    return [
        {
            "driver_number": 44,
            "laps_completed": 56,
            "avg_lap_time": 90.123,
            "best_lap": 88.456,
            "pit_out_laps": 2
        }
    ]
