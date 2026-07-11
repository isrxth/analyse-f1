import type { ReactNode } from "react";
import { APP_ROUTES } from "../routes";
import type { ApiHealth, AppRouteId } from "../types";

interface Props {
  activeRoute: AppRouteId;
  activeYear: number;
  apiHealth: ApiHealth | null;
  apiStatusMessage: string;
  driverCount: number;
  onRouteChange: (route: AppRouteId) => void;
  onYearChange: (year: number) => void;
  children: ReactNode;
}

const seasonChoices = [2023, 2024, 2025, 2026];

export function AppShell({
  activeRoute,
  activeYear,
  apiHealth,
  apiStatusMessage,
  onRouteChange,
  onYearChange,
  children,
}: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Header Bar */}
      <header 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          height: "64px", 
          zIndex: 50, 
          background: "rgba(30, 30, 45, 0.75)", 
          backdropFilter: "blur(40px)", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
      >
        <div 
          style={{ 
            maxWidth: "1280px", 
            margin: "0 auto", 
            height: "100%", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "0 24px" 
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <span 
              onClick={() => onRouteChange("overview")}
              style={{ 
                fontFamily: "var(--font-family-headline-sm)", 
                fontSize: "1.25rem", 
                fontWeight: 800, 
                letterSpacing: "-0.04em", 
                color: "var(--color-primary)",
                cursor: "pointer"
              }}
            >
              APEX ANALYTICS
            </span>
            
            <nav style={{ display: "flex", gap: "24px" }}>
              {APP_ROUTES.map((route) => (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => onRouteChange(route.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: route.id === activeRoute ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                    fontWeight: route.id === activeRoute ? 700 : 500,
                    fontSize: "0.85rem",
                    padding: "6px 0",
                    borderBottom: route.id === activeRoute ? "2px solid var(--color-primary-container)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {route.label}
                </button>
              ))}
            </nav>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", cursor: "pointer" }}>settings</span>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", cursor: "pointer", position: "relative" }}>
              notifications
              <span style={{ position: "absolute", top: "-2px", right: "-2px", width: "6px", height: "6px", background: "var(--color-primary-container)", borderRadius: "50%" }} />
            </span>
            <div style={{ width: "32px", height: "32px", border: "1px solid var(--color-primary)", overflow: "hidden" }}>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvdMnohbBE2udfzJ3EwrT25J3DWZA6qsGX32su_1U7AVs6Ka7nSmmus325DIZgPmXbCXW1SkiLc9_01lLrRaLnVZyCdK4WaopJQMJSaw9mnsnXUAdJT01NPNF-96idfeNmZR0YzXhHw51FXURte4RU0IUHld3Ah-n-K4rJj8y_JwSI40H7DsPqietVse0n0LDKNlROom4Murb6dGAO3Gbc6iY9qL277aAHv_kYI4lrmzUIwGxRuWYPIwckfVrWiNDsMrEKcTABQGs" 
                alt="Profile" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Body Container */}
      <main style={{ flex: 1, paddingTop: "88px", paddingBottom: "48px", maxWidth: "1280px", width: "100%", margin: "0 auto", paddingLeft: "24px", paddingRight: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        {/* Season Selector Row */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase" }}>
            Select Season
          </span>
          <div style={{ display: "flex", gap: "6px" }}>
            {seasonChoices.map((season) => (
              <button
                key={season}
                type="button"
                onClick={() => onYearChange(season)}
                style={{
                  background: season === activeYear ? "var(--color-primary-container)" : "rgba(17, 17, 31, 0.9)",
                  color: season === activeYear ? "var(--color-on-primary-container)" : "var(--color-on-surface)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  fontFamily: "var(--font-family-label-sm)",
                  fontSize: "0.75rem",
                  padding: "6px 12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {season}
              </button>
            ))}
          </div>
        </div>

        {children}
      </main>

      {/* Footer Area */}
      <footer 
        style={{ 
          background: "var(--color-surface-container-lowest)", 
          borderTop: "1px solid rgba(255, 255, 255, 0.1)", 
          padding: "24px 0",
          marginTop: "auto"
        }}
      >
        <div 
          style={{ 
            maxWidth: "1280px", 
            margin: "0 auto", 
            padding: "0 24px", 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px" 
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-primary)", fontFamily: "var(--font-family-headline-sm)", fontSize: "1.1rem", fontWeight: 700 }}>
              APEX ANALYTICS
              <span className="status-pulse" style={{ width: "8px", height: "8px", background: "#00d100", borderRadius: "50%" }} />
            </div>

            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
              <a href="#" style={{ fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                API Status: {apiHealth?.status?.toUpperCase() ?? "OFFLINE"}
              </a>
              <a href="#" style={{ fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                Terms of Service
              </a>
              <a href="#" style={{ fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                Telemetry Docs
              </a>
              <a href="#" style={{ fontSize: "0.7rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-on-surface-variant)", textTransform: "uppercase" }}>
                Credits
              </a>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderTop: "1px solid rgba(255, 255, 255, 0.05)", paddingTop: "16px" }}>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-secondary-fixed-dim)", textTransform: "uppercase" }}>
              © 2026 APEX ANALYTICS. FIA OFFICIAL DATA PARTNER PROGRAM.
            </span>
            <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", color: "var(--color-on-surface-variant)" }}>
              {apiStatusMessage}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
