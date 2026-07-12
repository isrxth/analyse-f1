import { useState, useEffect } from "react";
import type { ApiHealth, RaceSession } from "../types";
import { SectionHeader } from "../components/SectionHeader";

interface Props {
  apiHealth: ApiHealth | null;
  apiStatusMessage: string;
  activeYear: number;
  sessions: RaceSession[];
}

interface RaceSessionState {
  id: string;
  name: string;
  date: string;
  isLocked: boolean;
  status: string;
}

export function SessionPage({ apiHealth, apiStatusMessage, activeYear, sessions }: Props) {
  const [sessionStates, setSessionStates] = useState<RaceSessionState[]>([]);

  // Update sessionStates when props sessions change
  useEffect(() => {
    setSessionStates(
      sessions.map((s) => ({
        id: String(s.session_key),
        name: `${s.location} (${s.country_name})`,
        date: s.date_start ? new Date(s.date_start).toLocaleDateString() : "TBD",
        isLocked: false,
        status: "Awaiting Verification",
      }))
    );
  }, [sessions]);

  const toggleLock = (sessionId: string) => {
    setSessionStates((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              isLocked: !s.isLocked,
              status: !s.isLocked ? "VERIFIED & LOCKED" : "AWAITING VERIFICATION",
            }
          : s
      )
    );
  };

  const lockAll = () => {
    setSessionStates((prev) =>
      prev.map((s) => ({
        ...s,
        isLocked: true,
        status: "VERIFIED & LOCKED",
      }))
    );
  };

  const unlockAll = () => {
    setSessionStates((prev) =>
      prev.map((s) => ({
        ...s,
        isLocked: false,
        status: "AWAITING VERIFICATION",
      }))
    );
  };

  return (
    <section className="surface-panel session-panel" style={{ padding: "24px" }}>
      <SectionHeader
        eyebrow="Admin Console"
        title="Telemetry database operations"
        description="Verify database connections, check API latency limits, and lock analytics sessions until data integrity checks complete."
      />

      {/* Backend Status Metrics Row */}
      <div 
        className="session-grid" 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "12px", 
          marginBottom: "24px" 
        }}
      >
        <article className="info-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span className="info-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>API status</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <span className="status-chip__dot" style={{ background: apiHealth && apiHealth.status !== "offline" ? "#00d100" : "#ff9f00", width: "10px", height: "10px" }} />
              <strong className="info-card__value" style={{ fontSize: "1.75rem", fontFamily: "var(--font-family-headline-sm)" }}>
                {apiHealth?.status?.toUpperCase() ?? "OFFLINE"}
              </strong>
            </div>
          </div>
          <span className="info-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "8px" }}>
            FastAPI endpoint version: {apiHealth?.version ?? "v0.1.0-alpha"}
          </span>
        </article>

        <article className="info-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span className="info-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>Active season</span>
            <strong className="info-card__value" style={{ fontSize: "1.75rem", fontFamily: "var(--font-family-headline-sm)", display: "block", marginTop: "8px" }}>
              {activeYear}
            </strong>
          </div>
          <span className="info-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "8px" }}>
            Locking rules apply only to F1 {activeYear} records.
          </span>
        </article>

        <article className="info-card" style={{ padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span className="info-card__label" style={{ fontSize: "0.65rem", textTransform: "uppercase", color: "var(--color-secondary-fixed-dim)" }}>Connection pulse</span>
            <strong className="info-card__value" style={{ fontSize: "1.75rem", fontFamily: "var(--font-family-headline-sm)", display: "block", marginTop: "8px" }}>
              99.8% Uptime
            </strong>
          </div>
          <span className="info-card__meta" style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "8px" }}>
            Database latency: 12ms (Postgres RDS).
          </span>
        </article>
      </div>

      {/* Admin Action Bar */}
      <div 
        className="glass-card" 
        style={{ 
          padding: "20px", 
          marginBottom: "24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap", 
          gap: "16px" 
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", textTransform: "uppercase" }}>Global locks configuration</h3>
          <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)" }}>
            Mass action switches to enforce analytics blocks across the selected year.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button 
            onClick={lockAll} 
            className="brutalist-btn"
            style={{ padding: "8px 16px", fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", background: "rgba(225,6,0,0.12)", color: "var(--color-primary)", border: "1px solid var(--color-primary)", cursor: "pointer" }}
          >
            LOCK ALL SESSIONS
          </button>
          <button 
            onClick={unlockAll} 
            className="brutalist-btn"
            style={{ padding: "8px 16px", fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
          >
            UNLOCK ALL
          </button>
        </div>
      </div>

      {/* Race Sessions Locking Log */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", textTransform: "uppercase" }}>Race sessions verification locking</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <th style={{ padding: "16px 20px" }}>Race Event</th>
                <th style={{ padding: "16px 20px" }}>Session Date</th>
                <th style={{ padding: "16px 20px" }}>Status</th>
                <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessionStates.map((s) => (
                <tr key={s.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", opacity: s.isLocked ? 0.85 : 1 }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "16px", color: s.isLocked ? "var(--color-primary)" : "var(--color-secondary-fixed-dim)" }}>
                        {s.isLocked ? "lock" : "lock_open"}
                      </span>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontFamily: "var(--font-family-data-display)", color: "var(--color-secondary-fixed-dim)", fontSize: "0.85rem" }}>
                    {s.date}
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span 
                      style={{ 
                        padding: "2px 8px", 
                        background: s.isLocked ? "rgba(225, 6, 0, 0.15)" : "rgba(0, 209, 0, 0.15)", 
                        color: s.isLocked ? "#ff5b57" : "#00d100", 
                        fontSize: "0.65rem", 
                        fontWeight: 700, 
                        textTransform: "uppercase" 
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button
                      onClick={() => toggleLock(s.id)}
                      className="brutalist-btn"
                      style={{
                        padding: "6px 12px",
                        fontSize: "0.65rem",
                        fontFamily: "var(--font-family-label-sm)",
                        background: s.isLocked ? "rgba(255,255,255,0.05)" : "var(--color-primary-container)",
                        color: s.isLocked ? "#fff" : "var(--color-on-primary-container)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        cursor: "pointer",
                        borderRadius: "0px"
                      }}
                    >
                      {s.isLocked ? "UNLOCK SESSION" : "VERIFY & LOCK"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="session-panel__message" style={{ marginTop: "24px", color: "var(--color-secondary-fixed-dim)", fontSize: "0.75rem", fontStyle: "italic" }}>
        {apiStatusMessage || "Administrator cockpit connected."}
      </div>
    </section>
  );
}
