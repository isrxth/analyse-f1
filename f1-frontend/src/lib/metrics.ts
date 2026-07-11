import type { DriverRaceMetrics, RaceSummary } from "../types";

export function formatLapTime(value: number): string {
  return `${value.toFixed(3)}s`;
}

export function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatDriverLabel(driverNumber: number): string {
  return `#${driverNumber}`;
}

export function buildSparklinePath(values: number[], width = 120, height = 32): string {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    const y = height / 2;
    return `M 0 ${y} L ${width} ${y}`;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const normalized = (value - min) / range;
      const y = height - normalized * (height - 4) - 2;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function sortDrivers(metrics: DriverRaceMetrics[]): DriverRaceMetrics[] {
  return [...metrics].sort((left, right) => {
    const bestLapDifference = left.best_lap - right.best_lap;
    if (bestLapDifference !== 0) {
      return bestLapDifference;
    }

    const avgLapDifference = left.avg_lap_time - right.avg_lap_time;
    if (avgLapDifference !== 0) {
      return avgLapDifference;
    }

    return right.laps_completed - left.laps_completed;
  });
}

export function summarizeDrivers(metrics: DriverRaceMetrics[]): RaceSummary {
  if (metrics.length === 0) {
    return {
      driverCount: 0,
      totalLaps: 0,
      totalPitOutLaps: 0,
      averageLapTime: 0,
      bestLapTime: 0,
      slowestLapTime: 0,
      leader: null,
      trailingDriver: null,
    };
  }

  const sorted = sortDrivers(metrics);
  const totalLaps = metrics.reduce((sum, driver) => sum + driver.laps_completed, 0);
  const totalPitOutLaps = metrics.reduce((sum, driver) => sum + driver.pit_out_laps, 0);
  const averageLapTime =
    metrics.reduce((sum, driver) => sum + driver.avg_lap_time, 0) / metrics.length;
  const bestLapTime = Math.min(...metrics.map((driver) => driver.best_lap));
  const slowestLapTime = Math.max(...metrics.map((driver) => driver.avg_lap_time));

  return {
    driverCount: metrics.length,
    totalLaps,
    totalPitOutLaps,
    averageLapTime,
    bestLapTime,
    slowestLapTime,
    leader: sorted[0] ?? null,
    trailingDriver: sorted[sorted.length - 1] ?? null,
  };
}

export function buildTelemetrySeries(metrics: DriverRaceMetrics[]): number[] {
  return metrics
    .slice(0, 8)
    .map((driver) => driver.best_lap)
    .concat(metrics.slice(0, 8).map((driver) => driver.avg_lap_time));
}
