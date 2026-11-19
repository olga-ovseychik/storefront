import { useProductsQuery } from "./useProductsQuery.ts";
import { fetchProducts } from "./fetchProducts.ts";
import { createProduct } from "../../../testing/mocks/data/product.factory.ts";
import type { ProductsResponse } from "../types.ts";
import { PAGE_SIZE } from "../constants.ts";
import { renderHook, waitFor } from "@testing-library/react";
import { createWrapper } from "../../../testing/utils/test-utils.tsx";

vi.mock("./fetchProducts.ts");

describe("useProductsQuery", () => {
  const mockResponse: ProductsResponse = {
    products: [createProduct()],
    total: 100,
    skip: 0,
    limit: PAGE_SIZE,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call fetchProducts with the provided page and return its data", async () => {
    vi.mocked(fetchProducts).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useProductsQuery(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBe(mockResponse);
    expect(fetchProducts).toHaveBeenCalledTimes(1);
    expect(fetchProducts).toHaveBeenCalledWith(1);
  });

  it("should keep previous page data while the next page is loading", async () => {
    vi.mocked(fetchProducts)
      .mockResolvedValueOnce(mockResponse)
      .mockReturnValueOnce(new Promise(() => {}));

    const { result, rerender } = renderHook(
      ({ page }) => useProductsQuery(page),
      { wrapper: createWrapper(), initialProps: { page: 1 } }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    rerender({ page: 2 });

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(true));

    expect(result.current.data).toBe(mockResponse);
  });
  it("should fetch the new page and replace previous data once loaded", async () => {
    const page1 = { ...mockResponse, products: [createProduct({ id: 1 })] };
    const page2 = { ...mockResponse, products: [createProduct({ id: 2 })] };

    vi.mocked(fetchProducts)
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result, rerender } = renderHook(
      ({ page }) => useProductsQuery(page),
      { wrapper: createWrapper(), initialProps: { page: 1 } }
    );

    await waitFor(() => expect(result.current.data).toBe(page1));

    rerender({ page: 2 });

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));
    await waitFor(() => expect(result.current.data).toBe(page2));
    expect(fetchProducts).toHaveBeenCalledTimes(2);
    expect(fetchProducts).toHaveBeenLastCalledWith(2);
  });
});
