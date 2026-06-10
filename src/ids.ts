/**
 * Helpers for building and parsing ODPT identifiers.
 *
 * ODPT `owl:sameAs` identifiers follow the pattern `odpt.<Class>:<a>.<b>.<c>`,
 * for example `odpt.Operator:TokyoMetro`,
 * `odpt.Railway:TokyoMetro.Ginza` and
 * `odpt.Station:TokyoMetro.Ginza.Ginza`.
 */

/** Build an ODPT identifier from a class name and dot-joined parts. */
export function buildId(className: string, ...parts: string[]): string {
  return `odpt.${className}:${parts.join(".")}`;
}

export interface ParsedOdptId {
  /** The class name, e.g. `Operator`, `Railway`, `Station`. */
  className: string;
  /** The dot-separated parts after the colon. */
  parts: string[];
}

/**
 * Parse an ODPT identifier. Returns `null` if it does not match the expected
 * `odpt.<Class>:<parts>` shape.
 */
export function parseId(id: string): ParsedOdptId | null {
  const match = /^odpt\.([A-Za-z]+):(.+)$/.exec(id);
  if (!match) return null;
  return { className: match[1]!, parts: match[2]!.split(".") };
}

/** Convenience builders for the most commonly referenced identifiers. */
export const ids = {
  operator: (operator: string): string => buildId("Operator", operator),
  calendar: (name: string): string => buildId("Calendar", name),
  railway: (operator: string, line: string): string => buildId("Railway", operator, line),
  railDirection: (operator: string, direction: string): string =>
    buildId("RailDirection", operator, direction),
  station: (operator: string, line: string, station: string): string =>
    buildId("Station", operator, line, station),
  trainType: (operator: string, type: string): string => buildId("TrainType", operator, type),
  busroute: (operator: string, route: string): string => buildId("Busroute", operator, route),
  busstopPole: (operator: string, ...parts: string[]): string =>
    buildId("BusstopPole", operator, ...parts),
  airport: (airport: string): string => buildId("Airport", airport),
} as const;
