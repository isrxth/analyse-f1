import type { DriverRaceMetrics, RaceSummary } from "../types";

interface Props {
  metrics: DriverRaceMetrics[];
  summary: RaceSummary;
  activeYear: number;
  apiStatusMessage: string;
}

export function OverviewPage({ metrics, summary, activeYear, apiStatusMessage }: Props) {
  void metrics;
  void summary;
  void apiStatusMessage;
  return (
    <section className="page-grid page-grid--overview" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
      {/* Hero Section */}
      <div 
        className="hero-panel glass-card" 
        style={{ 
          position: "relative", 
          minHeight: "450px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "flex-end", 
          padding: "32px", 
          overflow: "hidden" 
        }}
      >
        <div className="racing-gradient" />
        <div className="scanline" />
        
        <div className="hero-panel-content">
          <span 
            className="brand-block__eyebrow" 
            style={{ 
              color: "var(--color-primary)", 
              fontSize: "0.75rem", 
              letterSpacing: "0.2em",
              marginBottom: "16px" 
            }}
          >
            PRECISION DATA ENGINE // v2.04
          </span>
          <h1 
            className="brand-block__title" 
            style={{ 
              fontSize: "clamp(2.5rem, 6vw, 5rem)", 
              lineHeight: "0.95", 
              textTransform: "uppercase", 
              marginBottom: "32px" 
            }}
          >
            The <span style={{ color: "var(--color-primary-container)" }}>Apex</span> of <br />F1 Data
          </h1>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <button className="brutalist-btn brutalist-btn--primary">
              Launch Replay Telemetry
            </button>
            <button className="brutalist-btn brutalist-btn--secondary">
              Browse {activeYear} Archive
            </button>
          </div>
        </div>
      </div>

      {/* Platform Overview Bento Row */}
      <div className="telemetry-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        <article className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "36px", marginBottom: "16px", display: "block" }}>
              sensors
            </span>
            <h3 className="section-header__title" style={{ fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "8px", color: "var(--color-primary)" }}>
              Telemetry
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
              Sensor streams from every chassis. G-force, throttle, brake, and steering inputs at 100Hz.
            </p>
          </div>
          <div style={{ fontFamily: "var(--font-family-data-display)", fontSize: "1.5rem", color: "var(--color-primary)", marginTop: "16px", fontWeight: 600 }}>
            98.4% <span style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)", fontWeight: 400 }}>UPTIME</span>
          </div>
        </article>

        <article className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "36px", marginBottom: "16px", display: "block" }}>
              settings_input_antenna
            </span>
            <h3 className="section-header__title" style={{ fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "8px", color: "var(--color-primary)" }}>
              Strategy
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
              Predictive pit-stop modeling and tire degradation analytics powered by neural networks.
            </p>
          </div>
          <div style={{ fontFamily: "var(--font-family-data-display)", fontSize: "1.5rem", color: "var(--color-primary)", marginTop: "16px", fontWeight: 600 }}>
            12.5M <span style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)", fontWeight: 400 }}>SIMS/SEC</span>
          </div>
        </article>

        <article className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "220px" }}>
          <div>
            <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: "36px", marginBottom: "16px", display: "block" }}>
              query_stats
            </span>
            <h3 className="section-header__title" style={{ fontSize: "1.25rem", textTransform: "uppercase", marginBottom: "8px", color: "var(--color-primary)" }}>
              Race Dynamics
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-on-surface-variant)" }}>
              Visualizing dirty air, DRS windows, and overtake probabilities in real-time 3D space.
            </p>
          </div>
          <div style={{ fontFamily: "var(--font-family-data-display)", fontSize: "1.5rem", color: "var(--color-primary)", marginTop: "16px", fontWeight: 600 }}>
            Archival <span style={{ fontSize: "0.75rem", color: "var(--color-on-surface-variant)", fontWeight: 400 }}>TRACKING</span>
          </div>
        </article>
      </div>

      {/* Featured Races Bento Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "12px" }}>
        
        {/* Monaco GP Card (Col-span 8) */}
        <div 
          className="glass-card cta-hover" 
          style={{ 
            gridColumn: "span 8", 
            minHeight: "380px", 
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
        >
          {/* Background image */}
          <div 
            style={{ 
              position: "absolute",
              inset: 0,
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAoF00GnD9_Yb1icn5wxB8R7gQvBqyFIygzoyIJW253Dy0q2jtA7Q17RUwxs7iYYugFoqhKIHpPnrGhnDtQuRlaokhTedg_R7qQDHqw3nVP75u77CLWnlZ60jI4gZbHzz8n8uhHMBFdMO36hw-Wrw9zrgdcPbEFXMPNz4zlC_HqTOuZkcmDCnq15z24ZehVK6oo5cekOG7oo4qY9aceECSEIfBmYdCHKAuneBN8TP8q22NCEvxiz6TDoxsrGqoBec1IhX74FuePP00')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0
            }}
          />
          {/* Dark Overlay */}
          <div 
            style={{ 
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(13, 13, 27, 0.95) 0%, rgba(13, 13, 27, 0.4) 60%, transparent 100%)",
              zIndex: 1
            }}
          />

          {/* Hover CTA Overlay */}
          <div className="cta-overlay">
            <button className="brutalist-btn brutalist-btn--primary" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "18px 36px" }}>
              Analyze Race <span className="material-symbols-outlined">analytics</span>
            </button>
          </div>

          {/* Monaco details */}
          <div style={{ position: "relative", zIndex: 2, padding: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", width: "100%" }}>
            <div>
              <span className="brand-block__eyebrow" style={{ color: "var(--color-primary)", marginBottom: "4px" }}>
                LAST EVENT RECORD
              </span>
              <h2 className="brand-block__title" style={{ fontSize: "1.75rem", marginBottom: "8px", textTransform: "uppercase" }}>
                Monaco Grand Prix 2024
              </h2>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "rgba(227, 224, 245, 0.8)", maxWidth: "420px" }}>
                Fleet-wide performance traces at the classic circuit. High density telemetry streams recorded.
              </p>
            </div>
            
            <div style={{ width: "160px", height: "100px", border: "1px solid rgba(255, 255, 255, 0.15)", background: "rgba(0,0,0,0.6)", padding: "8px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              {/* Circuit placeholder */}
              <svg viewBox="0 0 100 60" style={{ width: "100%", height: "80%", opacity: 0.6 }}>
                <path d="M10,20 C30,10 70,10 90,20 C95,30 90,45 70,50 C50,55 30,55 10,40 Z" fill="none" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <span style={{ fontSize: "0.55rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255, 255, 255, 0.5)", textTransform: "uppercase", marginTop: "4px" }}>
                Circuit de Monaco
              </span>
            </div>
          </div>
        </div>

        {/* British GP Card (Col-span 4) */}
        <div 
          className="glass-card cta-hover" 
          style={{ 
            gridColumn: "span 4", 
            minHeight: "380px", 
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "24px"
          }}
        >
          {/* Background image */}
          <div 
            style={{ 
              position: "absolute",
              inset: 0,
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCHC9l-yMfzaszuoTQV61H7YFJ40B8hETHvs9ARMEsBVw2XkFXwPMJCiCynQa2vwL3RQ9tHto9rfA0ZtijQpHhtySOgJuIPCKJNK_Tgz9ZSXIsgSCdZGbof-E9IzLVbkHMP09gppRTkR-kFF2gGfgC3B7AozoWabxVreLUvt7RMx9wNboy6oW66f2ViIhZjFgkSc8MRUYS4ZbFx5mLwmvP-HSqEOWTcD1-n-ATfDjI9FU3uLGMM1L24leE2Ft9aywJ5T5OUG211yPc')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0
            }}
          />
          {/* Dark Overlay */}
          <div 
            style={{ 
              position: "absolute",
              inset: 0,
              background: "rgba(13, 13, 27, 0.55)",
              zIndex: 1
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <span style={{ background: "var(--color-primary-container)", color: "#ffffff", padding: "4px 8px", fontSize: "0.65rem", fontFamily: "var(--font-family-label-sm)", fontWeight: 700 }}>
              WINNER: HAM
            </span>
            <span className="material-symbols-outlined" style={{ color: "#ffffff" }}>more_vert</span>
          </div>

          {/* Hover CTA Overlay */}
          <div className="cta-overlay">
            <button className="brutalist-btn brutalist-btn--secondary" style={{ padding: "12px 24px" }}>
              Analyze Race
            </button>
          </div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <h3 className="section-header__title" style={{ fontSize: "1.5rem", textTransform: "uppercase", color: "var(--color-primary)" }}>
              British GP
            </h3>
            <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
              <div>
                <div style={{ fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Top Speed</div>
                <div style={{ fontFamily: "var(--font-family-data-display)", fontSize: "1.1rem", color: "#ffffff" }}>342 KM/H</div>
              </div>
              <div>
                <div style={{ fontSize: "0.6rem", fontFamily: "var(--font-family-label-sm)", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Pit Time</div>
                <div style={{ fontFamily: "var(--font-family-data-display)", fontSize: "1.1rem", color: "#ffffff" }}>2.14 S</div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </section>
  );
}
