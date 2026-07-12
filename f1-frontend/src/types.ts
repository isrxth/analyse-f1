export interface DriverRaceMetrics {
  driver_number: number;
  laps_completed: number;
  avg_lap_time: number | null;
  best_lap: number | null;
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

export interface RaceSession {
  session_key: number;
  session_name: string;
  meeting_key: number;
  country_name: string;
  location: string;
  date_start: string;
}

export interface RaceResult {
  position: number;
  driver_number: number;
  number_of_laps: number;
  points: number;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  duration: number | null;
  gap_to_leader: number | string | null;
}
