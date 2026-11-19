import type { ErrorBlockProps } from "../types.ts";
import { getErrorInfo } from "../../../utils/get-error-info.ts";

export function ErrorBlock({ error, onRetry, isRetrying }: ErrorBlockProps) {
  const { title, description, retryable } = getErrorInfo(error);

  return (
    <div role="alert">
      <h3>{title}</h3>
      <p>{description}</p>
      {retryable && onRetry && (
        <button type="button" disabled={isRetrying} onClick={() => onRetry()}>
          {isRetrying ? "Refetching..." : "Try again"}
        </button>
      )}
    </div>
  );
}
