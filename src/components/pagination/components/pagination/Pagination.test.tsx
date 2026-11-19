import { Pagination } from "./Pagination.tsx";
import { render, screen } from "../../../../testing/utils/test-utils.tsx";
import type { PaginationProps } from "../../types.ts";
import { PAGE_SIZE } from "../../../../features/products/constants.ts";
import userEvent from "@testing-library/user-event";
import { useSearchParams } from "react-router";

const mockProps: PaginationProps = {
  currentPage: 1,
  totalPages: 10,
  totalItems: 180,
};

function PaginationWithRouter() {
  const [params] = useSearchParams();
  const page = Number(params.get("page") ?? 1);

  return <Pagination {...mockProps} currentPage={page} />;
}

describe("Pagination", () => {
  it("should show the correct range on the first page", () => {
    render(<Pagination {...mockProps} />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(7);
  });

  it("should cap the end value at totalItems on a partially filled last page", () => {
    const totalItems = PAGE_SIZE * 2 + 5;
    const totalPages = 3;

    render(
      <Pagination
        currentPage={3}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    );

    expect(screen.getByText(/37.41 of 41/)).toBeInTheDocument();
  });

  it('should render a link with to="?page={n}" for each page number in the range', () => {
    render(<Pagination {...mockProps} />);

    const links = screen.getAllByRole("link");

    for (let i = 1; i <= 5; i++) {
      expect(links[i - 1].getAttribute("href")).toBe("/?page=" + i);
    }
  });

  it('should mark only the current page with aria-current="page"', () => {
    render(<Pagination {...mockProps} />);

    const links = screen.getAllByRole("link");

    expect(links[0]).toHaveAttribute("aria-current", "page");

    for (let i = 2; i <= links.length; i++) {
      expect(links[i - 1]).not.toHaveAttribute("aria-current");
    }
  });

  it("should render an ellipsis for each “ellipsis” item in the range", () => {
    render(<Pagination {...mockProps} />);

    const listItems = screen.getAllByRole("listitem");

    const ellipsisItem = listItems.find((item) =>
      item.querySelector(".lucide-ellipsis")
    );
    expect(ellipsisItem).toBeDefined();
  });

  it("should disable previous on the first page", () => {
    render(<Pagination {...mockProps} />);

    const listItems = screen.getAllByRole("listitem");
    const prevButton = listItems[0].querySelector("span");

    expect(prevButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should disable next on the last page", () => {
    render(<Pagination {...mockProps} currentPage={10} />);

    const listItems = screen.getAllByRole("listitem");
    const nextButton = listItems[listItems.length - 1].querySelector("span");

    expect(nextButton).toHaveAttribute("aria-disabled", "true");
  });

  it("should link to ?page={currentPage ± 1} when enabled", async () => {
    render(<PaginationWithRouter />);

    const nextButton = screen.getByRole("link", { name: /next/i });

    await userEvent.click(nextButton!);

    expect(screen.getByTestId("location")).toHaveTextContent("/?page=2");
    expect(nextButton).toHaveAttribute("href", "/?page=3");
  });

  it("should disable both controls when totalPages is 1", () => {
    render(<Pagination currentPage={1} totalItems={1} totalPages={1} />);

    const controls = screen.getAllByRole("listitem");

    expect(controls[0].querySelector("span")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(controls[2].querySelector("span")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("should handle totalItems of 0 without showing nonsensical values", () => {
    render(<Pagination currentPage={1} totalItems={0} totalPages={1} />);

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("should navigate to the clicked page when a page link is clicked", async () => {
    render(<PaginationWithRouter />);

    const pageButton = screen.getByRole("link", { name: /5/i });

    await userEvent.click(pageButton!);

    expect(screen.getByTestId("location")).toHaveTextContent("/?page=5");
  });

  it("should does not navigate when a disabled control is clicked", async () => {
    render(<PaginationWithRouter />);

    const controls = screen.getAllByRole("listitem");
    const prevButton = controls[0].querySelector("span");

    await userEvent.click(prevButton!);

    expect(screen.getByTestId("location")).toHaveTextContent("/?page=1");
  });
});
