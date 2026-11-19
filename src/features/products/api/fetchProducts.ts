import { BASE_URL, PAGE_SIZE } from "../constants.ts";
import { api } from "../../../lib/api-client.ts";
import type { ProductsResponse } from "../types.ts";

export async function fetchProducts(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  return api<ProductsResponse>(
    `${BASE_URL}/products?limit=${PAGE_SIZE}&skip=${skip}`
  );
}
