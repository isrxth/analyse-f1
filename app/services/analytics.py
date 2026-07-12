import pandas as pd

def laps_to_dataframe(laps_data: list) -> pd.DataFrame:
    if not laps_data:
        return pd.DataFrame(columns=["driver_number", "lap_number", "lap_duration", "is_pit_out_lap"])

    df = pd.DataFrame(laps_data)

    for col in ["driver_number", "lap_number", "lap_duration", "is_pit_out_lap"]:
        if col not in df.columns:
            df[col] = None

    df = df[[
        "driver_number",
        "lap_number",
        "lap_duration",
        "is_pit_out_lap"
    ]]
    
    return df

def driver_race_metrics(df: pd.DataFrame):
    if df.empty:
        return pd.DataFrame(columns=["driver_number", "laps_completed", "avg_lap_time", "best_lap", "pit_out_laps"])

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
    
    # Replace any infinite values with None
    metrics = metrics.replace([float('inf'), float('-inf')], None)
    # Convert all NaN / NaT / Null values to Python None (will serialize to JSON null)
    metrics = metrics.where(pd.notnull(metrics), None)
    return metrics