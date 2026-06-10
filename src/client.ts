import { OdptConfigError } from "./errors.js";
import { request, type FetchLike, type QueryParams } from "./http.js";
import { AirplaneResource } from "./resources/airplane.js";
import { BusResource } from "./resources/bus.js";
import { CommonResource } from "./resources/common.js";
import { RailwayResource } from "./resources/railway.js";
import type { ResourceContext } from "./resources/base.js";
import type { OdptDataType, OdptDataTypeMap } from "./types/index.js";

/** Default ODPT API origin (Public Transportation Open Data Center). */
export const DEFAULT_BASE_URL = "https://api.odpt.org";

/** Environment variables checked, in order, for the consumer key. */
export const ENV_TOKEN_KEYS = ["ODPT_ACCESS_TOKEN", "ODPT_CONSUMER_KEY", "ODPT_API_KEY"] as const;

export interface OdptClientOptions {
  /**
   * API access token sent as `acl:consumerKey`. If omitted, the client falls
   * back to the `ODPT_ACCESS_TOKEN` (then `ODPT_CONSUMER_KEY`, `ODPT_API_KEY`)
   * environment variable.
   */
  consumerKey?: string;
  /** API origin. Defaults to {@link DEFAULT_BASE_URL}. */
  baseUrl?: string;
  /** Custom `fetch` implementation. Defaults to the global `fetch`. */
  fetch?: FetchLike;
  /** Optional `User-Agent` header to send with every request. */
  userAgent?: string;
}

function readEnvToken(): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined;
  for (const key of ENV_TOKEN_KEYS) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}

/**
 * Typed client for the ODPT (Public Transportation Open Data Center) API v4.
 *
 * Data is grouped into four resource namespaces — {@link OdptClient.common},
 * {@link OdptClient.railway}, {@link OdptClient.bus} and
 * {@link OdptClient.airplane} — mirroring the API's domains. For data types not
 * covered by a convenience method, use {@link OdptClient.find}.
 *
 * @example
 * ```ts
 * const client = new OdptClient(); // reads ODPT_ACCESS_TOKEN
 * const lines = await client.railway.railways({ operator: "odpt.Operator:TokyoMetro" });
 * ```
 */
export class OdptClient {
  /** Operators and calendars. */
  readonly common: CommonResource;
  /** Railway lines, stations, timetables and real-time train data. */
  readonly railway: RailwayResource;
  /** Bus routes, stops, timetables and real-time bus data. */
  readonly bus: BusResource;
  /** Airports, flight schedules and real-time flight data. */
  readonly airplane: AirplaneResource;

  private readonly ctx: ResourceContext;

  constructor(options: OdptClientOptions = {}) {
    const consumerKey = options.consumerKey ?? readEnvToken();
    if (!consumerKey) {
      throw new OdptConfigError(
        `Missing ODPT consumer key. Pass { consumerKey } or set one of: ${ENV_TOKEN_KEYS.join(", ")}.`,
      );
    }

    const fetchImpl = options.fetch ?? (globalThis.fetch as FetchLike | undefined);
    if (!fetchImpl) {
      throw new OdptConfigError(
        "No global fetch available. Provide a fetch implementation via { fetch }.",
      );
    }
    // Bind the global fetch to avoid `Illegal invocation` in some runtimes;
    // leave a user-supplied fetch untouched.
    const fetchFn: FetchLike = options.fetch ? options.fetch : fetchImpl.bind(globalThis);

    this.ctx = {
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      consumerKey,
      fetch: fetchFn,
      userAgent: options.userAgent,
    };

    this.common = new CommonResource(this.ctx);
    this.railway = new RailwayResource(this.ctx);
    this.bus = new BusResource(this.ctx);
    this.airplane = new AirplaneResource(this.ctx);
  }

  /**
   * Low-level, fully-typed access to any ODPT data type. Useful for advanced
   * filters or data types without a convenience method.
   *
   * @example
   * ```ts
   * const trains = await client.find("odpt:Train", {
   *   "odpt:railway": "odpt.Railway:TokyoMetro.Ginza",
   * });
   * ```
   */
  find<K extends OdptDataType>(
    type: K,
    params: QueryParams = {},
    signal?: AbortSignal,
  ): Promise<OdptDataTypeMap[K][]> {
    return request<OdptDataTypeMap[K]>({
      baseUrl: this.ctx.baseUrl,
      consumerKey: this.ctx.consumerKey,
      fetch: this.ctx.fetch,
      userAgent: this.ctx.userAgent,
      path: type,
      params,
      signal,
    });
  }
}
