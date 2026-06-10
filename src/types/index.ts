/**
 * All ODPT API v4 data types, plus shared building blocks.
 */
export * from "./common.js";
export * from "./railway.js";
export * from "./bus.js";
export * from "./airplane.js";

import type { Calendar, Operator } from "./common.js";
import type {
  PassengerSurvey,
  RailDirection,
  Railway,
  RailwayFare,
  Station,
  StationTimetable,
  Train,
  TrainInformation,
  TrainTimetable,
  TrainType,
} from "./railway.js";
import type {
  Bus,
  BusroutePattern,
  BusroutePatternFare,
  BusstopPole,
  BusstopPoleTimetable,
  BusTimetable,
} from "./bus.js";
import type {
  Airport,
  AirportTerminal,
  FlightInformationArrival,
  FlightInformationDeparture,
  FlightSchedule,
  FlightStatus,
} from "./airplane.js";

/**
 * Maps each `odpt:` class name to its TypeScript interface. Useful for generic
 * helpers that need to resolve a response shape from a data-type name.
 */
export interface OdptDataTypeMap {
  "odpt:Operator": Operator;
  "odpt:Calendar": Calendar;
  "odpt:RailDirection": RailDirection;
  "odpt:Railway": Railway;
  "odpt:RailwayFare": RailwayFare;
  "odpt:Station": Station;
  "odpt:StationTimetable": StationTimetable;
  "odpt:Train": Train;
  "odpt:TrainInformation": TrainInformation;
  "odpt:TrainTimetable": TrainTimetable;
  "odpt:TrainType": TrainType;
  "odpt:PassengerSurvey": PassengerSurvey;
  "odpt:Bus": Bus;
  "odpt:BusroutePattern": BusroutePattern;
  "odpt:BusroutePatternFare": BusroutePatternFare;
  "odpt:BusstopPole": BusstopPole;
  "odpt:BusstopPoleTimetable": BusstopPoleTimetable;
  "odpt:BusTimetable": BusTimetable;
  "odpt:Airport": Airport;
  "odpt:AirportTerminal": AirportTerminal;
  "odpt:FlightInformationArrival": FlightInformationArrival;
  "odpt:FlightInformationDeparture": FlightInformationDeparture;
  "odpt:FlightSchedule": FlightSchedule;
  "odpt:FlightStatus": FlightStatus;
}

/** The `odpt:` class name of any supported data type. */
export type OdptDataType = keyof OdptDataTypeMap;

/** Discriminated union of every supported ODPT data point. */
export type OdptData = OdptDataTypeMap[OdptDataType];
