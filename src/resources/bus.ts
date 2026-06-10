import type {
  Bus,
  BusroutePattern,
  BusroutePatternFare,
  BusstopPole,
  BusstopPoleTimetable,
  BusTimetable,
} from "../types/bus.js";
import { BaseResource, type BaseQueryOptions } from "./base.js";
import type { NearbyOptions } from "./railway.js";

export interface BusQueryOptions extends BaseQueryOptions {
  busroutePattern?: string | string[];
  operator?: string | string[];
  fromBusstopPole?: string | string[];
  toBusstopPole?: string | string[];
}

export interface BusTimetableQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  busroutePattern?: string | string[];
  title?: string | string[];
  fromBusstopPole?: string | string[];
  calendar?: string | string[];
}

export interface BusroutePatternQueryOptions extends BaseQueryOptions {
  title?: string | string[];
  operator?: string | string[];
  /** Bus route ID(s) (`odpt:busroute`). */
  busroute?: string | string[];
}

export interface BusroutePatternFareQueryOptions extends BaseQueryOptions {
  operator?: string | string[];
  fromBusstopPole?: string | string[];
  toBusstopPole?: string | string[];
  ticketFare?: number;
  childTicketFare?: number;
  icCardFare?: number;
  childIcCardFare?: number;
}

export interface BusstopPoleQueryOptions extends BaseQueryOptions {
  title?: string | string[];
  busstopPoleNumber?: string | string[];
  busroutePattern?: string | string[];
  operator?: string | string[];
}

export interface BusstopPoleTimetableQueryOptions extends BaseQueryOptions {
  busstopPole?: string | string[];
  busDirection?: string | string[];
  busroute?: string | string[];
  operator?: string | string[];
  calendar?: string | string[];
  date?: string | string[];
}

/**
 * Bus data: real-time locations, route patterns, fares, stop poles and
 * timetables.
 */
export class BusResource extends BaseResource {
  /** Real-time bus locations — `odpt:Bus`. */
  buses(options: BusQueryOptions = {}): Promise<Bus[]> {
    return this.get<Bus>(
      "odpt:Bus",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:busroutePattern": options.busroutePattern,
        "odpt:operator": options.operator,
        "odpt:fromBusstopPole": options.fromBusstopPole,
        "odpt:toBusstopPole": options.toBusstopPole,
      },
      options.signal,
    );
  }

  /** Per-trip bus timetables — `odpt:BusTimetable`. */
  busTimetables(options: BusTimetableQueryOptions = {}): Promise<BusTimetable[]> {
    return this.get<BusTimetable>(
      "odpt:BusTimetable",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:busroutePattern": options.busroutePattern,
        "dc:title": options.title,
        "odpt:fromBusstopPole": options.fromBusstopPole,
        "odpt:calendar": options.calendar,
      },
      options.signal,
    );
  }

  /** Bus route patterns — `odpt:BusroutePattern`. */
  busroutePatterns(options: BusroutePatternQueryOptions = {}): Promise<BusroutePattern[]> {
    return this.get<BusroutePattern>(
      "odpt:BusroutePattern",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "dc:title": options.title,
        "odpt:operator": options.operator,
        "odpt:busroute": options.busroute,
      },
      options.signal,
    );
  }

  /** Fares between stops on route patterns — `odpt:BusroutePatternFare`. */
  busroutePatternFares(
    options: BusroutePatternFareQueryOptions = {},
  ): Promise<BusroutePatternFare[]> {
    return this.get<BusroutePatternFare>(
      "odpt:BusroutePatternFare",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:operator": options.operator,
        "odpt:fromBusstopPole": options.fromBusstopPole,
        "odpt:toBusstopPole": options.toBusstopPole,
        "odpt:ticketFare": options.ticketFare,
        "odpt:childTicketFare": options.childTicketFare,
        "odpt:icCardFare": options.icCardFare,
        "odpt:childIcCardFare": options.childIcCardFare,
      },
      options.signal,
    );
  }

  /** Bus stop poles — `odpt:BusstopPole`. */
  busstopPoles(options: BusstopPoleQueryOptions = {}): Promise<BusstopPole[]> {
    return this.get<BusstopPole>(
      "odpt:BusstopPole",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "dc:title": options.title,
        "odpt:busstopPoleNumber": options.busstopPoleNumber,
        "odpt:busroutePattern": options.busroutePattern,
        "odpt:operator": options.operator,
      },
      options.signal,
    );
  }

  /** Bus stop poles near a point — `GET /api/v4/places/odpt:BusstopPole`. */
  busstopPolesNearby(options: NearbyOptions): Promise<BusstopPole[]> {
    return this.get<BusstopPole>(
      "places/odpt:BusstopPole",
      { lon: options.lon, lat: options.lat, radius: options.radius, ...options.predicate },
      options.signal,
    );
  }

  /** Bus stop pole timetables — `odpt:BusstopPoleTimetable`. */
  busstopPoleTimetables(
    options: BusstopPoleTimetableQueryOptions = {},
  ): Promise<BusstopPoleTimetable[]> {
    return this.get<BusstopPoleTimetable>(
      "odpt:BusstopPoleTimetable",
      {
        "@id": options.id,
        "owl:sameAs": options.sameAs,
        "odpt:busstopPole": options.busstopPole,
        "odpt:busDirection": options.busDirection,
        "odpt:busroute": options.busroute,
        "odpt:operator": options.operator,
        "odpt:calendar": options.calendar,
        "dc:date": options.date,
      },
      options.signal,
    );
  }
}
