import { PageControl } from "./PageControl.tsx";
import { render, screen } from "../../../../testing/utils/test-utils.tsx";
import type { PageControlProps } from "../../types.ts";

const mockProps: PageControlProps = {
  disabled: false,
  to: "/",
  children: <p>Next</p>,
  ariaLabel: "Next page",
};

describe("PageControl", () => {
  it("should render a navigable link when enabled", () => {
    render(<PageControl {...mockProps} />);

    const link = screen.getByRole("link", { name: "Next page" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("should render a non-interactive element when disabled", () => {
    render(<PageControl {...mockProps} disabled={true} />);

    const text = screen.getByText(/next/i);

    expect(text.closest("span")).toHaveAttribute("aria-disabled", "true");
  });
});
