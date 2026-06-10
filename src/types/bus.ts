/**
 * Bus-domain data types for the ODPT API v4.
 */
import type { GeoJsonGeometry, OdptResource } from "./common.js";

/**
 * Real-time bus location — `odpt:Bus`.
 */
export interface Bus extends OdptResource {
  "@type": "odpt:Bus";
  "owl:sameAs": string;
  /** Vehicle / car number. */
  "odpt:busNumber": string;
  /** Valid-until timestamp (ISO 8601). */
  "dct:valid": string;
  /** Service frequency (number of vehicles, when individual vehicles are not tracked). */
  "odpt:frequency": number;
  "odpt:busroutePattern": string;
  "odpt:operator": string;
  "odpt:startingBusstopPole"?: string;
  "odpt:terminalBusstopPole"?: string;
  "odpt:fromBusstopPole"?: string;
  "odpt:fromBusstopPoleTime"?: string;
  "odpt:toBusstopPole"?: string;
  /** Progress between two bus stops, 0..1. */
  "odpt:progress"?: number;
  "geo:lat"?: number;
  "geo:long"?: number;
  /** Speed in km/h. */
  "odpt:speed"?: number;
  /** Heading in degrees (0..360). */
  "odpt:azimuth"?: number;
  /** Door status (e.g. `odpt.DoorStatus:Open` / `Close`, operator dependent). */
  "odpt:doorStatus"?: string;
}

/** Opening-door designation used inside {@link BusstopPoleOrder}. */
export type OpeningDoor = string;

/**
 * One stop in a bus route pattern's ordered stop list (`odpt:busstopPoleOrder`).
 */
export interface BusstopPoleOrder {
  "odpt:busstopPole": string;
  "odpt:index": number;
  "odpt:openingDoorsToGetOn"?: OpeningDoor[];
  "odpt:openingDoorsToGetOff"?: OpeningDoor[];
  "odpt:note"?: string;
}

/**
 * Bus route pattern — `odpt:BusroutePattern`.
 */
export interface BusroutePattern extends OdptResource {
  "@type": "odpt:BusroutePattern";
  "owl:sameAs": string;
  "dct:valid"?: string;
  "dc:title": string;
  "odpt:kana"?: string;
  "odpt:operator": string[];
  "odpt:busroute"?: string;
  "odpt:pattern": string;
  "odpt:direction"?: string;
  "ug:region"?: GeoJsonGeometry;
  "odpt:busstopPoleOrder"?: BusstopPoleOrder[];
  "odpt:note"?: string;
  "odpt:busLocationURL"?: string;
}

/**
 * Bus fare between two stops on route patterns — `odpt:BusroutePatternFare`.
 */
export interface BusroutePatternFare extends OdptResource {
  "@type": "odpt:BusroutePatternFare";
  "owl:sameAs": string;
  "dct:issued"?: string;
  "dct:valid"?: string;
  "odpt:operator": string;
  "odpt:fromBusroutePattern": string;
  "odpt:fromBusstopPoleOrder": number;
  "odpt:fromBusstopPole": string;
  "odpt:toBusroutePattern": string;
  "odpt:toBusstopPoleOrder": number;
  "odpt:toBusstopPole": string;
  "odpt:ticketFare": number;
  "odpt:icCardFare"?: number;
  "odpt:childTicketFare"?: number;
  "odpt:childIcCardFare"?: number;
}

/**
 * One entry in a bus stop pole timetable (`odpt:busstopPoleTimetableObject`).
 */
export interface BusstopPoleTimetableObject {
  "odpt:arrivalTime"?: string;
  "odpt:departureTime": string;
  "odpt:destinationBusstopPole"?: string;
  "odpt:destinationSign"?: string;
  "odpt:busroutePattern"?: string;
  "odpt:isNonStepBus"?: boolean;
  "odpt:isMidnight"?: boolean;
  "odpt:canGetOn"?: boolean;
  "odpt:canGetOff"?: boolean;
  "odpt:note"?: string;
}

/**
 * Bus stop pole (a single physical bus stop) — `odpt:BusstopPole`.
 */
export interface BusstopPole extends OdptResource {
  "@type": "odpt:BusstopPole";
  "owl:sameAs": string;
  "dct:valid"?: string;
  "dc:title": string;
  "odpt:kana"?: string;
  "geo:lat"?: number;
  "geo:long"?: number;
  "ug:region"?: GeoJsonGeometry;
  "odpt:busroutePattern"?: string[];
  "odpt:operator": string[];
  "odpt:busstopPoleNumber"?: string;
  /** Embedded timetable entries (wire key: `odpt:busstopTimetableObject`). */
  "odpt:busstopTimetableObject"?: BusstopPoleTimetableObject[];
}

/**
 * Bus stop pole timetable — `odpt:BusstopPoleTimetable`.
 */
export interface BusstopPoleTimetable extends OdptResource {
  "@type": "odpt:BusstopPoleTimetable";
  "owl:sameAs": string;
  "dct:issued"?: string;
  "dct:valid"?: string;
  "dc:title"?: string;
  "odpt:busstopPole": string;
  "odpt:busDirection": string[];
  "odpt:busroute": string[];
  "odpt:operator": string[];
  "odpt:calendar": string;
  "odpt:busstopTimetableObject": BusstopPoleTimetableObject[];
}

/**
 * One stop in a per-trip bus timetable (`odpt:busTimetableObject`).
 */
export interface BusTimetableObject {
  "odpt:index": number;
  "odpt:busstopPole": string;
  "odpt:arrivalTime"?: string;
  "odpt:departureTime"?: string;
  "odpt:destinationSign"?: string;
  "odpt:isNonStepBus"?: boolean;
  "odpt:isMidnight"?: boolean;
  "odpt:canGetOn"?: boolean;
  "odpt:canGetOff"?: boolean;
  "odpt:note"?: string;
}

/**
 * Per-trip bus timetable — `odpt:BusTimetable`.
 */
export interface BusTimetable extends OdptResource {
  "@type": "odpt:BusTimetable";
  "owl:sameAs": string;
  "dct:issued"?: string;
  "dct:valid"?: string;
  "dc:title"?: string;
  "odpt:kana"?: string;
  "odpt:operator": string;
  "odpt:busroutePattern": string;
  "odpt:calendar": string;
  "odpt:busTimetableObject": BusTimetableObject[];
}
