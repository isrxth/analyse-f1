import { useEffect, useState } from "react";
import type { DriverRaceMetrics } from "../types";
import { SectionHeader } from "../components/SectionHeader";
import { formatDriverLabel, formatInteger, formatLapTime } from "../lib/metrics";

interface Props {
  metrics: DriverRaceMetrics[];
  activeYear: number;
}

const RACES_BY_YEAR: Record<number, string[]> = {
  2023: ["Bahrain Grand Prix", "Monaco Grand Prix", "British Grand Prix", "Italian Grand Prix", "Abu Dhabi Grand Prix"],
  2024: ["Bahrain Grand Prix", "Saudi Arabian Grand Prix", "Monaco Grand Prix", "British Grand Prix", "Belgian Grand Prix", "Singapore Grand Prix"],
  2025: ["Bahrain Grand Prix", "Australian Grand Prix", "Monaco Grand Prix", "British Grand Prix", "Italian Grand Prix", "Singapore Grand Prix"],
  2026: ["Bahrain Grand Prix", "Emilia Romagna Grand Prix", "Monaco Grand Prix", "British Grand Prix", "Belgian Grand Prix", "Singapore Grand Prix", "United States Grand Prix"],
};

function findDriver(metrics: DriverRaceMetrics[], driverNumber: number): DriverRaceMetrics | undefined {
  return metrics.find((driver) => driver.driver_number === driverNumber);
}

export function ComparisonPage({ metrics, activeYear }: Props) {
  const firstDriver = metrics[0]?.driver_number ?? 0;
  const secondDriver = metrics[1]?.driver_number ?? firstDriver;
  const [leftDriver, setLeftDriver] = useState<number>(firstDriver);
  const [rightDriver, setRightDriver] = useState<number>(secondDriver);

  const races = RACES_BY_YEAR[activeYear] || RACES_BY_YEAR[2026];
  const [selectedRace, setSelectedRace] = useState<string>(races[0]);

  useEffect(() => {
    const updatedRaces = RACES_BY_YEAR[activeYear] || RACES_BY_YEAR[2026];
    setSelectedRace(updatedRaces[0]);
  }, [activeYear]);

  useEffect(() => {
    if (metrics.length >= 2) {
      setLeftDriver(metrics[0].driver_number);
      setRightDriver(metrics[1].driver_number);
    }
  }, [metrics]);

  const left = findDriver(metrics, leftDriver);
  const right = findDriver(metrics, rightDriver);

  const leftOptions = metrics.map((driver) => (
    <option key={driver.driver_number} value={driver.driver_number}>
      {formatDriverLabel(driver.driver_number)}
    </option>
  ));

  const rightOptions = metrics.map((driver) => (
    <option key={driver.driver_number} value={driver.driver_number}>
      {formatDriverLabel(driver.driver_number)}
    </option>
  ));

  const comparisonRows = left && right
    ? [
        { label: "Best lap", leftValue: left.best_lap, rightValue: right.best_lap, formatter: formatLapTime },
        { label: "Average lap", leftValue: left.avg_lap_time, rightValue: right.avg_lap_time, formatter: formatLapTime },
        { label: "Completed laps", leftValue: left.laps_completed, rightValue: right.laps_completed, formatter: formatInteger },
        { label: "Pit-outs", leftValue: left.pit_out_laps, rightValue: right.pit_out_laps, formatter: formatInteger },
      ]
    : [];

  return (
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
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
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
            {races.map((race) => (
              <option key={race} value={race} style={{ background: "#1a1a28", color: "#fff" }}>
                {race}
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
          <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-headline-sm)" }}>{left ? formatDriverLabel(left.driver_number) : "--"}</strong>
          <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>{left ? `${left.laps_completed} laps completed` : "No comparison data"}</span>
        </article>

        <article className="compare-card compare-card--center" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "2px solid var(--color-primary-container) !important" }}>
          <span className="compare-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-primary)" }}>Direct delta</span>
          <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-data-display)", color: "var(--color-primary)" }}>
            {left && right ? formatLapTime(Math.abs(left.avg_lap_time - right.avg_lap_time)) : "--"}
          </strong>
          <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>Average lap gap between the selected drivers.</span>
        </article>

        <article className="compare-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <span className="compare-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>Right lane</span>
          <strong className="compare-card__value" style={{ fontSize: "2rem", fontFamily: "var(--font-family-headline-sm)" }}>{right ? formatDriverLabel(right.driver_number) : "--"}</strong>
          <span className="compare-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6 }}>{right ? `${right.laps_completed} laps completed` : "No comparison data"}</span>
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
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ height: "100%", width: `${(row.leftValue / highest) * 100}%`, background: "var(--color-primary)" }} />
                </div>
                {/* Right lane driver bar */}
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)" }}>
                  <div style={{ height: "100%", width: `${(row.rightValue / highest) * 100}%`, background: "#00d2be" }} />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Comparison Telemetry Charts */}
      {left && right && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {/* Speed Trace comparison chart */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Speed Profile Overlay (km/h)
            </span>
            <div style={{ height: "180px", position: "relative", borderLeft: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)", marginTop: "16px" }}>
              <svg viewBox="0 0 500 180" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                {/* Left driver speed trace line */}
                <path d="M0,130 L50,110 L100,120 L150,30 L200,50 L250,140 L300,90 L350,40 L400,100 L450,20 L500,70" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" />
                {/* Right driver speed trace line */}
                <path d="M0,140 L50,125 L100,135 L150,45 L200,55 L250,145 L300,85 L350,55 L400,115 L450,35 L500,80" fill="none" stroke="#00d2be" strokeWidth="2.5" />
              </svg>
              <div style={{ position: "absolute", bottom: "-18px", width: "100%", display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.4)" }}>
                <span>START</span>
                <span>FINISH</span>
              </div>
            </div>
          </div>

          {/* Throttle vs Brake comparison chart */}
          <div className="glass-card" style={{ padding: "20px" }}>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Throttle Application Overlay (%)
            </span>
            <div style={{ height: "180px", position: "relative", borderLeft: "1px solid rgba(255,255,255,0.2)", borderBottom: "1px solid rgba(255,255,255,0.2)", marginTop: "16px" }}>
              <svg viewBox="0 0 500 180" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                {/* Left driver throttle curve */}
                <path d="M0,10 L50,10 L100,60 L150,10 L200,10 L250,170 L300,10 L350,10 L400,150 L450,10 L500,10" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="3 1" />
                {/* Right driver throttle curve */}
                <path d="M0,10 L50,20 L100,90 L150,10 L200,20 L250,160 L300,10 L350,20 L400,140 L450,10 L500,20" fill="none" stroke="#00d2be" strokeWidth="2" />
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
  );
}
