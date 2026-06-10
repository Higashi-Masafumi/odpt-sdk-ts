import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_BASE_URL, ENV_TOKEN_KEYS, OdptClient } from "../../src/client.js";
import { OdptConfigError } from "../../src/errors.js";

const noopFetch = (async () => new Response("[]", { status: 200 })) as unknown as typeof fetch;

describe("OdptClient construction", () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const key of ENV_TOKEN_KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_TOKEN_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  });

  it("throws OdptConfigError when no key is available", () => {
    expect(() => new OdptClient({ fetch: noopFetch })).toThrow(OdptConfigError);
  });

  it("reads the consumer key from ODPT_ACCESS_TOKEN", async () => {
    process.env.ODPT_ACCESS_TOKEN = "ENVKEY";
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: string | URL) => {
      calls.push(String(url));
      return new Response("[]", { status: 200 });
    });
    const client = new OdptClient({ fetch: fetchMock as unknown as typeof fetch });
    await client.common.operators();
    expect(new URL(calls[0]!).searchParams.get("acl:consumerKey")).toBe("ENVKEY");
  });

  it("prefers an explicit consumerKey over the environment", async () => {
    process.env.ODPT_ACCESS_TOKEN = "ENVKEY";
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: string | URL) => {
      calls.push(String(url));
      return new Response("[]", { status: 200 });
    });
    const client = new OdptClient({
      consumerKey: "EXPLICIT",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.common.operators();
    expect(new URL(calls[0]!).searchParams.get("acl:consumerKey")).toBe("EXPLICIT");
  });

  it("uses a custom base url", async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: string | URL) => {
      calls.push(String(url));
      return new Response("[]", { status: 200 });
    });
    const client = new OdptClient({
      consumerKey: "K",
      baseUrl: "https://api-tokyochallenge.odpt.org",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.common.operators();
    expect(calls[0]!.startsWith("https://api-tokyochallenge.odpt.org/api/v4/")).toBe(true);
  });

  it("exposes all four resource groups", () => {
    const client = new OdptClient({ consumerKey: "K", fetch: noopFetch });
    expect(client.common).toBeDefined();
    expect(client.railway).toBeDefined();
    expect(client.bus).toBeDefined();
    expect(client.airplane).toBeDefined();
  });

  it("defaults to the public API base url", () => {
    expect(DEFAULT_BASE_URL).toBe("https://api.odpt.org");
  });
});
