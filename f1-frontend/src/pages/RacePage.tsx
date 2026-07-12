import { useState, useEffect } from "react";
import type { DriverRaceMetrics, RaceSession, RaceResult } from "../types";
import { buildSparklinePath, formatDriverLabel, formatInteger, formatLapTime, sortDrivers } from "../lib/metrics";
import { SectionHeader } from "../components/SectionHeader";
import { ComingSoonWrapper } from "../components/ComingSoonWrapper";

interface Props {
  metrics: DriverRaceMetrics[];
  results: RaceResult[];
  drivers: any[];
  activeYear: number;
  sessions: RaceSession[];
  selectedSessionKey: number | null;
  onSessionChange: (key: number) => void;
}

type TabType = "results" | "strategy" | "dominance" | "control" | "telemetry" | "drivers_championship" | "constructors_championship";
type SessionType = "practice" | "qualifying" | "race";

export function RacePage({ metrics, results, drivers, activeYear, sessions, selectedSessionKey, onSessionChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("results");
  const [sessionType, setSessionType] = useState<SessionType>("race");
  
  const currentSession = sessions.find((s) => s.session_key === selectedSessionKey) || sessions[0];
  const selectedRaceName = currentSession ? `${currentSession.location} (${currentSession.country_name})` : "Loading session...";

  // Build dynamic driver dictionary from fetched drivers
  const driverLookup = new Map<number, { name: string; code: string; team: string; color: string }>();
  drivers.forEach((d) => {
    driverLookup.set(d.driver_number, {
      name: d.full_name || `${d.first_name} ${d.last_name}`,
      code: d.name_acronym || "DRV",
      team: d.team_name || "Independent",
      color: d.team_colour ? `#${d.team_colour}` : "#ffffff"
    });
  });

  const getDriverDetail = (num: number) => {
    return driverLookup.get(num) || {
      name: `Driver #${num}`,
      code: `D${num}`,
      team: "Independent",
      color: "#ffffff"
    };
  };

  // If sessionType is not race, and the activeTab is strategy or dominance, reset to results
  useEffect(() => {
    if (sessionType !== "race" && (activeTab === "strategy" || activeTab === "dominance")) {
      setActiveTab("results");
    }
  }, [sessionType, activeTab]);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFlag, setFilterFlag] = useState("all");

  const orderedDrivers = sortDrivers(metrics);
  const leaderDriver = orderedDrivers[0];
  const leaderInfo = leaderDriver ? getDriverDetail(leaderDriver.driver_number) : null;
  const p2Driver = orderedDrivers[1];
  const p2Info = p2Driver ? getDriverDetail(p2Driver.driver_number) : null;

  const hasResults = results && results.length > 0;
  let leaderName = "Loading...";
  let leaderTeam = "";
  let p2Name = "Loading...";
  let p2Team = "";
  let fastestLapTime = "N/A";

  if (hasResults) {
    const sortedRes = [...results].sort((a, b) => {
      const aFailed = a.dnf || a.dns || a.dsq;
      const bFailed = b.dnf || b.dns || b.dsq;
      if (aFailed && !bFailed) return 1;
      if (!aFailed && bFailed) return -1;
      const aPos = a.position || 999;
      const bPos = b.position || 999;
      return aPos - bPos;
    });
    const leaderRes = sortedRes[0];
    const leaderDetail = leaderRes ? getDriverDetail(leaderRes.driver_number) : null;
    if (leaderDetail) {
      leaderName = leaderDetail.name;
      leaderTeam = leaderDetail.team;
    }
    const p2Res = sortedRes[1];
    const p2Detail = p2Res ? getDriverDetail(p2Res.driver_number) : null;
    if (p2Detail) {
      p2Name = p2Detail.name;
      p2Team = p2Detail.team;
    }
    if (leaderDriver) {
      fastestLapTime = formatLapTime(leaderDriver.best_lap);
    }
  } else {
    if (leaderInfo) {
      leaderName = leaderInfo.name;
      leaderTeam = leaderInfo.team;
    }
    if (p2Info) {
      p2Name = p2Info.name;
      p2Team = p2Info.team;
    }
    if (leaderDriver) {
      fastestLapTime = formatLapTime(leaderDriver.best_lap);
    }
  }

  return (
    <section className="surface-panel drivers-panel" style={{ padding: "24px" }}>
      {/* Breadcrumbs & Controls Row */}
      <div className="mb-10" style={{ marginBottom: "24px" }}>
        <div 
          className="flex items-center gap-2 text-on-surface-variant mb-2" 
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px", 
            color: "var(--color-secondary-fixed-dim)", 
            fontFamily: "var(--font-family-label-sm)", 
            fontSize: "0.75rem",
            textTransform: "uppercase",
            marginBottom: "8px"
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_back</span>
          <span style={{ letterSpacing: "0.12em" }}>{activeYear} Season</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "var(--color-primary)", letterSpacing: "0.12em" }}>{selectedRaceName}</span>
        </div>
        
        <div 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "flex-end", 
            flexWrap: "wrap", 
            gap: "16px" 
          }}
        >
          <h1 
            style={{ 
              margin: 0, 
              color: "var(--color-on-surface)", 
              fontFamily: "var(--font-family-headline-lg)", 
              fontSize: "clamp(1.75rem, 4vw, 3rem)", 
              letterSpacing: "-0.03em",
              textTransform: "uppercase" 
            }}
          >
            Race classification
          </h1>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {/* Race selector dropdown */}
            <select
              value={selectedSessionKey ?? ""}
              onChange={(e) => onSessionChange(Number(e.target.value))}
              className="glass-card"
              style={{
                padding: "8px 16px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-family-label-sm)",
                background: "rgba(17, 17, 31, 0.9)",
                color: "var(--color-on-surface)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                cursor: "pointer",
                outline: "none"
              }}
            >
              {sessions.map((s) => (
                <option key={s.session_key} value={s.session_key} style={{ background: "#1a1a28", color: "#fff" }}>
                  {s.location} ({s.country_name})
                </option>
              ))}
            </select>


            {/* Session Type Select Dropdown */}
            <select
              value={sessionType}
              onChange={(e) => setSessionType(e.target.value as SessionType)}
              style={{
                padding: "8px 16px",
                fontSize: "0.75rem",
                fontFamily: "var(--font-family-label-sm)",
                background: "var(--color-primary-container)",
                color: "var(--color-on-primary-container)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                cursor: "pointer",
                outline: "none",
                fontWeight: "bold"
              }}
            >
              <option value="practice" style={{ background: "#1a1a28", color: "#fff" }}>Practice</option>
              <option value="qualifying" style={{ background: "#1a1a28", color: "#fff" }}>Qualifying</option>
              <option value="race" style={{ background: "#1a1a28", color: "#fff" }}>Race Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <nav className="sub-nav-tabs" aria-label="Race analysis modules">
        <button 
          type="button" 
          className={`sub-nav-tab ${activeTab === "results" ? "is-active" : ""}`}
          onClick={() => setActiveTab("results")}
        >
          Results
        </button>

        {/* Strategy and Track Dominance ONLY available on Race sessionType */}
        {sessionType === "race" && (
          <>
            <button 
              type="button" 
              className={`sub-nav-tab ${activeTab === "strategy" ? "is-active" : ""}`}
              onClick={() => setActiveTab("strategy")}
            >
              Strategy
            </button>
            <button 
              type="button" 
              className={`sub-nav-tab ${activeTab === "dominance" ? "is-active" : ""}`}
              onClick={() => setActiveTab("dominance")}
            >
              Track Dominance
            </button>
          </>
        )}

        <button 
          type="button" 
          className={`sub-nav-tab ${activeTab === "control" ? "is-active" : ""}`}
          onClick={() => setActiveTab("control")}
        >
          Race Control
        </button>
        <button 
          type="button" 
          className={`sub-nav-tab ${activeTab === "telemetry" ? "is-active" : ""}`}
          onClick={() => setActiveTab("telemetry")}
        >
          Telemetry View
        </button>
        <button 
          type="button" 
          className={`sub-nav-tab ${activeTab === "drivers_championship" ? "is-active" : ""}`}
          onClick={() => setActiveTab("drivers_championship")}
        >
          Drivers Standings
        </button>
        <button 
          type="button" 
          className={`sub-nav-tab ${activeTab === "constructors_championship" ? "is-active" : ""}`}
          onClick={() => setActiveTab("constructors_championship")}
        >
          Constructors
        </button>
      </nav>

      {/* Top 3 Summary Bento Cards */}
      {activeTab !== "telemetry" && activeTab !== "drivers_championship" && activeTab !== "constructors_championship" && (
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "12px", 
            marginBottom: "24px" 
          }}
        >
          {/* Race Winner */}
          <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Session Leader
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontFamily: "var(--font-family-headline-sm)", fontWeight: 700 }}>
                {leaderName}
              </h3>
              <p style={{ margin: "4px 0 0", color: "var(--color-primary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase" }}>
                {leaderTeam}
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "28px" }}>trophy</span>
          </div>

          {/* Pole Position / Q2 Leader */}
          <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {sessionType === "practice" ? "Practice P2" : sessionType === "qualifying" ? "Q2 Pace" : "P2 Position"}
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontFamily: "var(--font-family-headline-sm)", fontWeight: 700 }}>
                {p2Name}
              </h3>
              <p style={{ margin: "4px 0 0", color: "var(--color-secondary-fixed-dim)", fontSize: "0.85rem", textTransform: "uppercase" }}>
                {p2Team}
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-secondary-fixed-dim)", fontSize: "28px" }}>bolt</span>
          </div>

          {/* Fastest Lap */}
          <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Fastest Lap
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontFamily: "var(--font-family-headline-sm)", fontWeight: 700 }}>
                {leaderName}
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                <span style={{ fontFamily: "var(--font-family-data-display)", color: "var(--color-primary)", fontSize: "1.25rem", fontWeight: 600 }}>
                  {fastestLapTime}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-secondary-fixed-dim)", fontSize: "28px" }}>timer</span>
          </div>
        </div>
      )}

      {/* Tab Panels */}

      {/* T1: Results */}
      {activeTab === "results" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Classification Table */}
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", textTransform: "uppercase" }}>
                {sessionType === "practice" ? "Practice Classification" : sessionType === "qualifying" ? "Qualifying Grid Classification" : "Session Results"}
              </h2>
              <button 
                type="button" 
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "var(--color-primary)", 
                  fontSize: "0.75rem", 
                  fontFamily: "var(--font-family-label-sm)", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
                EXPORT CSV
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ padding: "16px 20px" }}>Pos</th>
                    <th style={{ padding: "16px 20px" }}>Driver</th>
                    <th style={{ padding: "16px 20px" }}>Team</th>
                    {sessionType === "race" && <th style={{ padding: "16px 20px", textAlign: "center" }}>Grid</th>}
                    <th style={{ padding: "16px 20px", textAlign: sessionType === "race" ? "left" : "right" }}>
                      {sessionType === "practice" ? "Best Lap" : sessionType === "qualifying" ? "Q3 Lap Time" : "Status"}
                    </th>
                    {sessionType === "race" && <th style={{ padding: "16px 20px", textAlign: "right" }}>Points</th>}
                  </tr>
                </thead>
                <tbody>
                  {hasResults ? (
                    [...results]
                      .sort((a, b) => {
                        const aFailed = a.dnf || a.dns || a.dsq;
                        const bFailed = b.dnf || b.dns || b.dsq;
                        if (aFailed && !bFailed) return 1;
                        if (!aFailed && bFailed) return -1;
                        const aPos = a.position || 999;
                        const bPos = b.position || 999;
                        return aPos - bPos;
                      })
                      .map((res) => {
                        const info = getDriverDetail(res.driver_number);
                        const pos = res.position;
                        // starting grid mock
                        const grid = Math.min(20, Math.max(1, pos + (res.driver_number % 3) - 1));
                        
                        // Status
                        const status = res.dnf ? "DNF" : res.dns ? "DNS" : res.dsq ? "DSQ" : "Finished";
                        const points = res.points;
                        const isWinner = pos === 1;

                        return (
                          <tr 
                            key={res.driver_number}
                            style={{ 
                              background: isWinner ? "rgba(225, 6, 0, 0.08)" : "none", 
                              borderLeft: isWinner ? "4px solid var(--color-primary-container)" : "none",
                              borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                            }}
                          >
                            <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)", color: isWinner ? "var(--color-primary)" : "inherit", fontWeight: isWinner ? 700 : 500 }}>
                              {res.dnf || res.dns || res.dsq ? "NC" : pos}
                            </td>
                            <td style={{ padding: "16px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "32px", height: "32px", background: isWinner ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", border: isWinner ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                                  {info.code}
                                </div>
                                <strong>{info.name}</strong>
                              </div>
                            </td>
                            <td style={{ padding: "16px 20px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "8px", height: "16px", background: info.color }} />
                                <span style={{ color: "var(--color-secondary-fixed-dim)" }}>
                                  {info.team}
                                </span>
                              </div>
                            </td>
                            {sessionType === "race" && (
                              <td style={{ padding: "16px 20px", textAlign: "center", fontFamily: "var(--font-family-data-display)" }}>{grid}</td>
                            )}
                            <td style={{ padding: "16px 20px", textAlign: sessionType === "race" ? "left" : "right", fontFamily: "var(--font-family-data-display)", color: sessionType === "race" ? "inherit" : "var(--color-primary)" }}>
                              {status}
                            </td>
                            {sessionType === "race" && (
                              <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)", color: isWinner ? "var(--color-primary)" : "inherit", fontWeight: isWinner ? 700 : 500 }}>{points}</td>
                            )}
                          </tr>
                        );
                      })
                  ) : (
                    orderedDrivers.map((driver, index) => {
                      const info = getDriverDetail(driver.driver_number);
                      const pos = index + 1;
                      const grid = Math.min(20, Math.max(1, pos + (driver.driver_number % 3) - 1));
                      const status = pos <= 15 ? "Finished" : pos <= 18 ? "Lapped" : "Retired";
                      const pointsMap: Record<number, number> = {
                        1: 25, 2: 18, 3: 15, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2, 10: 1
                      };
                      const points = pointsMap[pos] || 0;
                      const isWinner = pos === 1;

                      return (
                        <tr 
                          key={driver.driver_number}
                          style={{ 
                            background: isWinner ? "rgba(225, 6, 0, 0.08)" : "none", 
                            borderLeft: isWinner ? "4px solid var(--color-primary-container)" : "none",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
                          }}
                        >
                          <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)", color: isWinner ? "var(--color-primary)" : "inherit", fontWeight: isWinner ? 700 : 500 }}>{pos}</td>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "32px", height: "32px", background: isWinner ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.75rem", border: isWinner ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
                                {info.code}
                              </div>
                              <strong>{info.name}</strong>
                            </div>
                          </td>
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div style={{ width: "8px", height: "16px", background: info.color }} />
                              <span style={{ color: "var(--color-secondary-fixed-dim)" }}>
                                {info.team}
                              </span>
                            </div>
                          </td>
                          {sessionType === "race" && (
                            <td style={{ padding: "16px 20px", textAlign: "center", fontFamily: "var(--font-family-data-display)" }}>{grid}</td>
                          )}
                          <td style={{ padding: "16px 20px", textAlign: sessionType === "race" ? "left" : "right", fontFamily: "var(--font-family-data-display)", color: sessionType === "race" ? "inherit" : "var(--color-primary)" }}>
                            {sessionType === "practice" || sessionType === "qualifying" 
                              ? formatLapTime(driver.best_lap) 
                              : status
                            }
                          </td>
                          {sessionType === "race" && (
                            <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)", color: isWinner ? "var(--color-primary)" : "inherit", fontWeight: isWinner ? 700 : 500 }}>{points}</td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Context Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "12px" }}>
            <div className="glass-card" style={{ gridColumn: "span 3", padding: "16px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Track Temperature
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontFamily: "var(--font-family-data-display)" }}>24.2°C</p>
            </div>
            
            <div className="glass-card" style={{ gridColumn: "span 3", padding: "16px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Air Temperature
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontFamily: "var(--font-family-data-display)" }}>19.5°C</p>
            </div>
            
            <div className="glass-card" style={{ gridColumn: "span 3", padding: "16px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Humidity
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontFamily: "var(--font-family-data-display)" }}>62%</p>
            </div>
            
            <div className="glass-card" style={{ gridColumn: "span 3", padding: "16px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Session Length
              </span>
              <p style={{ margin: "4px 0 0", fontSize: "1.75rem", fontFamily: "var(--font-family-data-display)" }}>
                {sessionType === "practice" ? "60 Mins" : sessionType === "qualifying" ? "45 Mins" : "52 Laps"}
              </p>
            </div>

            <div className="glass-card" style={{ gridColumn: "span 12", padding: "20px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Track Evolution (Speed Progression)
              </span>
              <div 
                style={{ 
                  height: "64px", 
                  width: "100%", 
                  background: "rgba(26,26,40,0.8)", 
                  marginTop: "16px", 
                  display: "flex", 
                  alignItems: "end", 
                  gap: "8px", 
                  padding: "8px" 
                }}
              >
                <div style={{ background: "rgba(225, 6, 0, 0.4)", width: "100%", height: "30%" }} />
                <div style={{ background: "rgba(225, 6, 0, 0.45)", width: "100%", height: "35%" }} />
                <div style={{ background: "rgba(225, 6, 0, 0.5)", width: "100%", height: "45%" }} />
                <div style={{ background: "rgba(225, 6, 0, 0.6)", width: "100%", height: "55%" }} />
                <div style={{ background: "rgba(225, 6, 0, 0.7)", width: "100%", height: "65%" }} />
                <div style={{ background: "rgba(225, 6, 0, 0.8)", width: "100%", height: "80%" }} />
                <div style={{ background: "rgba(225, 6, 0, 1)", width: "100%", height: "100%" }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* T2: Strategy (Only for Race Session Type) */}
      {activeTab === "strategy" && sessionType === "race" && (
        <ComingSoonWrapper 
          title="Strategy analysis coming soon" 
          description="Tire compound stint comparisons, wear rates, and optimal window analysis will be active here once tire datasets are processed."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          {/* Stint Performance Analysis Table */}
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>query_stats</span>
                <h2 style={{ margin: 0, fontSize: "1.25rem", textTransform: "uppercase" }}>Stint Performance Analysis</h2>
              </div>
              <button 
                type="button" 
                style={{ 
                  background: "none", 
                  border: "none", 
                  color: "var(--color-primary)", 
                  fontSize: "0.75rem", 
                  fontFamily: "var(--font-family-label-sm)", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "6px",
                  cursor: "pointer"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>download</span>
              </button>
            </div>
            
            <div style={{ overflowX: "auto" }}>
              <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ padding: "16px 20px" }}>Driver</th>
                    <th style={{ padding: "16px 20px" }}>Stint</th>
                    <th style={{ padding: "16px 20px", textAlign: "center" }}>Compound</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Length</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Fastest</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Average</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Consist. (σ)</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Degr. (Δ/Lap)</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: "var(--font-family-data-display)", fontSize: "0.85rem" }}>
                  {/* LEC stint */}
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 700 }}>LEC</td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>1</td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span className="tyre-badge tyre-badge--medium">Medium</span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>23 Laps <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>(3-25)</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:33.737</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:34.334</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>0.224</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", color: "var(--color-primary)" }}>+ 0.01s/lap</td>
                  </tr>

                  {/* ANT stint */}
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 700 }}>ANT</td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>1</td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span className="tyre-badge tyre-badge--medium">Medium</span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>33 Laps <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>(3-35)</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:32.976</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:34.148</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>0.429</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", color: "#00d100" }}>- 0.04s/lap</td>
                  </tr>

                  {/* HAM stint */}
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 700 }}>HAM</td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>2</td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span className="tyre-badge tyre-badge--hard">Hard</span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>23 Laps <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>(24-46)</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:32.309</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>1:33.482</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>0.646</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", color: "rgba(255,255,255,0.4)" }}>0.00s/lap</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ padding: "20px", borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(13, 13, 27, 0.4)", fontSize: "0.75rem", display: "grid", gap: "12px" }}>
              <strong style={{ color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Key Performance Indicators:</strong>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                <div>
                  <strong>Consistency (σ):</strong> Standard Deviation of lap times within the stint. Measures driver focus and car stability.
                </div>
                <div>
                  <strong>Degradation (Δ/lap):</strong> Calculated slope of performance drop-off. Critical for pit-stop window prediction.
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Insights Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "12px" }}>
            {/* Tyre Map block */}
            <div className="glass-card" style={{ padding: "24px", minHeight: "280px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-secondary-fixed-dim)", fontSize: "0.75rem", fontFamily: "var(--font-family-label-sm)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-primary)" }}>trending_down</span>
                <span>Tyre Lifetime Degradation Map</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: 0.35, padding: "24px 0" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "56px", color: "var(--color-primary)" }}>analytics</span>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-family-label-sm)", letterSpacing: "0.15em" }}>TELEMETRY ARCHIVE FEED...</span>
              </div>
              <div />
            </div>

            {/* Strategic Event Logs */}
            <div className="glass-card" style={{ padding: "24px", minHeight: "280px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-secondary-fixed-dim)", fontSize: "0.75rem", fontFamily: "var(--font-family-label-sm)", marginBottom: "16px" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "16px", color: "var(--color-primary)" }}>history</span>
                <span>Strategic Event Logs</span>
              </div>
              
              <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderLeft: "2px solid var(--color-primary-container)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.4)" }}>LAP 33</span>
                  <span style={{ background: "var(--color-primary-container)", color: "#ffffff", padding: "2px 6px", fontSize: "0.6rem", fontWeight: 700 }}>BOX</span>
                  <span>LECLERC (FERRARI) → HARD TIRES (NEW)</span>
                </div>
                <div style={{ padding: "12px", background: "rgba(255,255,255,0.03)", borderLeft: "2px solid var(--color-primary-container)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.4)" }}>LAP 35</span>
                  <span style={{ background: "var(--color-primary-container)", color: "#ffffff", padding: "2px 6px", fontSize: "0.6rem", fontWeight: 700 }}>BOX</span>
                  <span>ANTONELLI (MERCEDES) → HARD TIRES (USED)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

      {/* T3: Track Dominance (Only for Race Session Type) */}
      {activeTab === "dominance" && sessionType === "race" && (
        <ComingSoonWrapper
          title="Track dominance coming soon"
          description="Segment speed traces, sector leadership mappings, and telemetry curves comparison will be active here."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "32px" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Track Dominance by Lap</h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)", fontFamily: "var(--font-family-label-sm)" }}>
                  Speed Trace Comparison: Lap 25 (HAM) vs Lap 43 (LEC)
                </p>
              </div>
              <div style={{ display: "flex", background: "rgba(13,13,27,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ width: "10px", height: "10px", background: "var(--color-primary-container)", borderRadius: "50%" }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-family-label-sm)" }}>HAM</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px" }}>
                  <span style={{ width: "10px", height: "10px", background: "#ffffff", borderRadius: "50%" }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-family-label-sm)" }}>LEC</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", alignItems: "center" }}>
              {/* Circuit Map SVG Dropzone Placeholder */}
              <div 
                style={{ 
                  position: "relative", 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  minHeight: "300px",
                  border: "2px dashed rgba(255, 180, 168, 0.3)",
                  padding: "24px",
                  background: "rgba(13, 13, 27, 0.4)",
                  textAlign: "center"
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "var(--color-primary)", marginBottom: "16px" }}>map</span>
                <span style={{ fontFamily: "var(--font-family-label-sm)", fontSize: "0.8rem", letterSpacing: "0.05em", color: "#ffffff", fontWeight: "bold" }}>
                  [ TRACK MAP SVG PLACEHOLDER ]
                </span>
                <p style={{ margin: "8px 0 0", fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)", maxWidth: "240px" }}>
                  Place custom track layout SVG files in the <code style={{ color: "var(--color-primary)" }}>/public/tracks/</code> directory to automatically render them.
                </p>
                <div style={{ position: "absolute", bottom: 8, left: 8, padding: "4px 8px", background: "rgba(13,13,27,0.85)", fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)" }}>
                  MAP IDENTIFIER: {(currentSession?.location || "unknown").toLowerCase().replace(/ /g, "_")}
                </div>
              </div>

              {/* Speed trace chart visual */}
              <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: "260px" }}>
                <div style={{ flex: 1, position: "relative", borderLeft: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)", minHeight: "200px" }}>
                  {/* grid lines */}
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", height: "25%" }} />
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", height: "25%" }} />
                    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", height: "25%" }} />
                    <div />
                  </div>
                  {/* paths */}
                  <svg viewBox="0 0 500 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                    <path d="M0,150 L50,120 L100,140 L150,40 L200,60 L250,150 L300,100 L350,50 L400,120 L450,30 L500,80" fill="none" stroke="#e10600" strokeWidth="2.5" />
                    <path d="M0,160 L50,130 L100,150 L150,50 L200,70 L250,160 L300,110 L350,60 L400,130 L450,40 L500,90" fill="none" stroke="#ffffff" strokeDasharray="4 2" strokeWidth="2" />
                  </svg>
                  
                  <span style={{ position: "absolute", left: "-32px", top: 0, fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)" }}>325</span>
                  <span style={{ position: "absolute", left: "-32px", bottom: 0, fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)" }}>60</span>
                  <span style={{ position: "absolute", bottom: "-18px", left: 0, fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)" }}>START</span>
                  <span style={{ position: "absolute", bottom: "-18px", right: 0, fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)" }}>FINISH</span>
                </div>
                <div style={{ textAlign: "center", fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)", textTransform: "uppercase", marginTop: "24px", color: "var(--color-secondary-fixed-dim)", letterSpacing: "0.15em" }}>
                  Distance (m)
                </div>
              </div>
            </div>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

      {/* T4: Race Control */}
      {activeTab === "control" && (
        <ComingSoonWrapper
          title="Race control timeline coming soon"
          description="Steward decisions, flag timelines, safety car messages, and radio communications will be active here."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {/* Race Control Panel */}
          <div className="glass-card" style={{ padding: "0px", overflow: "hidden" }}>
            <div 
              style={{ 
                padding: "16px 24px", 
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
                background: "rgba(255,255,255,0.02)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "1.1rem", textTransform: "uppercase" }}>Race Control Timeline</h2>
                <div style={{ background: "rgba(13,13,27,0.8)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px", fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)" }}>
                  <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>5</span> OF 250 EVENTS
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ display: "flex", background: "rgba(13,13,27,0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 8px", gap: "6px", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>filter_list</span>
                  <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)} 
                    style={{ background: "none", border: "none", color: "var(--color-secondary-fixed-dim)", fontSize: "0.65rem", padding: 0, cursor: "pointer", outline: "none" }}
                  >
                    <option value="all" style={{ background: "#1a1a28", color: "#fff" }}>All Categories</option>
                    <option value="flag" style={{ background: "#1a1a28", color: "#fff" }}>Flags</option>
                    <option value="other" style={{ background: "#1a1a28", color: "#fff" }}>Other</option>
                  </select>
                </div>

                <div style={{ display: "flex", background: "rgba(13,13,27,0.5)", border: "1px solid rgba(255, 255, 255, 0.1)", padding: "4px 8px", gap: "6px", alignItems: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>flag</span>
                  <select 
                    value={filterFlag} 
                    onChange={(e) => setFilterFlag(e.target.value)} 
                    style={{ background: "none", border: "none", color: "var(--color-secondary-fixed-dim)", fontSize: "0.65rem", padding: 0, cursor: "pointer", outline: "none" }}
                  >
                    <option value="all" style={{ background: "#1a1a28", color: "#fff" }}>All Flags</option>
                    <option value="green" style={{ background: "#1a1a28", color: "#fff" }}>Green</option>
                    <option value="yellow" style={{ background: "#1a1a28", color: "#fff" }}>Yellow</option>
                    <option value="clear" style={{ background: "#1a1a28", color: "#fff" }}>Clear</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline content list */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px", background: "rgba(13, 13, 27, 0.2)" }}>
              {/* Green Flag */}
              {(filterCategory === "all" || filterCategory === "flag") && (filterFlag === "all" || filterFlag === "green") && (
                <article className="timeline-entry timeline-entry--green">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ background: "rgba(0, 209, 0, 0.15)", color: "#00d100", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="status-chip__dot status-pulse" style={{ background: "#00d100", boxShadow: "none", width: "6px", height: "6px", margin: 0 }} />
                        FLAG
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "var(--color-secondary-fixed-dim)" }}>GREEN</span>
                      <span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)" }}>LAP 1</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-family-data-display)", fontSize: "0.7rem", color: "var(--color-secondary-fixed-dim)" }}>18:50:01</span>
                  </div>
                  <h4 style={{ margin: "4px 0", fontSize: "1rem", color: "#ffffff" }}>GREEN LIGHT - PIT EXIT OPEN</h4>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)" }}>RACE START PROCEDURE INITIATED</p>
                </article>
              )}

              {/* Other event (Pit Closed) */}
              {(filterCategory === "all" || filterCategory === "other") && (filterFlag === "all" || filterFlag === "blue") && (
                <article className="timeline-entry timeline-entry--blue">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ background: "rgba(0, 136, 255, 0.15)", color: "#0088ff", padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span className="material-symbols-outlined" style={{ fontSize: "10px" }}>info</span>
                        OTHER
                      </span>
                      <span style={{ background: "rgba(255,255,255,0.06)", padding: "2px 8px", fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)" }}>LAP 1</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-family-data-display)", fontSize: "0.7rem", color: "var(--color-secondary-fixed-dim)" }}>19:00:01</span>
                  </div>
                  <h4 style={{ margin: "4px 0", fontSize: "1rem", color: "#ffffff" }}>PIT EXIT CLOSED</h4>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)" }}>GRID FORMATION COMPLETE</p>
                </article>
              )}
            </div>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

      {/* T5: Telemetry View (original driver stats sparkline page) */}
      {activeTab === "telemetry" && (
        <ComingSoonWrapper
          title="Live telemetry view coming soon"
          description="High frequency RPM, speed traces, throttle/brake applications, and DRS triggers will be active here."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          <SectionHeader
            eyebrow="Grid view"
            title="Driver performance table"
            description="A sharp, scan-friendly list that compresses lap count, pace, and pit activity into a single panel."
          />

          <div className="table-shell" style={{ border: "1px solid rgba(255,255,255,0.1)", background: "rgba(30, 30, 45, 0.72)" }}>
            <table className="driver-table">
              <thead>
                <tr>
                  <th scope="col">Driver</th>
                  <th scope="col">Laps</th>
                  <th scope="col">Best lap</th>
                  <th scope="col">Avg lap</th>
                  <th scope="col">Pit-outs</th>
                  <th scope="col">Pulse</th>
                </tr>
              </thead>
              <tbody>
                {orderedDrivers.map((driver) => {
                  const sparkline = [
                    (driver.best_lap ?? 0) * 1.05,
                    driver.avg_lap_time ?? 0,
                    driver.best_lap ?? 0,
                    (driver.avg_lap_time ?? 0) * 0.98,
                    (driver.best_lap ?? 0) * 1.01,
                  ];

                  return (
                    <tr key={driver.driver_number}>
                      <td>
                        <strong>{formatDriverLabel(driver.driver_number)}</strong>
                      </td>
                      <td>{formatInteger(driver.laps_completed)}</td>
                      <td>{formatLapTime(driver.best_lap)}</td>
                      <td>{formatLapTime(driver.avg_lap_time)}</td>
                      <td>{formatInteger(driver.pit_out_laps)}</td>
                      <td>
                        <svg className="row-sparkline" viewBox="0 0 120 28" preserveAspectRatio="none" aria-hidden="true">
                          <path d={buildSparklinePath(sparkline, 120, 28)} />
                        </svg>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

      {/* T6: Drivers Championship Standings */}
      {activeTab === "drivers_championship" && (
        <ComingSoonWrapper
          title="Drivers standings coming soon"
          description="Accumulated season points progression and standings tables will be active here."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", textTransform: "uppercase" }}>Drivers Championship Standings - {activeYear}</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ padding: "16px 20px" }}>Pos</th>
                    <th style={{ padding: "16px 20px" }}>Driver</th>
                    <th style={{ padding: "16px 20px" }}>Team</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)", fontWeight: 700 }}>1</td>
                    <td style={{ padding: "16px 20px" }}><strong>Charles Leclerc</strong></td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>Ferrari</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)", color: "var(--color-primary)", fontWeight: 700 }}>210</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>2</td>
                    <td style={{ padding: "16px 20px" }}><span>Max Verstappen</span></td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>Red Bull Racing</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>195</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>3</td>
                    <td style={{ padding: "16px 20px" }}><span>Lewis Hamilton</span></td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>Ferrari</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>160</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>4</td>
                    <td style={{ padding: "16px 20px" }}><span>George Russell</span></td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>Mercedes</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>145</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>5</td>
                    <td style={{ padding: "16px 20px" }}><span>Lando Norris</span></td>
                    <td style={{ padding: "16px 20px", color: "var(--color-secondary-fixed-dim)" }}>McLaren</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>130</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

      {/* T7: Constructors Championship Standings */}
      {activeTab === "constructors_championship" && (
        <ComingSoonWrapper
          title="Constructors standings coming soon"
          description="Constructors points progression curves and team comparisons will be active here."
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", textTransform: "uppercase" }}>Constructors Championship Standings - {activeYear}</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                    <th style={{ padding: "16px 20px" }}>Pos</th>
                    <th style={{ padding: "16px 20px" }}>Constructor</th>
                    <th style={{ padding: "16px 20px", textAlign: "right" }}>Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)", fontWeight: 700 }}>1</td>
                    <td style={{ padding: "16px 20px" }}><strong>Ferrari</strong></td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)", color: "var(--color-primary)", fontWeight: 700 }}>370</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>2</td>
                    <td style={{ padding: "16px 20px" }}><span>Mercedes</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>305</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>3</td>
                    <td style={{ padding: "16px 20px" }}><span>Red Bull Racing</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>280</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)" }}>4</td>
                    <td style={{ padding: "16px 20px" }}><span>McLaren</span></td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontFamily: "var(--font-family-data-display)" }}>250</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </ComingSoonWrapper>
      )}

    </section>
  );
}
