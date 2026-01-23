import pandas as pd

def laps_to_dataframe(laps_data: list) -> pd.Dataframe:
    df = pd.Dataframe(laps_data)

    df = df[[
        "driver_number",
        "lap_number",
        "lap_duration",
        "is_pit_out_lap"
    ]]
    
    return df

def driver_race_metrics(df: pd.DataFrame):
    metrics = (
        df.groupby("driver_number")
        .agg(
            laps_completed=("lap_number", "max"),
            avg_lap_time=("lap_duration", "mean"),
            best_lap=("lap_duration", "min"),
            pit_out_laps=("is_pit_out_lap", "sum")
        )
        .reset_index()
        .sort_values("best_lap")
    )
    return metrics