import { request, type FetchLike, type QueryParams } from "../http.js";

/** Runtime context shared by all resource groups. */
export interface ResourceContext {
  baseUrl: string;
  consumerKey: string;
  fetch: FetchLike;
  userAgent?: string;
}

/** Options accepted by every data-type query method. */
export interface BaseQueryOptions {
  /** Filter by unique identifier(s) (`@id`, ucode). */
  id?: string | string[];
  /** Filter by identifier alias(es) (`owl:sameAs`, e.g. `odpt.Operator:JR-East`). */
  sameAs?: string | string[];
  /** Abort the underlying request. */
  signal?: AbortSignal;
}

/**
 * Shared base for resource groups. Holds the request context and exposes a
 * typed `get` helper that performs a GET against `/api/v4/<path>`.
 */
export abstract class BaseResource {
  constructor(protected readonly ctx: ResourceContext) {}

  protected get<T>(path: string, params: QueryParams, signal?: AbortSignal): Promise<T[]> {
    return request<T>({
      baseUrl: this.ctx.baseUrl,
      consumerKey: this.ctx.consumerKey,
      fetch: this.ctx.fetch,
      userAgent: this.ctx.userAgent,
      path,
      params,
      signal,
    });
  }
}
