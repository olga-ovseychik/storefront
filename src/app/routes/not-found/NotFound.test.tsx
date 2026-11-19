import NotFound from "./NotFound.tsx";
import { render, screen } from "../../../testing/utils/test-utils.tsx";

describe("NotFound", () => {
  it("should render title and description", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      /not found/i
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      /we couldn't find/i
    );
  });
});
