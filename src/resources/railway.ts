import type { QueryParams } from "../http.js";
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
} from "../types/railway.js";
import { BaseResource, type BaseQueryOptions } from "./base.js";

export interface RailwayQueryOptions extends BaseQueryOptions {
  /** Railway name(s), exact match (`dc:title`). */
  title?: string | string[];
  /** Operator ID(s) (`odpt:operator`). */
  operator?: string | string[];
  /** Line code(s) (`odpt:lineCode`). */
  lineCode?: string | string[];
}

export interface RailwayFareQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  /** Origin station ID(s) (`odpt:fromStation`). */
  fromStation?: string | string[];
  /** Destination station ID(s) (`odpt:toStation`). */
  toStation?: string | string[];
}

export interface StationQueryOptions extends BaseQueryOptions {
  title?: string | string[];
  operator?: string | string[];
  railway?: string | string[];
  stationCode?: string | string[];
}

export interface StationTimetableQueryOptions extends BaseQueryOptions {
  station?: string | string[];
  railway?: string | string[];
  operator?: string | string[];
  railDirection?: string | string[];
  calendar?: string | string[];
  /** Specific date(s), `dc:date` (e.g. `2024-01-01`). */
  date?: string | string[];
}

export interface TrainQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  railway?: string | string[];
}

export interface TrainTimetableQueryOptions extends BaseQueryOptions {
  trainNumber?: string | string[];
  railway?: string | string[];
  operator?: string | string[];
  trainType?: string | string[];
  train?: string | string[];
  calendar?: string | string[];
}

export interface TrainTypeQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
}

export interface PassengerSurveyQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  station?: string | string[];
  railway?: string | string[];
}

/** Options for geospatial ("places") searches. */
export interface NearbyOptions {
  /** Latitude (WGS84). */
  lat: number;
  /** Longitude (WGS84). */
  lon: number;
  /** Search radius in meters. */
  radius: number;
  /** Extra exact-match predicate filters (ODPT wire keys). */
  predicate?: QueryParams;
  signal?: AbortSignal;
}

/**
 * Railway data: directions, lines, fares, stations, timetables, real-time
 * trains, operation info, train types and passenger surveys.
 */
export class RailwayResource extends BaseResource {
  /** Rail directions — `odpt:RailDirection`. */
  railDirections(options: BaseQueryOptions = {}): Promise<RailDirection[]> {
    return this.get<RailDirection>(
      "odpt:RailDirection",
      { "@id": options.id, "owl:sameAs": options.sameAs },
      options.signal,
    );
  }

  /** Railway lines — `odpt:Railway`. */
  railways(options: RailwayQueryOptions = {}): Promise<Railway[]> {
    return this.get<Railway>(
      "odpt:Railway",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "dc:title": options.title,
        "odpt:operator": options.operator,
        "odpt:lineCode": options.lineCode,
      },
      options.signal,
    );
  }

  /** Fares between stations — `odpt:RailwayFare`. */
  railwayFares(options: RailwayFareQueryOptions = {}): Promise<RailwayFare[]> {
    return this.get<RailwayFare>(
      "odpt:RailwayFare",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:fromStation": options.fromStation,
        "odpt:toStation": options.toStation,
      },
      options.signal,
    );
  }

  /** Stations — `odpt:Station`. */
  stations(options: StationQueryOptions = {}): Promise<Station[]> {
    return this.get<Station>(
      "odpt:Station",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "dc:title": options.title,
        "odpt:operator": options.operator,
        "odpt:railway": options.railway,
        "odpt:stationCode": options.stationCode,
      },
      options.signal,
    );
  }

  /** Stations near a point — `GET /api/v4/places/odpt:Station`. */
  stationsNearby(options: NearbyOptions): Promise<Station[]> {
    return this.get<Station>(
      "places/odpt:Station",
      { lon: options.lon, lat: options.lat, radius: options.radius, ...options.predicate },
      options.signal,
    );
  }

  /** Station timetables — `odpt:StationTimetable`. */
  stationTimetables(options: StationTimetableQueryOptions = {}): Promise<StationTimetable[]> {
    return this.get<StationTimetable>(
      "odpt:StationTimetable",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:station": options.station,
        "odpt:railway": options.railway,
        "odpt:operator": options.operator,
        "odpt:railDirection": options.railDirection,
        "odpt:calendar": options.calendar,
        "dc:date": options.date,
      },
      options.signal,
    );
  }

  /** Real-time train locations — `odpt:Train`. */
  trains(options: TrainQueryOptions = {}): Promise<Train[]> {
    return this.get<Train>(
      "odpt:Train",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:railway": options.railway,
      },
      options.signal,
    );
  }

  /** Real-time operation/service information — `odpt:TrainInformation`. */
  trainInformation(options: TrainQueryOptions = {}): Promise<TrainInformation[]> {
    return this.get<TrainInformation>(
      "odpt:TrainInformation",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:railway": options.railway,
      },
      options.signal,
    );
  }

  /** Train timetables — `odpt:TrainTimetable`. */
  trainTimetables(options: TrainTimetableQueryOptions = {}): Promise<TrainTimetable[]> {
    return this.get<TrainTimetable>(
      "odpt:TrainTimetable",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:trainNumber": options.trainNumber,
        "odpt:railway": options.railway,
        "odpt:operator": options.operator,
        "odpt:trainType": options.trainType,
        "odpt:train": options.train,
        "odpt:calendar": options.calendar,
      },
      options.signal,
    );
  }

  /** Train types — `odpt:TrainType`. */
  trainTypes(options: TrainTypeQueryOptions = {}): Promise<TrainType[]> {
    return this.get<TrainType>(
      "odpt:TrainType",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
      },
      options.signal,
    );
  }

  /** Passenger surveys (boarding figures) — `odpt:PassengerSurvey`. */
  passengerSurveys(options: PassengerSurveyQueryOptions = {}): Promise<PassengerSurvey[]> {
    return this.get<PassengerSurvey>(
      "odpt:PassengerSurvey",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:station": options.station,
        "odpt:railway": options.railway,
      },
      options.signal,
    );
  }
}
