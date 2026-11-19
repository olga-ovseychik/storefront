import { fetchProducts } from "./fetchProducts.ts";
import type { ProductsResponse } from "../types.ts";
import { createProduct } from "../../../testing/mocks/data/product.factory.ts";
import { BASE_URL, PAGE_SIZE } from "../constants.ts";
import { ApiError } from "../../../lib/api-error.ts";

const { mockApi } = vi.hoisted(() => ({
  mockApi: vi.fn(),
}));

vi.mock(import("../../../lib/api-client.ts"), () => {
  return { api: mockApi };
});

describe(fetchProducts.name, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should build the correct URL for the first page", async () => {
    const mockResponse: ProductsResponse = {
      products: [createProduct()],
      total: 100,
      skip: 0,
      limit: PAGE_SIZE,
    };

    mockApi.mockResolvedValue(mockResponse);

    await fetchProducts(1);

    expect(mockApi).toHaveBeenCalledWith(
      `${BASE_URL}/products?limit=${PAGE_SIZE}&skip=${0}`
    );
  });

  it("should build the correct URL for the second page", async () => {
    const mockResponse: ProductsResponse = {
      products: [createProduct()],
      total: 100,
      skip: PAGE_SIZE,
      limit: PAGE_SIZE,
    };

    mockApi.mockResolvedValue(mockResponse);

    await fetchProducts(2);

    expect(mockApi).toHaveBeenCalledWith(
      `${BASE_URL}/products?limit=${PAGE_SIZE}&skip=${PAGE_SIZE}`
    );
  });
  it("should return the products response", async () => {
    const mockResponse: ProductsResponse = {
      products: [createProduct()],
      total: 100,
      skip: 0,
      limit: PAGE_SIZE,
    };

    mockApi.mockResolvedValue(mockResponse);

    const result = await fetchProducts(1);

    expect(result).toEqual(mockResponse);
  });
  it("should throw an error when the API request fails", async () => {
    const error = new ApiError(404);

    mockApi.mockRejectedValue(error);

    await expect(fetchProducts(1)).rejects.toThrow(error);
  });
});
