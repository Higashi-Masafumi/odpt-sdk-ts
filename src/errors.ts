/**
 * Base class for every error thrown by this SDK.
 */
export class OdptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OdptError";
    // Restore prototype chain for transpiled targets.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when no consumer key (API access token) is available.
 */
export class OdptConfigError extends OdptError {
  constructor(message: string) {
    super(message);
    this.name = "OdptConfigError";
  }
}

/**
 * Thrown when the ODPT API responds with a non-2xx status.
 */
export class OdptApiError extends OdptError {
  /** HTTP status code. */
  readonly status: number;
  /** HTTP status text. */
  readonly statusText: string;
  /** Request URL (with the consumer key redacted). */
  readonly url: string;
  /** Raw response body, when available. */
  readonly body?: string;

  constructor(args: { status: number; statusText: string; url: string; body?: string }) {
    super(`ODPT API request failed: ${args.status} ${args.statusText}`);
    this.name = "OdptApiError";
    this.status = args.status;
    this.statusText = args.statusText;
    this.url = args.url;
    this.body = args.body;
  }
}
