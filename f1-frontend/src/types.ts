export interface DriverRaceMetrics {
  driver_number: number;
  laps_completed: number;
  avg_lap_time: number;
  best_lap: number;
  pit_out_laps: number;
}

export type AppRouteId = "overview" | "race" | "compare" | "session";

export interface ApiHealth {
  status: string;
  version: string;
}

export interface RaceSummary {
  driverCount: number;
  totalLaps: number;
  totalPitOutLaps: number;
  averageLapTime: number;
  bestLapTime: number;
  slowestLapTime: number;
  leader: DriverRaceMetrics | null;
  trailingDriver: DriverRaceMetrics | null;
}

export interface RouteMeta {
  id: AppRouteId;
  label: string;
  eyebrow: string;
  description: string;
}
