import { getErrorInfo } from "./get-error-info.ts";
import { ERROR_INFO } from "./error-messages.ts";
import { ApiError } from "../lib/api-error.ts";

describe("getErrorInfo", () => {
  it.each([
    [0, ERROR_INFO.noConnection],
    [404, ERROR_INFO.notFound],
    [401, ERROR_INFO.unauthorized],
    [403, ERROR_INFO.forbidden],
    [429, ERROR_INFO.tooManyRequests],
    [500, ERROR_INFO.server],
  ])("should maps status %i to the expected error info", (status, expected) => {
    expect(getErrorInfo(new ApiError(status))).toBe(expected);
  });

  it("should return the generic message for a non-ApiError", () => {
    expect(getErrorInfo(new Error("test")).title).toBe(
      ERROR_INFO.unknown.title
    );
  });

  it("should return the generic message for for an unknown status like 418", () => {
    expect(getErrorInfo(new ApiError(418, "test")).title).toBe(
      ERROR_INFO.unknown.title
    );
  });
});
