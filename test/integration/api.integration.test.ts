import { beforeAll, describe, expect, it } from "vitest";
import { OdptClient } from "../../src/index.js";

/**
 * Integration tests run against the live ODPT API. They require a real network
 * connection and an `ODPT_ACCESS_TOKEN`. When the token is absent the whole
 * suite is skipped so unit-only environments stay green.
 *
 * Run with: `pnpm run test:integration`
 */
const TOKEN = process.env.ODPT_ACCESS_TOKEN ?? process.env.ODPT_CONSUMER_KEY;
const describeLive = TOKEN ? describe : describe.skip;

describeLive("ODPT API (live)", () => {
  let client: OdptClient;

  beforeAll(() => {
    client = new OdptClient({ consumerKey: TOKEN });
  });

  it("fetches operators", async () => {
    const operators = await client.common.operators();
    expect(Array.isArray(operators)).toBe(true);
    expect(operators.length).toBeGreaterThan(0);
    const first = operators[0]!;
    expect(first["@id"]).toBeTruthy();
    expect(first["@type"]).toBe("odpt:Operator");
    expect(first["owl:sameAs"]).toMatch(/^odpt\.Operator:/);
  });

  it("fetches calendars", async () => {
    const calendars = await client.common.calendars();
    expect(Array.isArray(calendars)).toBe(true);
  });

  it("fetches railways and filters by operator", async () => {
    const railways = await client.railway.railways();
    expect(railways.length).toBeGreaterThan(0);
    expect(railways[0]!["@type"]).toBe("odpt:Railway");
    expect(Array.isArray(railways[0]!["odpt:stationOrder"])).toBe(true);

    const operator = railways[0]!["odpt:operator"];
    const filtered = await client.railway.railways({ operator });
    expect(filtered.every((r) => r["odpt:operator"] === operator)).toBe(true);
  });

  it("fetches stations for a railway", async () => {
    const railways = await client.railway.railways();
    const railway = railways[0]!["owl:sameAs"];
    const stations = await client.railway.stations({ railway });
    expect(Array.isArray(stations)).toBe(true);
    for (const s of stations) {
      expect(s["@type"]).toBe("odpt:Station");
    }
  });

  it("fetches real-time train information", async () => {
    const info = await client.railway.trainInformation();
    expect(Array.isArray(info)).toBe(true);
  });

  it("fetches airports", async () => {
    const airports = await client.airplane.airports();
    expect(Array.isArray(airports)).toBe(true);
  });

  it("supports find() for arbitrary data types", async () => {
    const types = await client.find("odpt:RailDirection");
    expect(Array.isArray(types)).toBe(true);
  });

  it("rejects with OdptApiError on a bad token", async () => {
    const bad = new OdptClient({ consumerKey: "definitely-not-a-valid-key" });
    await expect(bad.common.operators()).rejects.toMatchObject({ name: "OdptApiError" });
  });
});
