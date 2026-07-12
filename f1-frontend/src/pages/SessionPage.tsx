import { useState, useEffect } from "react";
import type { ApiHealth, RaceSession } from "../types";
import { SectionHeader } from "../components/SectionHeader";
import { ComingSoonWrapper } from "../components/ComingSoonWrapper";

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
    <ComingSoonWrapper 
      title="Admin console coming soon" 
      description="Database locking operations and session control keys will be activated once local server ingestion is configured."
    >
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
            gap: "16px", 
            marginTop: "24px",
            marginBottom: "24px"
          }}
        >
          {/* Health Card */}
          <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                API Health Status
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontFamily: "var(--font-family-headline-sm)", fontWeight: 700 }}>
                {apiHealth?.status === "ok" ? "ONLINE" : "OFFLINE"}
              </h3>
              <p style={{ margin: "4px 0 0", color: apiHealth?.status === "ok" ? "var(--color-primary)" : "#ff4d4f", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>
                FastAPI Gateway {apiHealth?.version ? `v${apiHealth.version}` : ""}
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ color: apiHealth?.status === "ok" ? "var(--color-primary)" : "#ff4d4f", fontSize: "28px" }}>
              {apiHealth?.status === "ok" ? "wifi" : "wifi_off"}
            </span>
          </div>

          {/* Locked Status */}
          <div className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Locked Sessions
              </span>
              <h3 style={{ margin: "8px 0 0", fontSize: "1.5rem", fontFamily: "var(--font-family-headline-sm)", fontWeight: 700 }}>
                {sessionStates.filter((s) => s.isLocked).length} / {sessionStates.length}
              </h3>
              <p style={{ margin: "4px 0 0", color: "var(--color-secondary-fixed-dim)", fontSize: "0.75rem" }}>
                Locked data files are read-only
              </p>
            </div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-secondary-fixed-dim)", fontSize: "28px" }}>lock</span>
          </div>
        </div>

        {/* Global Operations Controls */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-on-surface)" }}>
            Global Database Controls
          </h4>
          <p style={{ margin: "0 0 16px 0", fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)" }}>
            Perform bulk verification operations on ingestion feeds. Locked GP data is cached locally to prevent rate limiting.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button 
              onClick={lockAll} 
              className="btn btn--outline" 
              style={{ padding: "8px 16px", fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", borderRadius: "0px" }}
            >
              LOCK ALL SESSIONS
            </button>
            <button 
              onClick={unlockAll} 
              className="btn btn--outline" 
              style={{ padding: "8px 16px", fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", borderRadius: "0px" }}
            >
              RELEASE ALL LOCKS
            </button>
          </div>
        </div>

        {/* Sessions Ingestion Table */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h4 style={{ margin: "0 0 16px 0", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-on-surface)" }}>
            Ingested GP Sessions ({activeYear})
          </h4>
          <div style={{ overflowX: "auto" }}>
            <table className="driver-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem" }}>Session ID</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem" }}>Event Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem" }}>Date Ingested</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.75rem" }}>Integrity Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "0.75rem" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sessionStates.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                    <td style={{ padding: "16px", fontSize: "0.75rem", fontFamily: "var(--font-family-data-display)" }}>
                      #{s.id}
                    </td>
                    <td style={{ padding: "16px", fontSize: "0.75rem", fontWeight: 700 }}>
                      {s.name}
                    </td>
                    <td style={{ padding: "16px", fontSize: "0.75rem", color: "var(--color-secondary-fixed-dim)", fontFamily: "var(--font-family-data-display)" }}>
                      {s.date}
                    </td>
                    <td style={{ padding: "16px", fontSize: "0.75rem" }}>
                      <span 
                        style={{ 
                          padding: "2px 8px", 
                          background: s.isLocked ? "rgba(6, 239, 6, 0.1)" : "rgba(255, 135, 0, 0.1)", 
                          color: s.isLocked ? "#06ef06" : "#ff8700",
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          textTransform: "uppercase"
                        }}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <button
                        onClick={() => toggleLock(s.id)}
                        className="btn btn--outline"
                        style={{ 
                          padding: "4px 10px", 
                          fontSize: "0.65rem", 
                          fontFamily: "var(--font-family-label-sm)", 
                          borderColor: s.isLocked ? "rgba(225, 6, 0, 0.3)" : "rgba(255,255,255,0.12)",
                          color: s.isLocked ? "var(--color-primary)" : "#fff",
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
    </ComingSoonWrapper>
  );
}
