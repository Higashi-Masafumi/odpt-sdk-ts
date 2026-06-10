import type { Calendar, Operator } from "../types/common.js";
import { BaseResource, type BaseQueryOptions } from "./base.js";

/**
 * Common data: operators and calendars (`odpt:Operator`, `odpt:Calendar`).
 */
export class CommonResource extends BaseResource {
  /**
   * Transit operators — `odpt:Operator`.
   */
  operators(options: BaseQueryOptions = {}): Promise<Operator[]> {
    return this.get<Operator>(
      "odpt:Operator",
      { "@id": options.id, "owl:sameAs": options.sameAs },
      options.signal,
    );
  }

  /**
   * Day/date classifications — `odpt:Calendar`.
   */
  calendars(options: BaseQueryOptions = {}): Promise<Calendar[]> {
    return this.get<Calendar>(
      "odpt:Calendar",
      { "@id": options.id, "owl:sameAs": options.sameAs },
      options.signal,
    );
  }
}
