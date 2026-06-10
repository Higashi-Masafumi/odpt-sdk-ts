# odpt-sdk

A typed TypeScript SDK for the **ODPT** (公共交通オープンデータセンター / Public
Transportation Open Data Center) **REST API v4** — railway, bus and aviation
open data for Japan.

- 🎯 **Fully typed** — every ODPT v4 data type has a TypeScript interface, with
  the original JSON-LD keys preserved (no lossy remapping).
- 🧭 **Discoverable** — methods grouped into `common`, `railway`, `bus` and
  `airplane` namespaces that mirror the API's domains.
- 🪶 **Tiny & dependency-free** — uses the runtime's built-in `fetch`. Works in
  Node 18+, Deno, Bun, edge runtimes and the browser.
- 📦 **Dual ESM/CJS** with bundled type declarations.

> Data is provided by the [Public Transportation Open Data Center](https://www.odpt.org/).
> The SDK author is not affiliated with the data providers. You are responsible
> for complying with the [API terms of use](https://developer.odpt.org/).

## Installation

```sh
pnpm add odpt-sdk
# or: npm install odpt-sdk / yarn add odpt-sdk
```

## Getting an access token

The API requires a free access token (consumer key). Register at
**[developer.odpt.org](https://developer.odpt.org/)**, then either pass the key
explicitly or expose it as the `ODPT_ACCESS_TOKEN` environment variable.

## Quick start

```ts
import { OdptClient } from "odpt-sdk";

// Reads ODPT_ACCESS_TOKEN from the environment by default.
const client = new OdptClient();
// ...or pass it explicitly: new OdptClient({ consumerKey: "xxxx" });

// All railway lines operated by Tokyo Metro
const lines = await client.railway.railways({
  operator: "odpt.Operator:TokyoMetro",
});

// Real-time operation status
const status = await client.railway.trainInformation({
  operator: "odpt.Operator:TokyoMetro",
});

// Stations within 500 m of Tokyo Station
const nearby = await client.railway.stationsNearby({
  lat: 35.681236,
  lon: 139.767125,
  radius: 500,
});

console.log(lines[0]?.["dc:title"], status.length, nearby.length);
```

Every filter accepts a single value **or an array** (joined with commas, as the
API expects):

```ts
await client.railway.trainInformation({
  operator: ["odpt.Operator:TokyoMetro", "odpt.Operator:Toei"],
});
```

Each method also accepts an `AbortSignal` via `signal`:

```ts
const ac = new AbortController();
const trains = await client.railway.trains({ signal: ac.signal });
```

## Supported data types

All 24 ODPT v4 data types are covered, plus two geospatial searches.

| Namespace         | Method                          | ODPT type                         |
| ----------------- | ------------------------------- | --------------------------------- |
| `client.common`   | `operators()`                   | `odpt:Operator`                   |
|                   | `calendars()`                   | `odpt:Calendar`                   |
| `client.railway`  | `railDirections()`              | `odpt:RailDirection`              |
|                   | `railways()`                    | `odpt:Railway`                    |
|                   | `railwayFares()`                | `odpt:RailwayFare`                |
|                   | `stations()`                    | `odpt:Station`                    |
|                   | `stationsNearby()`              | `places/odpt:Station`             |
|                   | `stationTimetables()`           | `odpt:StationTimetable`           |
|                   | `trains()`                      | `odpt:Train` (real-time)          |
|                   | `trainInformation()`            | `odpt:TrainInformation` (RT)      |
|                   | `trainTimetables()`             | `odpt:TrainTimetable`             |
|                   | `trainTypes()`                  | `odpt:TrainType`                  |
|                   | `passengerSurveys()`            | `odpt:PassengerSurvey`            |
| `client.bus`      | `buses()`                       | `odpt:Bus` (real-time)            |
|                   | `busTimetables()`               | `odpt:BusTimetable`               |
|                   | `busroutePatterns()`            | `odpt:BusroutePattern`            |
|                   | `busroutePatternFares()`        | `odpt:BusroutePatternFare`        |
|                   | `busstopPoles()`                | `odpt:BusstopPole`                |
|                   | `busstopPolesNearby()`          | `places/odpt:BusstopPole`         |
|                   | `busstopPoleTimetables()`       | `odpt:BusstopPoleTimetable`       |
| `client.airplane` | `airports()`                    | `odpt:Airport`                    |
|                   | `airportTerminals()`            | `odpt:AirportTerminal`            |
|                   | `flightInformationArrivals()`   | `odpt:FlightInformationArrival`   |
|                   | `flightInformationDepartures()` | `odpt:FlightInformationDeparture` |
|                   | `flightSchedules()`             | `odpt:FlightSchedule`             |
|                   | `flightStatuses()`              | `odpt:FlightStatus`               |

### Escape hatch: `find()`

For advanced filters or future data types, query any type directly with raw
ODPT wire keys — still fully typed by the return type:

```ts
const trains = await client.find("odpt:Train", {
  "odpt:railway": "odpt.Railway:TokyoMetro.Ginza",
});
```

## Identifier helpers

ODPT identifiers follow `odpt.<Class>:<a>.<b>.<c>`. Build and parse them safely:

```ts
import { ids, parseId } from "odpt-sdk";

ids.operator("TokyoMetro"); // "odpt.Operator:TokyoMetro"
ids.railway("TokyoMetro", "Ginza"); // "odpt.Railway:TokyoMetro.Ginza"
ids.station("TokyoMetro", "Ginza", "Ginza"); // "odpt.Station:TokyoMetro.Ginza.Ginza"

parseId("odpt.Station:TokyoMetro.Ginza.Ginza");
// { className: "Station", parts: ["TokyoMetro", "Ginza", "Ginza"] }
```

## Working with results

Responses keep the original JSON-LD keys, so the shapes match the official
spec 1:1:

```ts
const [op] = await client.common.operators({ sameAs: "odpt.Operator:JR-East" });
op?.["@id"]; // ucode
op?.["owl:sameAs"]; // "odpt.Operator:JR-East"
op?.["odpt:operatorTitle"]?.en; // "JR East"
```

## Error handling

```ts
import { OdptApiError, OdptConfigError } from "odpt-sdk";

try {
  await client.common.operators();
} catch (err) {
  if (err instanceof OdptApiError) {
    console.error(err.status, err.body, err.url); // url has the key redacted
  } else if (err instanceof OdptConfigError) {
    // missing token / no fetch available
  }
}
```

## Configuration

```ts
new OdptClient({
  consumerKey: "xxxx", // default: ODPT_ACCESS_TOKEN env var
  baseUrl: "https://api.odpt.org", // default
  fetch: customFetch, // default: global fetch
  userAgent: "my-app/1.0", // optional
});
```

To target the **Tokyo Challenge** API instead, set
`baseUrl: "https://api-tokyochallenge.odpt.org"` with the matching token.

## Development

```sh
pnpm install
pnpm run build             # bundle ESM + CJS + d.ts
pnpm run typecheck
pnpm run lint
pnpm run test:unit         # mocked, no network
pnpm run test:integration  # live API, needs ODPT_ACCESS_TOKEN
```

Integration tests automatically skip when no token is present.

## License

MIT
