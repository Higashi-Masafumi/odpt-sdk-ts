import type {
  Airport,
  AirportTerminal,
  FlightInformationArrival,
  FlightInformationDeparture,
  FlightSchedule,
  FlightStatus,
} from "../types/airplane.js";
import { BaseResource, type BaseQueryOptions } from "./base.js";

export interface AirportTerminalQueryOptions extends BaseQueryOptions {
  /** Airport ID(s) (`odpt:airport`). */
  airport?: string | string[];
}

export interface FlightInformationArrivalQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  airline?: string | string[];
  flightStatus?: string | string[];
  arrivalAirport?: string | string[];
  arrivalAirportTerminal?: string | string[];
  arrivalGate?: string | string[];
  originAirport?: string | string[];
}

export interface FlightInformationDepartureQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  airline?: string | string[];
  flightStatus?: string | string[];
  departureAirport?: string | string[];
  departureAirportTerminal?: string | string[];
  departureGate?: string | string[];
  destinationAirport?: string | string[];
}

export interface FlightScheduleQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  calendar?: string | string[];
  originAirport?: string | string[];
  destinationAirport?: string | string[];
}

/**
 * Aviation data: airports, terminals, real-time flight info, schedules and
 * status vocabulary.
 */
export class AirplaneResource extends BaseResource {
  /** Airports — `odpt:Airport`. */
  airports(options: BaseQueryOptions = {}): Promise<Airport[]> {
    return this.get<Airport>(
      "odpt:Airport",
      { "@id": options.id, "owl:sameAs": options.sameAs },
      options.signal,
    );
  }

  /** Airport terminals — `odpt:AirportTerminal`. */
  airportTerminals(options: AirportTerminalQueryOptions = {}): Promise<AirportTerminal[]> {
    return this.get<AirportTerminal>(
      "odpt:AirportTerminal",
      { "@id": options.id, "owl:sameAs": options.sameAs, "odpt:airport": options.airport },
      options.signal,
    );
  }

  /** Real-time arrival information — `odpt:FlightInformationArrival`. */
  flightInformationArrivals(
    options: FlightInformationArrivalQueryOptions = {},
  ): Promise<FlightInformationArrival[]> {
    return this.get<FlightInformationArrival>(
      "odpt:FlightInformationArrival",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:airline": options.airline,
        "odpt:flightStatus": options.flightStatus,
        "odpt:arrivalAirport": options.arrivalAirport,
        "odpt:arrivalAirportTerminal": options.arrivalAirportTerminal,
        "odpt:arrivalGate": options.arrivalGate,
        "odpt:originAirport": options.originAirport,
      },
      options.signal,
    );
  }

  /** Real-time departure information — `odpt:FlightInformationDeparture`. */
  flightInformationDepartures(
    options: FlightInformationDepartureQueryOptions = {},
  ): Promise<FlightInformationDeparture[]> {
    return this.get<FlightInformationDeparture>(
      "odpt:FlightInformationDeparture",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:airline": options.airline,
        "odpt:flightStatus": options.flightStatus,
        "odpt:departureAirport": options.departureAirport,
        "odpt:departureAirportTerminal": options.departureAirportTerminal,
        "odpt:departureGate": options.departureGate,
        "odpt:destinationAirport": options.destinationAirport,
      },
      options.signal,
    );
  }

  /** Flight schedules (timetables) — `odpt:FlightSchedule`. */
  flightSchedules(options: FlightScheduleQueryOptions = {}): Promise<FlightSchedule[]> {
    return this.get<FlightSchedule>(
      "odpt:FlightSchedule",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:calendar": options.calendar,
        "odpt:originAirport": options.originAirport,
        "odpt:destinationAirport": options.destinationAirport,
      },
      options.signal,
    );
  }

  /** Flight status vocabulary — `odpt:FlightStatus`. */
  flightStatuses(options: BaseQueryOptions = {}): Promise<FlightStatus[]> {
    return this.get<FlightStatus>(
      "odpt:FlightStatus",
      { "@id": options.id, "owl:sameAs": options.sameAs },
      options.signal,
    );
  }
}
