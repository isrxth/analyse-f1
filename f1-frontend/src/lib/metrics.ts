import type { DriverRaceMetrics, RaceSummary } from "../types";

export function formatLapTime(value: number | null | undefined): string {
  if (value === null || value === undefined || value === 0) {
    return "N/A";
  }
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
    const leftBest = left.best_lap ?? Infinity;
    const rightBest = right.best_lap ?? Infinity;
    if (leftBest !== rightBest) {
      return leftBest - rightBest;
    }

    const leftAvg = left.avg_lap_time ?? Infinity;
    const rightAvg = right.avg_lap_time ?? Infinity;
    if (leftAvg !== rightAvg) {
      return leftAvg - rightAvg;
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

  const avgLaps = metrics.map((d) => d.avg_lap_time).filter((v): v is number => v !== null);
  const averageLapTime = avgLaps.length > 0 ? (avgLaps.reduce((sum, v) => sum + v, 0) / avgLaps.length) : 0;

  const validBestLaps = metrics.map((d) => d.best_lap).filter((v): v is number => v !== null);
  const bestLapTime = validBestLaps.length > 0 ? Math.min(...validBestLaps) : 0;

  const validAvgLaps = metrics.map((d) => d.avg_lap_time).filter((v): v is number => v !== null);
  const slowestLapTime = validAvgLaps.length > 0 ? Math.max(...validAvgLaps) : 0;

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
  const bestLaps = metrics.slice(0, 8).map((driver) => driver.best_lap ?? 0);
  const avgLaps = metrics.slice(0, 8).map((driver) => driver.avg_lap_time ?? 0);
  return bestLaps.concat(avgLaps);
}
