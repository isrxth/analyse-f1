import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { ComparisonPage } from "./pages/ComparisonPage";
import { RacePage } from "./pages/RacePage";
import { OverviewPage } from "./pages/OverviewPage";
import { SessionPage } from "./pages/SessionPage";
import { DEFAULT_ROUTE, getRouteFromHash } from "./routes";
import type { ApiHealth, AppRouteId, DriverRaceMetrics } from "./types";
import { summarizeDrivers } from "./lib/metrics";

const DEFAULT_YEAR = 2023;

const DEMO_METRICS: DriverRaceMetrics[] = [
  { driver_number: 1, laps_completed: 58, avg_lap_time: 92.384, best_lap: 91.117, pit_out_laps: 2 },
  { driver_number: 4, laps_completed: 56, avg_lap_time: 92.944, best_lap: 91.402, pit_out_laps: 1 },
  { driver_number: 16, laps_completed: 57, avg_lap_time: 93.215, best_lap: 91.945, pit_out_laps: 3 },
  { driver_number: 63, laps_completed: 55, avg_lap_time: 93.552, best_lap: 92.037, pit_out_laps: 2 },
  { driver_number: 81, laps_completed: 54, avg_lap_time: 93.907, best_lap: 92.442, pit_out_laps: 4 },
  { driver_number: 44, laps_completed: 58, avg_lap_time: 92.615, best_lap: 90.998, pit_out_laps: 2 },
  { driver_number: 55, laps_completed: 56, avg_lap_time: 93.001, best_lap: 91.728, pit_out_laps: 2 },
  { driver_number: 11, laps_completed: 53, avg_lap_time: 94.122, best_lap: 92.944, pit_out_laps: 5 },
];

const DEMO_HEALTH: ApiHealth = {
  status: "demo",
  version: "ui-only",
};

function App() {
  const [route, setRoute] = useState<AppRouteId>(() => getRouteFromHash(window.location.hash));
  const [activeYear, setActiveYear] = useState<number>(DEFAULT_YEAR);
  const [data] = useState<DriverRaceMetrics[]>(DEMO_METRICS);
  const [apiHealth] = useState<ApiHealth | null>(DEMO_HEALTH);

  useEffect(() => {
    const syncRoute = () => {
      setRoute(getRouteFromHash(window.location.hash));
    };

    syncRoute();
    window.addEventListener("hashchange", syncRoute);

    if (!window.location.hash) {
      window.history.replaceState(null, "", `#${DEFAULT_ROUTE}`);
    }

    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  const summary = summarizeDrivers(data);
  const apiStatusMessage = "UI mode: backend connection is paused until the design layer is finalized.";

  const onRouteChange = (nextRoute: AppRouteId) => {
    window.location.hash = `#${nextRoute}`;
  };

  return (
    <AppShell
      activeRoute={route}
      activeYear={activeYear}
      apiHealth={apiHealth}
      apiStatusMessage={apiStatusMessage}
      driverCount={data.length}
      onRouteChange={onRouteChange}
      onYearChange={setActiveYear}
    >
      {route === "race" ? (
        <RacePage metrics={data} activeYear={activeYear} />
      ) : route === "compare" ? (
        <ComparisonPage metrics={data} activeYear={activeYear} />
      ) : route === "session" ? (
        <SessionPage apiHealth={apiHealth} apiStatusMessage={apiStatusMessage} activeYear={activeYear} />
      ) : (
        <OverviewPage metrics={data} summary={summary} activeYear={activeYear} apiStatusMessage={apiStatusMessage} />
      )}
    </AppShell>
  );
}

export default App;
