import { ApiError } from "../lib/api-error.ts";
import type { ErrorInfo } from "./types.ts";
import { ERROR_INFO } from "./error-messages.ts";

export function getErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof ApiError) {
    if (error.status === 0) {
      return ERROR_INFO.noConnection;
    }

    if (error.status === 404) {
      return ERROR_INFO.notFound;
    }

    if (error.status === 401) {
      return ERROR_INFO.unauthorized;
    }

    if (error.status === 403) {
      return ERROR_INFO.forbidden;
    }

    if (error.status === 429) {
      return ERROR_INFO.tooManyRequests;
    }

    if (error.status >= 500) {
      return ERROR_INFO.server;
    }
  }

  return ERROR_INFO.unknown;
}
