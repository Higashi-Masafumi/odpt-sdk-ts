/**
 * Shared building blocks for the ODPT JSON-LD data model.
 *
 * The ODPT API returns JSON-LD documents whose property keys are namespaced
 * (e.g. `owl:sameAs`, `dc:title`, `odpt:operator`). These types intentionally
 * keep the original wire keys so the SDK stays a faithful, loss-less mapping of
 * the API. See {@link https://developer.odpt.org/} for the official spec.
 */

/**
 * A multilingual string map keyed by IETF language tag (e.g. `ja`, `en`).
 * Most ODPT title/label fields use this shape.
 */
export type MultilingualTitle = {
  ja?: string;
  en?: string;
  ko?: string;
  "zh-Hans"?: string;
  "zh-Hant"?: string;
} & Record<string, string>;

/**
 * GeoJSON Position: `[longitude, latitude]` (and optionally elevation).
 */
export type GeoJsonPosition = [number, number] | [number, number, number];

export interface GeoJsonPoint {
  type: "Point";
  coordinates: GeoJsonPosition;
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: GeoJsonPosition[];
}

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: GeoJsonPosition[][];
}

export interface GeoJsonMultiPolygon {
  type: "MultiPolygon";
  coordinates: GeoJsonPosition[][][];
}

/**
 * The geometry shape used by `ug:region` fields across the ODPT model.
 */
export type GeoJsonGeometry =
  | GeoJsonPoint
  | GeoJsonLineString
  | GeoJsonPolygon
  | GeoJsonMultiPolygon;

/**
 * Fields shared by every top-level ODPT data point.
 */
export interface OdptResource {
  /** JSON-LD context URL. */
  "@context"?: string;
  /** Unique identifier (ucode / URN) assigned by the data center. */
  "@id": string;
  /** The `odpt:` class name of this resource. */
  "@type": string;
  /** Generation timestamp (ISO 8601). */
  "dc:date"?: string;
}

/**
 * Operator (transit operator / company) — `odpt:Operator`.
 */
export interface Operator extends OdptResource {
  "@type": "odpt:Operator";
  /** Identifier alias. Naming rule: `odpt.Operator:<name>`. */
  "owl:sameAs": string;
  /** Operator name (Japanese). */
  "dc:title"?: string;
  /** Operator name (multilingual). */
  "odpt:operatorTitle"?: MultilingualTitle;
}

/**
 * Calendar / day classification — `odpt:Calendar`
 * (e.g. `odpt.Calendar:Weekday`, `odpt.Calendar:SaturdayHoliday`).
 */
export interface Calendar extends OdptResource {
  "@type": "odpt:Calendar";
  /** Identifier alias. Naming rule: `odpt.Calendar:<name>(.<period>)`. */
  "owl:sameAs": string;
  /** Calendar name (Japanese). */
  "dc:title"?: string;
  /** Calendar name (multilingual). */
  "odpt:calendarTitle"?: MultilingualTitle;
  /** Concrete dates this calendar applies to (ISO 8601). */
  "odpt:day"?: string[];
  /** Validity period (ISO 8601 duration). */
  "odpt:duration"?: string;
}
