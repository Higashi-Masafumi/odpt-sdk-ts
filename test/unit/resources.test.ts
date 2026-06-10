import { beforeEach, describe, expect, it, vi } from "vitest";
import { OdptClient } from "../../src/client.js";

function makeClient() {
  const calls: string[] = [];
  const fetchMock = vi.fn(async (url: string | URL) => {
    calls.push(String(url));
    return new Response("[]", { status: 200 });
  });
  const client = new OdptClient({
    consumerKey: "TESTKEY",
    fetch: fetchMock as unknown as typeof fetch,
  });
  return { client, calls };
}

/** Parse the last recorded request URL. */
function last(calls: string[]): URL {
  return new URL(calls[calls.length - 1]!);
}

describe("resource endpoint paths", () => {
  let client: OdptClient;
  let calls: string[];

  beforeEach(() => {
    ({ client, calls } = makeClient());
  });

  // Exhaustive map of every convenience method to its expected endpoint path.
  const cases: Array<[string, () => Promise<unknown>, string]> = [
    ["common.operators", () => client.common.operators(), "/api/v4/odpt:Operator"],
    ["common.calendars", () => client.common.calendars(), "/api/v4/odpt:Calendar"],
    ["railway.railDirections", () => client.railway.railDirections(), "/api/v4/odpt:RailDirection"],
    ["railway.railways", () => client.railway.railways(), "/api/v4/odpt:Railway"],
    ["railway.railwayFares", () => client.railway.railwayFares(), "/api/v4/odpt:RailwayFare"],
    ["railway.stations", () => client.railway.stations(), "/api/v4/odpt:Station"],
    [
      "railway.stationsNearby",
      () => client.railway.stationsNearby({ lat: 35.6, lon: 139.7, radius: 500 }),
      "/api/v4/places/odpt:Station",
    ],
    [
      "railway.stationTimetables",
      () => client.railway.stationTimetables(),
      "/api/v4/odpt:StationTimetable",
    ],
    ["railway.trains", () => client.railway.trains(), "/api/v4/odpt:Train"],
    [
      "railway.trainInformation",
      () => client.railway.trainInformation(),
      "/api/v4/odpt:TrainInformation",
    ],
    [
      "railway.trainTimetables",
      () => client.railway.trainTimetables(),
      "/api/v4/odpt:TrainTimetable",
    ],
    ["railway.trainTypes", () => client.railway.trainTypes(), "/api/v4/odpt:TrainType"],
    [
      "railway.passengerSurveys",
      () => client.railway.passengerSurveys(),
      "/api/v4/odpt:PassengerSurvey",
    ],
    ["bus.buses", () => client.bus.buses(), "/api/v4/odpt:Bus"],
    ["bus.busTimetables", () => client.bus.busTimetables(), "/api/v4/odpt:BusTimetable"],
    ["bus.busroutePatterns", () => client.bus.busroutePatterns(), "/api/v4/odpt:BusroutePattern"],
    [
      "bus.busroutePatternFares",
      () => client.bus.busroutePatternFares(),
      "/api/v4/odpt:BusroutePatternFare",
    ],
    ["bus.busstopPoles", () => client.bus.busstopPoles(), "/api/v4/odpt:BusstopPole"],
    [
      "bus.busstopPolesNearby",
      () => client.bus.busstopPolesNearby({ lat: 35.6, lon: 139.7, radius: 500 }),
      "/api/v4/places/odpt:BusstopPole",
    ],
    [
      "bus.busstopPoleTimetables",
      () => client.bus.busstopPoleTimetables(),
      "/api/v4/odpt:BusstopPoleTimetable",
    ],
    ["airplane.airports", () => client.airplane.airports(), "/api/v4/odpt:Airport"],
    [
      "airplane.airportTerminals",
      () => client.airplane.airportTerminals(),
      "/api/v4/odpt:AirportTerminal",
    ],
    [
      "airplane.flightInformationArrivals",
      () => client.airplane.flightInformationArrivals(),
      "/api/v4/odpt:FlightInformationArrival",
    ],
    [
      "airplane.flightInformationDepartures",
      () => client.airplane.flightInformationDepartures(),
      "/api/v4/odpt:FlightInformationDeparture",
    ],
    [
      "airplane.flightSchedules",
      () => client.airplane.flightSchedules(),
      "/api/v4/odpt:FlightSchedule",
    ],
    [
      "airplane.flightStatuses",
      () => client.airplane.flightStatuses(),
      "/api/v4/odpt:FlightStatus",
    ],
  ];

  it.each(cases)("%s hits %s", async (_name, call, expectedPath) => {
    await call();
    const url = last(calls);
    expect(url.pathname).toBe(expectedPath);
    expect(url.searchParams.get("acl:consumerKey")).toBe("TESTKEY");
  });

  it("covers all 24 data types plus 2 geo searches", () => {
    expect(cases).toHaveLength(26);
  });
});

describe("parameter mapping", () => {
  let client: OdptClient;
  let calls: string[];

  beforeEach(() => {
    ({ client, calls } = makeClient());
  });

  it("maps friendly railway options to ODPT wire keys", async () => {
    await client.railway.railways({
      operator: "odpt.Operator:TokyoMetro",
      lineCode: "G",
      title: "銀座線",
    });
    const p = last(calls).searchParams;
    expect(p.get("odpt:operator")).toBe("odpt.Operator:TokyoMetro");
    expect(p.get("odpt:lineCode")).toBe("G");
    expect(p.get("dc:title")).toBe("銀座線");
  });

  it("joins array filters with commas", async () => {
    await client.railway.trainInformation({
      operator: ["odpt.Operator:TokyoMetro", "odpt.Operator:Toei"],
    });
    expect(last(calls).searchParams.get("odpt:operator")).toBe(
      "odpt.Operator:TokyoMetro,odpt.Operator:Toei",
    );
  });

  it("maps id and sameAs", async () => {
    await client.common.operators({ id: "urn:ucode:_x", sameAs: "odpt.Operator:JR-East" });
    const p = last(calls).searchParams;
    expect(p.get("@id")).toBe("urn:ucode:_x");
    expect(p.get("owl:sameAs")).toBe("odpt.Operator:JR-East");
  });

  it("sends lon/lat/radius and predicate for geo search", async () => {
    await client.railway.stationsNearby({
      lat: 35.681,
      lon: 139.767,
      radius: 1000,
      predicate: { "odpt:operator": "odpt.Operator:JR-East" },
    });
    const p = last(calls).searchParams;
    expect(p.get("lat")).toBe("35.681");
    expect(p.get("lon")).toBe("139.767");
    expect(p.get("radius")).toBe("1000");
    expect(p.get("odpt:operator")).toBe("odpt.Operator:JR-East");
  });

  it("find() targets the given data type with raw params", async () => {
    await client.find("odpt:Train", { "odpt:railway": "odpt.Railway:TokyoMetro.Ginza" });
    const url = last(calls);
    expect(url.pathname).toBe("/api/v4/odpt:Train");
    expect(url.searchParams.get("odpt:railway")).toBe("odpt.Railway:TokyoMetro.Ginza");
  });
});
