import { http, HttpResponse } from "msw/http";
import { BASE_URL } from "../../features/products/constants.ts";
import { createProduct } from "./data/product.factory.ts";
import { PAGE_SIZE } from "../../features/products/constants.ts";

const TOTAL = 180;
const products = Array.from({ length: 10 }, (_, i) =>
  createProduct({ id: i + 1 })
);

export const handlers = [
  http.get(`${BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") ?? PAGE_SIZE);
    const skip = Number(url.searchParams.get("skip") ?? 0);

    return HttpResponse.json({
      products,
      total: TOTAL,
      skip,
      limit,
    });
  }),
];
