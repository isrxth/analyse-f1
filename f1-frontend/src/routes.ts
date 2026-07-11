import type { RouteMeta } from "./types";

export const APP_ROUTES: RouteMeta[] = [
  {
    id: "overview",
    label: "Overview",
    eyebrow: "Command",
    description: "Telemetry summary and race pulse.",
  },
  {
    id: "race",
    label: "Race",
    eyebrow: "Classification",
    description: "Race, Qualifying, and Practice results.",
  },
  {
    id: "compare",
    label: "Compare",
    eyebrow: "Analysis",
    description: "Head-to-head race comparison.",
  },
  {
    id: "session",
    label: "Session",
    eyebrow: "System",
    description: "API health and data source status.",
  },
];

export const DEFAULT_ROUTE = "overview" as const;

export function isAppRoute(value: string): value is RouteMeta["id"] {
  return APP_ROUTES.some((route) => route.id === value);
}

export function getRouteFromHash(hash: string): RouteMeta["id"] {
  const normalized = hash.replace(/^#/, "");
  return isAppRoute(normalized) ? normalized : DEFAULT_ROUTE;
}
