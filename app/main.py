from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for v0.1 free tier MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=10000)


@app.get("/")
def root():
    return {"status": "API is live"}



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
