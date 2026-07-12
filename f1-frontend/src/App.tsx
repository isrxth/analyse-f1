import { useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { ComparisonPage } from "./pages/ComparisonPage";
import { RacePage } from "./pages/RacePage";
import { OverviewPage } from "./pages/OverviewPage";
import { SessionPage } from "./pages/SessionPage";
import { DEFAULT_ROUTE, getRouteFromHash } from "./routes";
import type { ApiHealth, AppRouteId, DriverRaceMetrics, RaceSession, RaceResult } from "./types";
import { summarizeDrivers } from "./lib/metrics";

const DEFAULT_YEAR = 2023;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

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



function App() {
  const [route, setRoute] = useState<AppRouteId>(() => getRouteFromHash(window.location.hash));
  const [activeYear, setActiveYear] = useState<number>(DEFAULT_YEAR);
  const [data, setData] = useState<DriverRaceMetrics[]>(DEMO_METRICS);
  
  const [apiHealth, setApiHealth] = useState<ApiHealth | null>(null);
  const [apiStatusMessage, setApiStatusMessage] = useState<string>("Initializing Admin console...");
  
  const [sessions, setSessions] = useState<RaceSession[]>([]);
  const [selectedSessionKey, setSelectedSessionKey] = useState<number | null>(null);
  const [results, setResults] = useState<RaceResult[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Sync hash routing
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

  // Fetch API Health on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Server health check failed");
        return res.json();
      })
      .then((health) => {
        setApiHealth({ status: health.status, version: health.version });
        setApiStatusMessage(`Backend connected: FastAPI ${health.version}. System OK.`);
      })
      .catch((err) => {
        console.warn("Backend offline, running in offline demo mode.", err);
        setApiHealth({ status: "offline", version: "unknown" });
        setApiStatusMessage("Running in offline demo mode. Backend server is currently disconnected.");
      });
  }, []);

  // Fetch Sessions when activeYear changes
  useEffect(() => {
    setIsLoading(true);
    setApiError(null);
    fetch(`${API_BASE_URL}/race/${activeYear}/sessions`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Could not fetch sessions list");
        }
        return res.json();
      })
      .then((sessionList: RaceSession[] | { error: string }) => {
        if (Array.isArray(sessionList) && sessionList.length > 0) {
          setSessions(sessionList);
          setSelectedSessionKey(sessionList[0].session_key);
        } else {
          throw new Error("No race sessions returned");
        }
      })
      .catch((err) => {
        console.warn("Sessions fetch failed.", err);
        setApiError(err.message || "Failed to load sessions");
        // Clear old sessions and key
        setSessions([]);
        setSelectedSessionKey(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeYear]);

  // Fetch Metrics when selectedSessionKey changes (DO NOT depend on activeYear to prevent double fetches)
  useEffect(() => {
    if (selectedSessionKey === null) return;
    setIsLoading(true);
    setApiError(null);
    fetch(`${API_BASE_URL}/race/${activeYear}/metrics?session_key=${selectedSessionKey}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Could not fetch session metrics");
        }
        return res.json();
      })
      .then((metrics: DriverRaceMetrics[] | { error: string }) => {
        if (Array.isArray(metrics)) {
          setData(metrics);
        } else {
          throw new Error("Failed to load metrics array");
        }
      })
      .catch((err) => {
        console.warn("Metrics fetch failed.", err);
        setApiError(err.message || "Failed to load session metrics");
        setData([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedSessionKey]);

  // Fetch Results when selectedSessionKey changes (DO NOT depend on activeYear to prevent double fetches)
  useEffect(() => {
    if (selectedSessionKey === null) return;
    setIsLoading(true);
    setApiError(null);
    fetch(`${API_BASE_URL}/race/${activeYear}/results?session_key=${selectedSessionKey}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Could not fetch session results");
        }
        return res.json();
      })
      .then((resultsData: RaceResult[] | { error: string }) => {
        if (Array.isArray(resultsData)) {
          setResults(resultsData);
        } else {
          throw new Error("Failed to load results array");
        }
      })
      .catch((err) => {
        console.warn("Results fetch failed.", err);
        setApiError(err.message || "Failed to load session results");
        setResults([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedSessionKey]);

  // Fetch Drivers when selectedSessionKey changes (DO NOT depend on activeYear to prevent double fetches)
  useEffect(() => {
    if (selectedSessionKey === null) return;
    setIsLoading(true);
    setApiError(null);
    fetch(`${API_BASE_URL}/race/${activeYear}/drivers?session_key=${selectedSessionKey}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || "Could not fetch session drivers");
        }
        return res.json();
      })
      .then((driversData: any[]) => {
        if (Array.isArray(driversData)) {
          setDrivers(driversData);
        } else {
          throw new Error("Failed to load drivers array");
        }
      })
      .catch((err) => {
        console.warn("Drivers fetch failed.", err);
        setApiError(err.message || "Failed to load session drivers");
        setDrivers([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedSessionKey]);

  const summary = summarizeDrivers(data);

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
      {isLoading && (
        <div style={{ position: "fixed", top: "68px", right: "24px", background: "var(--color-primary-container)", color: "var(--color-on-primary-container)", padding: "6px 12px", zIndex: 100, fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", fontWeight: 700 }}>
          INGESTING OPENF1 FEEDS...
        </div>
      )}

      {apiError && (
        <div style={{ position: "fixed", top: "68px", left: "50%", transform: "translateX(-50%)", background: "#7f1d1d", border: "1px solid #f87171", color: "#fca5a5", padding: "10px 20px", zIndex: 1000, display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)", fontFamily: "var(--font-family-label-sm)", fontSize: "0.8rem", width: "90%", maxWidth: "800px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="material-symbols-outlined" style={{ color: "#f87171", fontSize: "18px" }}>warning</span>
            <span>{apiError}</span>
          </div>
          <button onClick={() => setApiError(null)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", cursor: "pointer", padding: "4px 8px", fontSize: "0.7rem", fontWeight: 700 }}>
            DISMISS
          </button>
        </div>
      )}
      
      {route === "race" ? (
        <RacePage 
          metrics={data} 
          results={results}
          drivers={drivers}
          activeYear={activeYear} 
          sessions={sessions} 
          selectedSessionKey={selectedSessionKey} 
          onSessionChange={setSelectedSessionKey} 
        />
      ) : route === "compare" ? (
        <ComparisonPage 
          metrics={data} 
          drivers={drivers}
          activeYear={activeYear} 
          sessions={sessions} 
          selectedSessionKey={selectedSessionKey} 
          onSessionChange={setSelectedSessionKey} 
        />
      ) : route === "session" ? (
        <SessionPage 
          apiHealth={apiHealth} 
          apiStatusMessage={apiStatusMessage} 
          activeYear={activeYear} 
          sessions={sessions} 
        />
      ) : (
        <OverviewPage 
          metrics={data} 
          summary={summary} 
          activeYear={activeYear} 
          apiStatusMessage={apiStatusMessage} 
        />
      )}
    </AppShell>
  );
}

export default App;
