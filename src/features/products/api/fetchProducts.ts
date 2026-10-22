import { BASE_URL } from "../constants.ts";

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}
