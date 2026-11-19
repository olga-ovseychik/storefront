import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchProducts } from "./fetchProducts.ts";

export function useProductsQuery(page: number) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    placeholderData: keepPreviousData,
  });
}
