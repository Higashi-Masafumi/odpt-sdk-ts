import { describe, expect, it } from "vitest";
import { buildId, ids, parseId } from "../../src/ids.js";

describe("buildId", () => {
  it("joins parts with dots after the class colon", () => {
    expect(buildId("Operator", "TokyoMetro")).toBe("odpt.Operator:TokyoMetro");
    expect(buildId("Station", "TokyoMetro", "Ginza", "Ginza")).toBe(
      "odpt.Station:TokyoMetro.Ginza.Ginza",
    );
  });
});

describe("ids helpers", () => {
  it("builds common identifiers", () => {
    expect(ids.operator("JR-East")).toBe("odpt.Operator:JR-East");
    expect(ids.railway("TokyoMetro", "Ginza")).toBe("odpt.Railway:TokyoMetro.Ginza");
    expect(ids.station("TokyoMetro", "Ginza", "Ginza")).toBe("odpt.Station:TokyoMetro.Ginza.Ginza");
    expect(ids.airport("HND")).toBe("odpt.Airport:HND");
  });
});

describe("parseId", () => {
  it("parses a valid identifier", () => {
    expect(parseId("odpt.Station:TokyoMetro.Ginza.Ginza")).toEqual({
      className: "Station",
      parts: ["TokyoMetro", "Ginza", "Ginza"],
    });
  });

  it("returns null for non-odpt strings", () => {
    expect(parseId("urn:ucode:_00001C")).toBeNull();
    expect(parseId("not an id")).toBeNull();
  });

  it("round-trips with buildId", () => {
    const id = buildId("Railway", "Toei", "Asakusa");
    const parsed = parseId(id)!;
    expect(buildId(parsed.className, ...parsed.parts)).toBe(id);
  });
});
