/**
 * Aviation-domain data types for the ODPT API v4.
 */
import type { GeoJsonGeometry, MultilingualTitle, OdptResource } from "./common.js";

/**
 * Airport — `odpt:Airport`.
 */
export interface Airport extends OdptResource {
  "@type": "odpt:Airport";
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:airportTitle"?: MultilingualTitle;
  /** AirportTerminal IDs belonging to this airport. */
  "odpt:airportTerminal"?: string[];
  "geo:long"?: number;
  "geo:lat"?: number;
  "ug:region"?: GeoJsonGeometry;
}

/**
 * Airport terminal — `odpt:AirportTerminal`.
 */
export interface AirportTerminal extends OdptResource {
  "@type": "odpt:AirportTerminal";
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:airportTerminalTitle"?: MultilingualTitle;
  "odpt:airport": string;
  "geo:long"?: number;
  "geo:lat"?: number;
  "ug:region"?: GeoJsonGeometry;
}

/**
 * Real-time flight arrival information — `odpt:FlightInformationArrival`.
 */
export interface FlightInformationArrival extends OdptResource {
  "@type": "odpt:FlightInformationArrival";
  "dc:date": string;
  "dct:valid"?: string;
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:airline"?: string;
  "odpt:flightNumber": string[];
  "odpt:flightStatus"?: string;
  "odpt:flightInformationSummary"?: MultilingualTitle;
  "odpt:flightInformationText"?: MultilingualTitle;
  "odpt:scheduledArrivalTime"?: string;
  "odpt:estimatedArrivalTime"?: string;
  "odpt:actualArrivalTime"?: string;
  "odpt:arrivalAirport": string;
  "odpt:arrivalAirportTerminal"?: string;
  "odpt:arrivalGate"?: string;
  "odpt:baggageClaim"?: string;
  "odpt:originAirport"?: string;
  "odpt:viaAirport"?: string[];
  "odpt:aircraftType"?: string;
}

/**
 * Real-time flight departure information — `odpt:FlightInformationDeparture`.
 */
export interface FlightInformationDeparture extends OdptResource {
  "@type": "odpt:FlightInformationDeparture";
  "dc:date": string;
  "dct:valid"?: string;
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:airline"?: string;
  "odpt:flightNumber": string[];
  "odpt:flightStatus"?: string;
  "odpt:flightInformationSummary"?: MultilingualTitle;
  "odpt:flightInformationText"?: MultilingualTitle;
  "odpt:scheduledDepartureTime"?: string;
  "odpt:estimatedDepartureTime"?: string;
  "odpt:actualDepartureTime"?: string;
  "odpt:departureAirport": string;
  "odpt:departureAirportTerminal"?: string;
  "odpt:departureGate"?: string;
  "odpt:checkInCounter"?: string[];
  "odpt:destinationAirport"?: string;
  "odpt:viaAirport"?: string[];
  "odpt:aircraftType"?: string;
}

/**
 * One scheduled flight within a {@link FlightSchedule} (`odpt:flightScheduleObject`).
 */
export interface FlightScheduleObject {
  "odpt:airline": string;
  "odpt:flightNumber": string[];
  "odpt:originTime": string;
  /** Day offset of the origin time relative to the schedule date. */
  "odpt:originDayDifference"?: number;
  "odpt:destinationTime": string;
  /** Day offset of the destination time relative to the schedule date. */
  "odpt:destinationDayDifference"?: number;
  "odpt:viaAirport"?: string[];
  "odpt:aircraftType"?: string;
  "odpt:isValidFrom"?: string;
  "odpt:isValidTo"?: string;
  "odpt:note"?: MultilingualTitle;
}

/**
 * Flight schedule (timetable) — `odpt:FlightSchedule`.
 */
export interface FlightSchedule extends OdptResource {
  "@type": "odpt:FlightSchedule";
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:calendar": string;
  "odpt:originAirport": string;
  "odpt:destinationAirport": string;
  "odpt:flightScheduleObject": FlightScheduleObject[];
}

/**
 * Flight status vocabulary entry — `odpt:FlightStatus`
 * (e.g. on time, delayed, cancelled).
 */
export interface FlightStatus extends OdptResource {
  "@type": "odpt:FlightStatus";
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:flightStatusTitle"?: MultilingualTitle;
}
