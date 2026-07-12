import React from "react";

interface ComingSoonProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  isBlurred?: boolean;
}

export function ComingSoonWrapper({ 
  children, 
  title = "Telemetry coming soon", 
  description = "We are currently modeling analytics feeds for this section. Check back shortly.", 
  isBlurred = true 
}: ComingSoonProps) {
  if (!isBlurred) return <>{children}</>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "350px" }}>
      {/* Blurred background content */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none", opacity: 0.15 }}>
        {children}
      </div>

      {/* Frost Overlay */}
      <div 
        style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          zIndex: 10,
          background: "rgba(10, 10, 18, 0.45)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "24px",
          textAlign: "center"
        }}
      >
        <div 
          className="glass-card" 
          style={{ 
            maxWidth: "420px", 
            padding: "32px", 
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}
        >
          {/* Animated construction icon */}
          <div 
            style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "50%", 
              background: "rgba(225, 6, 0, 0.1)", 
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "28px" }}>construction</span>
          </div>

          <span 
            style={{ 
              fontSize: "0.65rem", 
              fontFamily: "var(--font-family-label-sm)", 
              color: "var(--color-primary)", 
              textTransform: "uppercase", 
              letterSpacing: "0.15em",
              fontWeight: 700
            }}
          >
            Coming Soon
          </span>

          <h3 
            style={{ 
              margin: 0, 
              fontSize: "1.5rem", 
              fontFamily: "var(--font-family-headline-sm)", 
              fontWeight: 700, 
              color: "var(--color-on-surface)" 
            }}
          >
            {title}
          </h3>

          <p 
            style={{ 
              margin: 0, 
              fontSize: "0.85rem", 
              color: "var(--color-secondary-fixed-dim)", 
              lineHeight: 1.5 
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
