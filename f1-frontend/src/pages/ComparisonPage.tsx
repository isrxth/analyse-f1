import { useEffect, useState } from "react";
import type { DriverRaceMetrics, RaceSession } from "../types";
import { SectionHeader } from "../components/SectionHeader";
import { formatInteger, formatLapTime } from "../lib/metrics";
import { ComingSoonWrapper } from "../components/ComingSoonWrapper";

interface Props {
  metrics: DriverRaceMetrics[];
  drivers: any[];
  activeYear: number;
  sessions: RaceSession[];
  selectedSessionKey: number | null;
  onSessionChange: (key: number) => void;
}

function findDriver(metrics: DriverRaceMetrics[], driverNumber: number): DriverRaceMetrics | undefined {
  return metrics.find((driver) => driver.driver_number === driverNumber);
}

export function ComparisonPage({ metrics, drivers, activeYear, sessions, selectedSessionKey, onSessionChange }: Props) {
  void activeYear;
  
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

  const firstDriver = metrics[0]?.driver_number ?? 0;
  const secondDriver = metrics[1]?.driver_number ?? firstDriver;
  const [leftDriver, setLeftDriver] = useState<number>(firstDriver);
  const [rightDriver, setRightDriver] = useState<number>(secondDriver);

  useEffect(() => {
    if (metrics.length >= 2) {
      setLeftDriver(metrics[0].driver_number);
      setRightDriver(metrics[1].driver_number);
    }
  }, [metrics]);

  const left = findDriver(metrics, leftDriver);
  const right = findDriver(metrics, rightDriver);

  const leftOptions = metrics.map((driver) => {
    const detail = getDriverDetail(driver.driver_number);
    return (
      <option key={driver.driver_number} value={driver.driver_number}>
        #{driver.driver_number} - {detail.name} ({detail.code})
      </option>
    );
  });

  const rightOptions = metrics.map((driver) => {
    const detail = getDriverDetail(driver.driver_number);
    return (
      <option key={driver.driver_number} value={driver.driver_number}>
        #{driver.driver_number} - {detail.name} ({detail.code})
      </option>
    );
  });

  const comparisonRows = left && right
    ? [
        { label: "Best lap", leftValue: left.best_lap ?? 0, rightValue: right.best_lap ?? 0, formatter: formatLapTime },
        { label: "Average lap", leftValue: left.avg_lap_time ?? 0, rightValue: right.avg_lap_time ?? 0, formatter: formatLapTime },
        { label: "Completed laps", leftValue: left.laps_completed ?? 0, rightValue: right.laps_completed ?? 0, formatter: formatInteger },
        { label: "Pit-outs", leftValue: left.pit_out_laps ?? 0, rightValue: right.pit_out_laps ?? 0, formatter: formatInteger },
      ]
    : [];

  return (
    <ComingSoonWrapper
      title="Driver comparison coming soon"
      description="Head-to-head metrics charts, telemetry overlays, and pitstop gap analytics will be active here once driver models are compiled."
    >
      <section className="surface-panel compare-panel" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <SectionHeader
            eyebrow="Head-to-head"
            title="Driver comparison matrix"
            description="Pick two drivers to inspect pace deltas, lap volume, and pit behaviour side by side."
          />
          
          {/* Race Selector dropdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Select Race Event
            </span>
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
                outline: "none",
                borderRadius: "0px"
              }}
            >
              {sessions.map((s) => (
                <option key={s.session_key} value={s.session_key} style={{ background: "#1a1a28", color: "#fff" }}>
                  {s.location} ({s.country_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="compare-panel__selectors" style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
          <label className="field-label" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)" }}>Left driver</span>
            <select value={leftDriver} onChange={(event) => setLeftDriver(Number(event.target.value))} style={{ width: "100%", padding: "10px", background: "rgba(17,17,31,0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
              {leftOptions}
            </select>
          </label>

          <label className="field-label" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "0.7rem", textTransform: "uppercase", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)" }}>Right driver</span>
            <select value={rightDriver} onChange={(event) => setRightDriver(Number(event.target.value))} style={{ width: "100%", padding: "10px", background: "rgba(17,17,31,0.9)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}>
              {rightOptions}
            </select>
          </label>
        </div>

        <div className="compare-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
          <article className="compare-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="compare-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>Left lane</span>
            <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-headline-sm)" }}>
              {left ? getDriverDetail(left.driver_number).code : "--"}
            </strong>
            <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>
              {left ? `${getDriverDetail(left.driver_number).name} - ${getDriverDetail(left.driver_number).team}` : "No comparison data"}
            </span>
          </article>

          <article className="compare-card compare-card--center" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "2px solid var(--color-primary-container) !important" }}>
            <span className="compare-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-primary)" }}>Direct delta</span>
            <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-data-display)", color: "var(--color-primary)" }}>
              {left && right && left.avg_lap_time !== null && right.avg_lap_time !== null ? formatLapTime(Math.abs(left.avg_lap_time - right.avg_lap_time)) : "--"}
            </strong>
            <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>Average lap gap between the selected drivers.</span>
          </article>

          <article className="compare-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span className="compare-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>Right lane</span>
            <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-headline-sm)" }}>
              {right ? getDriverDetail(right.driver_number).code : "--"}
            </strong>
            <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>
              {right ? `${getDriverDetail(right.driver_number).name} - ${getDriverDetail(right.driver_number).team}` : "No comparison data"}
            </span>
          </article>
        </div>

        {/* Numerical delta bars */}
        <div className="compare-bars" style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
          {comparisonRows.map((row) => {
            const highest = Math.max(row.leftValue, row.rightValue) || 1;
            return (
              <article key={row.label} className="compare-row" style={{ padding: "16px 20px" }}>
                <div className="compare-row__header" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "8px" }}>
                  <strong>{row.label}</strong>
                  <span style={{ fontFamily: "var(--font-family-data-display)" }}>
                    {left ? row.formatter(row.leftValue) : "--"} vs {right ? row.formatter(row.rightValue) : "--"}
                  </span>
                </div>
                <div className="compare-row__bars" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {/* Left lane driver bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.7rem", width: "32px", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)" }}>
                      {left ? getDriverDetail(left.driver_number).code : "LEFT"}
                    </span>
                    <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
                      <div 
                        style={{ 
                          height: "100%", 
                          width: `${(row.leftValue / highest) * 100}%`, 
                          background: left ? getDriverDetail(left.driver_number).color : "var(--color-primary)",
                          transition: "width 0.4s ease"
                        }} 
                      />
                    </div>
                  </div>
                  {/* Right lane driver bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "0.7rem", width: "32px", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)" }}>
                      {right ? getDriverDetail(right.driver_number).code : "RGHT"}
                    </span>
                    <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.06)", position: "relative" }}>
                      <div 
                        style={{ 
                          height: "100%", 
                          width: `${(row.rightValue / highest) * 100}%`, 
                          background: right ? getDriverDetail(right.driver_number).color : "#00d2be",
                          transition: "width 0.4s ease"
                        }} 
                      />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Dynamic throttle overlays mock */}
        {left && right && (
          <div className="compare-bars" style={{ display: "grid", gap: "12px" }}>
            <div className="glass-card" style={{ padding: "20px" }}>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Throttle Application Overlay (%)
              </span>
              <div style={{ height: "180px", position: "relative", borderLeft: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)", marginTop: "16px" }}>
                <svg viewBox="0 0 500 180" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                  {/* Left driver throttle curve */}
                  <path d="M0,10 L50,10 L100,60 L150,10 L200,10 L250,170 L300,10 L350,10 L400,150 L450,10 L500,10" fill="none" stroke={getDriverDetail(left.driver_number).color} strokeWidth="2" strokeDasharray="3 1" />
                  {/* Right driver throttle curve */}
                  <path d="M0,10 L50,20 L100,90 L150,10 L200,20 L250,160 L300,10 L350,20 L400,140 L450,10 L500,20" fill="none" stroke={getDriverDetail(right.driver_number).color} strokeWidth="2" />
                </svg>
                <div style={{ position: "absolute", bottom: "-18px", width: "100%", display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.4)" }}>
                  <span>START</span>
                  <span>FINISH</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </ComingSoonWrapper>
  );
}
