import { ErrorBlock } from "./ErrorBlock.tsx";
import { render, screen } from "@testing-library/react";
import type { ErrorBlockProps } from "../types.ts";
import { ApiError } from "../../../lib/api-error.ts";
import { ERROR_INFO } from "../../../utils/error-messages.ts";

const mockError: ErrorBlockProps = {
  error: new ApiError(404),
  onRetry: vi.fn(),
};

describe("ErrorBlock", () => {
  it("should render title and description without a retry button when the error is not retryable", () => {
    render(<ErrorBlock {...mockError} />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      ERROR_INFO.notFound.title
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      ERROR_INFO.notFound.description
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render title, description and retry button when the error is retryable", () => {
    render(<ErrorBlock {...mockError} error={new ApiError(503)} isRetrying />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      ERROR_INFO.server.title
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      ERROR_INFO.server.description
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
