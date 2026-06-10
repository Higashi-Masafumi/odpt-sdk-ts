/**
 * odpt-sdk — a typed TypeScript SDK for the ODPT (Public Transportation Open
 * Data Center) REST API v4.
 *
 * @packageDocumentation
 */
export { OdptClient, DEFAULT_BASE_URL, ENV_TOKEN_KEYS } from "./client.js";
export type { OdptClientOptions } from "./client.js";

export { OdptError, OdptApiError, OdptConfigError } from "./errors.js";

export { buildUrl, normalizeParams, redactConsumerKey, request } from "./http.js";
export type { FetchLike, QueryParams, QueryValue, RequestArgs } from "./http.js";

export { buildId, parseId, ids } from "./ids.js";
export type { ParsedOdptId } from "./ids.js";

export type { BaseQueryOptions, ResourceContext } from "./resources/base.js";
export { CommonResource } from "./resources/common.js";
export { RailwayResource } from "./resources/railway.js";
export type {
  NearbyOptions,
  PassengerSurveyQueryOptions,
  RailwayFareQueryOptions,
  RailwayQueryOptions,
  StationQueryOptions,
  StationTimetableQueryOptions,
  TrainQueryOptions,
  TrainTimetableQueryOptions,
  TrainTypeQueryOptions,
} from "./resources/railway.js";
export { BusResource } from "./resources/bus.js";
export type {
  BusQueryOptions,
  BusroutePatternFareQueryOptions,
  BusroutePatternQueryOptions,
  BusstopPoleQueryOptions,
  BusstopPoleTimetableQueryOptions,
  BusTimetableQueryOptions,
} from "./resources/bus.js";
export { AirplaneResource } from "./resources/airplane.js";
export type {
  AirportTerminalQueryOptions,
  FlightInformationArrivalQueryOptions,
  FlightInformationDepartureQueryOptions,
  FlightScheduleQueryOptions,
} from "./resources/airplane.js";

export * from "./types/index.js";
