import { describe, expect, it, vi } from "vitest";
import { OdptApiError } from "../../src/errors.js";
import { buildUrl, normalizeParams, redactConsumerKey, request } from "../../src/http.js";

describe("normalizeParams", () => {
  it("drops null/undefined and joins arrays with commas", () => {
    expect(
      normalizeParams({
        a: "x",
        b: undefined,
        c: null,
        d: ["1", "2"],
        e: [],
        f: 3,
        g: true,
      }),
    ).toEqual([
      ["a", "x"],
      ["d", "1,2"],
      ["f", "3"],
      ["g", "true"],
    ]);
  });
});

describe("buildUrl", () => {
  it("constructs an /api/v4 url with the consumer key", () => {
    const url = buildUrl("https://api.odpt.org", "odpt:Railway", "SECRET", {
      "odpt:operator": "odpt.Operator:TokyoMetro",
    });
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://api.odpt.org/api/v4/odpt:Railway");
    expect(parsed.searchParams.get("acl:consumerKey")).toBe("SECRET");
    expect(parsed.searchParams.get("odpt:operator")).toBe("odpt.Operator:TokyoMetro");
  });

  it("trims trailing slashes from the base url", () => {
    const url = buildUrl("https://api.odpt.org/", "odpt:Operator", "K");
    expect(url.startsWith("https://api.odpt.org/api/v4/odpt:Operator?")).toBe(true);
  });

  it("omits empty/undefined params", () => {
    const url = buildUrl("https://api.odpt.org", "odpt:Operator", "K", {
      "odpt:operator": undefined,
      "@id": [],
    });
    const parsed = new URL(url);
    expect(parsed.searchParams.has("odpt:operator")).toBe(false);
    expect(parsed.searchParams.has("@id")).toBe(false);
  });
});

describe("redactConsumerKey", () => {
  it("masks the raw key", () => {
    expect(redactConsumerKey("https://x/api/v4/odpt:Operator?acl:consumerKey=abc123&foo=1")).toBe(
      "https://x/api/v4/odpt:Operator?acl:consumerKey=***&foo=1",
    );
  });

  it("masks an encoded key", () => {
    expect(redactConsumerKey("https://x?acl%3AconsumerKey=abc123")).toContain(
      "acl%3AconsumerKey=***",
    );
  });
});

describe("request", () => {
  it("returns the parsed array and calls fetch with the built url", async () => {
    const fetchMock = vi.fn(
      async (_url: string) => new Response(JSON.stringify([{ "@id": "1" }]), { status: 200 }),
    );
    const result = await request<{ "@id": string }>({
      baseUrl: "https://api.odpt.org",
      path: "odpt:Operator",
      consumerKey: "K",
      params: { "odpt:operator": "odpt.Operator:JR-East" },
      fetch: fetchMock as unknown as typeof fetch,
    });
    expect(result).toEqual([{ "@id": "1" }]);
    const calledUrl = fetchMock.mock.calls[0]![0] as string;
    expect(calledUrl).toContain("/api/v4/odpt:Operator");
  });

  it("wraps a single object response into an array", async () => {
    const fetchMock = vi.fn(
      async () => new Response(JSON.stringify({ "@id": "1" }), { status: 200 }),
    );
    const result = await request({
      baseUrl: "https://api.odpt.org",
      path: "odpt:Operator",
      consumerKey: "K",
      fetch: fetchMock as unknown as typeof fetch,
    });
    expect(result).toEqual([{ "@id": "1" }]);
  });

  it("throws OdptApiError with redacted url on non-2xx", async () => {
    const fetchMock = vi.fn(
      async () => new Response("Forbidden", { status: 403, statusText: "Forbidden" }),
    );
    await expect(
      request({
        baseUrl: "https://api.odpt.org",
        path: "odpt:Operator",
        consumerKey: "SECRET",
        fetch: fetchMock as unknown as typeof fetch,
      }),
    ).rejects.toMatchObject({
      name: "OdptApiError",
      status: 403,
      body: "Forbidden",
    });

    try {
      await request({
        baseUrl: "https://api.odpt.org",
        path: "odpt:Operator",
        consumerKey: "SECRET",
        fetch: fetchMock as unknown as typeof fetch,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(OdptApiError);
      expect((err as OdptApiError).url).not.toContain("SECRET");
    }
  });

  it("forwards the abort signal", async () => {
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      expect(init?.signal).toBeDefined();
      return new Response("[]", { status: 200 });
    });
    const controller = new AbortController();
    await request({
      baseUrl: "https://api.odpt.org",
      path: "odpt:Operator",
      consumerKey: "K",
      fetch: fetchMock as unknown as typeof fetch,
      signal: controller.signal,
    });
    expect(fetchMock).toHaveBeenCalled();
  });
});
