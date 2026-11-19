import { render, screen } from "../../../../testing/utils/test-utils.tsx";
import ProductList from "./ProductList.tsx";
import { BASE_URL, PAGE_SIZE } from "../../constants.ts";
import { waitFor } from "@testing-library/react";
import { createProduct } from "../../../../testing/mocks/data/product.factory.ts";
import { server } from "../../../../testing/mocks/node.ts";
import { http, HttpResponse } from "msw/http";
import userEvent from "@testing-library/user-event";
import { delay } from "msw";

describe("ProductList", () => {
  const user = userEvent.setup();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("loading state", () => {
    it("should show skeleton cards while loading", () => {
      const { container } = render(<ProductList />);

      expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
      expect(
        container.querySelector('[aria-busy="true"]')?.children
      ).toHaveLength(PAGE_SIZE);
    });
    it("should not render products or pagination during initial load", () => {
      render(<ProductList />);

      expect(screen.queryByTestId("product-list")).not.toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    });
  });

  describe("success state", () => {
    it("should render a ProductCard for each product", async () => {
      render(<ProductList />);

      await waitFor(() => {
        expect(screen.getAllByTestId("product-card")).toHaveLength(10);
      });
    });
    it("should pass correct props to ProductCard", async () => {
      const products = [createProduct(), createProduct(), createProduct()];

      server.use(
        http.get("*/products", () =>
          HttpResponse.json({
            products,
            total: 180,
            skip: 0,
            limit: PAGE_SIZE,
          })
        )
      );

      render(<ProductList />);

      for (const product of products) {
        expect(await screen.findByText(product.title)).toBeInTheDocument();
      }
    });

    it("should render Pagination with correct props", async () => {
      render(<ProductList />);

      await waitFor(() => {
        expect(screen.getByRole("navigation")).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(9);
      });
    });
  });

  describe("empty state", () => {
    it("should show 'No products found' when total is 0", async () => {
      server.use(
        http.get("*/products", () =>
          HttpResponse.json({
            products: [],
            total: 0,
            skip: 0,
            limit: PAGE_SIZE,
          })
        )
      );

      render(<ProductList />);

      await waitFor(() => {
        expect(screen.getByText("No products found")).toBeInTheDocument();
      });
    });
  });

  describe("error state", () => {
    it("should show ErrorBlock when the query fails", async () => {
      const message = "You don’t have permission to view this content.";

      server.use(
        http.get(`${BASE_URL}/products`, () =>
          HttpResponse.json({ message }, { status: 403 })
        )
      );

      render(<ProductList />);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });
    it("should call refetch when retry is clicked", async () => {
      const products = [createProduct(), createProduct(), createProduct()];
      let requestCount = 0;
      const message = "Please try refreshing the page.";

      server.use(
        http.get(`${BASE_URL}/products`, () => {
          requestCount++;

          if (requestCount === 1) {
            return HttpResponse.json({ message }, { status: 500 });
          }

          return HttpResponse.json({
            products,
            total: 180,
            skip: 0,
            limit: PAGE_SIZE,
          });
        })
      );

      render(<ProductList />);

      await user.click(
        await screen.findByRole("button", { name: /try again/i })
      );

      expect(await screen.findByTestId("product-list")).toBeInTheDocument();
      expect(requestCount).toBe(2);
    });
  });

  describe("page param", () => {
    it("should default to page 1 when page param is missing", async () => {
      render(<ProductList />, { route: "/" });

      await waitFor(() => {
        expect(screen.getByTestId("location")).toHaveTextContent("/?page=1");
      });
    });
    it("should default to page 1 for invalid page values", async () => {
      render(<ProductList />, { route: "/?page=abcd" });

      await waitFor(() => {
        expect(screen.getByTestId("location")).toHaveTextContent("/?page=1");
      });
    });
    it("should use valid page from URL", async () => {
      let requestUrl: URL | undefined;

      server.use(
        http.get(`${BASE_URL}/products`, ({ request }) => {
          requestUrl = new URL(request.url);
          return HttpResponse.json({
            products: [createProduct()],
            total: 180,
            skip: 36,
            limit: 18,
          });
        })
      );

      render(<ProductList />, { route: "/?page=3" });

      await screen.findByTestId("product-list");

      expect(requestUrl?.searchParams.get("skip")).toBe("36");
      expect(screen.getByTestId("location")).toHaveTextContent("/?page=3");
    });
  });

  describe("page correction", () => {
    it("should clamp page that exceeds totalPages", async () => {
      render(<ProductList />, { route: "/?page=999" });

      await waitFor(() =>
        expect(screen.getByTestId("location").textContent).toBe("/?page=10")
      );
    });

    it.each(["abc", "1.5", "-3"])(
      "should default to page 1 for invalid page value %s",
      async (value) => {
        render(<ProductList />, { route: `/?page=${value}` });

        await waitFor(() =>
          expect(screen.getByTestId("location").textContent).toBe("/?page=1")
        );
      }
    );

    it("should preserve other search params when correcting the page", async () => {
      render(<ProductList />, { route: "/?sort=price&page=abc" });

      await waitFor(() => {
        expect(screen.getByTestId("location").textContent).toBe(
          "/?sort=price&page=1"
        );
      });
    });
  });

  describe("placeholder data and page change", () => {
    it("should show spinner overlay while placeholder data is displayed", async () => {
      server.use(
        http.get(`${BASE_URL}/products`, async ({ request }) => {
          const skip = Number(new URL(request.url).searchParams.get("skip"));

          if (skip === 0) {
            return HttpResponse.json({
              products: [createProduct()],
              total: 180,
              skip: 0,
              limit: 18,
            });
          }

          await delay("infinite");
        })
      );

      render(<ProductList />);

      await screen.findByTestId("product-list");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();

      await user.click(screen.getByRole("link", { name: /next/i }));

      expect(
        await screen.findByRole("status", { name: /loading/i })
      ).toBeInTheDocument();
      expect(screen.getByTestId("product-list")).toBeInTheDocument();
    });
    it("should scroll to top on page change", async () => {
      const scrollTo = vi
        .spyOn(window, "scrollTo")
        .mockImplementation(() => {});

      server.use(
        http.get(`${BASE_URL}/products`, async ({ request }) => {
          const skip = Number(new URL(request.url).searchParams.get("skip"));

          if (skip > 0) await delay(100);

          return HttpResponse.json({
            products: [createProduct()],
            total: 180,
            skip,
            limit: 18,
          });
        })
      );

      render(<ProductList />);

      await screen.findByTestId("product-list");
      await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 0));

      scrollTo.mockClear();

      await user.click(screen.getByRole("link", { name: /next/i }));

      await waitFor(() => expect(scrollTo).toHaveBeenCalledWith(0, 0));
      expect(scrollTo).toHaveBeenCalledTimes(1);
    });
  });
});
