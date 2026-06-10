import { OdptApiError } from "./errors.js";

/**
 * A `fetch`-compatible function. Defaults to the global `fetch` (Node 18+,
 * Deno, Bun, browsers). Inject your own for custom transports or testing.
 */
export type FetchLike = typeof fetch;

/** Acceptable query-parameter value types. Arrays are comma-joined. */
export type QueryValue = string | number | boolean | Array<string | number> | null | undefined;

/** A bag of query parameters (using raw ODPT wire keys, e.g. `odpt:operator`). */
export type QueryParams = Record<string, QueryValue>;

/** Replace a `acl:consumerKey` value in a URL string with `***` for safe logging. */
export function redactConsumerKey(url: string): string {
  return url.replace(/(acl:consumerKey|acl%3AconsumerKey)=[^&]*/i, "$1=***");
}

/**
 * Normalize a {@link QueryParams} bag into `[key, value]` string pairs:
 * arrays are comma-joined and `null`/`undefined`/empty entries are dropped.
 */
export function normalizeParams(params: QueryParams): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      pairs.push([key, value.join(",")]);
    } else {
      pairs.push([key, String(value)]);
    }
  }
  return pairs;
}

/**
 * Build a fully-qualified ODPT API v4 URL for the given resource path.
 *
 * @param baseUrl   API origin, e.g. `https://api.odpt.org`.
 * @param path      Resource path under `/api/v4/`, e.g. `odpt:Railway` or
 *                  `places/odpt:Station`.
 * @param consumerKey Access token sent as `acl:consumerKey`.
 * @param params    Additional query parameters.
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  consumerKey: string,
  params: QueryParams = {},
): string {
  const origin = baseUrl.replace(/\/+$/, "");
  const search = new URLSearchParams();
  search.set("acl:consumerKey", consumerKey);
  for (const [key, value] of normalizeParams(params)) {
    search.append(key, value);
  }
  return `${origin}/api/v4/${path}?${search.toString()}`;
}

export interface RequestArgs {
  baseUrl: string;
  path: string;
  consumerKey: string;
  params?: QueryParams;
  fetch: FetchLike;
  signal?: AbortSignal;
  /** Optional `User-Agent` header (ignored by browsers). */
  userAgent?: string;
}

/**
 * Perform a GET request against an ODPT API v4 endpoint and return the parsed
 * JSON array. Throws {@link OdptApiError} on non-2xx responses.
 */
export async function request<T>(args: RequestArgs): Promise<T[]> {
  const { baseUrl, path, consumerKey, params = {}, fetch: fetchFn, signal, userAgent } = args;
  const url = buildUrl(baseUrl, path, consumerKey, params);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (userAgent) headers["User-Agent"] = userAgent;

  const response = await fetchFn(url, { method: "GET", headers, signal });

  if (!response.ok) {
    let body: string | undefined;
    try {
      body = await response.text();
    } catch {
      body = undefined;
    }
    throw new OdptApiError({
      status: response.status,
      statusText: response.statusText,
      url: redactConsumerKey(url),
      body,
    });
  }

  const data = (await response.json()) as T[];
  return Array.isArray(data) ? data : [data];
}
