import type { ReactNode } from "react";
import { buildSparklinePath } from "../lib/metrics";

interface Props {
  label: string;
  value: string;
  caption: string;
  accent?: "default" | "critical" | "calm" | "success";
  sparkline?: number[];
  footer?: ReactNode;
}

export function TelemetryCard({ label, value, caption, accent = "default", sparkline = [], footer }: Props) {
  const path = buildSparklinePath(sparkline);

  return (
    <article className={`telemetry-card telemetry-card--${accent}`}>
      <div className="telemetry-card__header">
        <span className="telemetry-card__label">{label}</span>
        {footer ? <div className="telemetry-card__footer">{footer}</div> : null}
      </div>

      <div className="telemetry-card__value">{value}</div>
      <p className="telemetry-card__caption">{caption}</p>

      <svg className="telemetry-card__sparkline" viewBox="0 0 120 32" preserveAspectRatio="none" aria-hidden="true">
        {path ? <path d={path} /> : null}
      </svg>
    </article>
  );
}
