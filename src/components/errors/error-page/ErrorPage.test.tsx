import { ErrorPage } from "./ErrorPage.tsx";
import type { ErrorBlockProps } from "../types.ts";
import { ApiError } from "../../../lib/api-error.ts";
import { render, screen } from "../../../testing/utils/test-utils.tsx";
import userEvent from "@testing-library/user-event";

const mockError: ErrorBlockProps = {
  error: new ApiError(404),
  onRetry: vi.fn(),
};

describe("ErrorPage", () => {
  it("should not render a retry button for a non-retryable error", () => {
    render(<ErrorPage {...mockError} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should call onRetry when the retry button is clicked for a retryable error", async () => {
    const user = userEvent.setup();

    render(<ErrorPage {...mockError} error={new ApiError(503)} />);

    await user.click(screen.getByRole("button"));

    expect(mockError.onRetry).toHaveBeenCalledTimes(1);
  });

  it("should render a link back to home", () => {
    render(<ErrorPage {...mockError} />);

    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveTextContent(/back to home/i);
  });
});
