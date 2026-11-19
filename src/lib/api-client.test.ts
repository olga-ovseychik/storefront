import { api } from "./api-client.ts";
import type { ProductsResponse } from "../features/products/types.ts";
import { server } from "../testing/mocks/node.ts";
import { BASE_URL } from "../features/products/constants.ts";
import { http, HttpResponse } from "msw/http";
import { ApiError } from "./api-error.ts";

describe("api-client", () => {
  it("returns parsed JSON when the response is ok", async () => {
    const res = await api<ProductsResponse>(`${BASE_URL}/products`);

    expect(res.products.length).toEqual(10);
  });

  it("throws ApiError with status 0 and code NETWORK when fetch rejects", async () => {
    server.use(http.get(`${BASE_URL}/products`, () => HttpResponse.error()));

    await expect(api(`${BASE_URL}/products`)).rejects.toMatchObject({
      status: 0,
      code: "NETWORK",
    });
  });
  it("throws ApiError with status, code and message from the JSON error body", async () => {
    const message =
      "We couldn't find what you're looking for. It may have been moved or removed.";

    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({ message }, { status: 404 })
      )
    );

    const error = await api(`${BASE_URL}/products`).catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message });
  });
  it("throws ApiError with the response status when the error body is not valid JSON", async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.text("<html>Bad gateway</html>", { status: 502 })
      )
    );

    await expect(api(`${BASE_URL}/products`)).rejects.toMatchObject({
      status: 502,
    });
  });

  it.each([401, 403, 404, 429, 500])(
    "throws ApiError with status %i and the message from the body",
    async (status) => {
      const message = `Failed with ${status}`;

      server.use(
        http.get(`${BASE_URL}/products`, () =>
          HttpResponse.json({ message }, { status })
        )
      );

      await expect(api(`${BASE_URL}/products`)).rejects.toMatchObject({
        status,
        message,
      });
    }
  );
});
