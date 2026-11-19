import ProductCard from "../product-card/ProductCard.tsx";
import { useProductsQuery } from "../../api/useProductsQuery.ts";
import { useSearchParams } from "react-router";
import type { Product } from "../../types.ts";
import classes from "./ProductList.module.css";
import { Pagination } from "../../../../components/pagination/components/pagination/Pagination.tsx";
import { useEffect } from "react";
import { PAGE_SIZE } from "../../constants.ts";

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = Number(searchParams.get("page"));
  const page = Number.isInteger(raw) && raw >= 1 ? raw : 1;
  const {
    data,
    isPending,
    isError,
    error,
    isPlaceholderData,
    refetch,
    isFetching,
  } = useProductsQuery(page);
  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;
  const totalItems = data ? data.total : 0;

  useEffect(() => {
    if (!data) return;

    const safePage = totalPages > 0 ? Math.min(page, totalPages) : page;

    if (String(safePage) !== searchParams.get("page")) {
      setSearchParams(
        (prev) => {
          prev.set("page", String(safePage));
          return prev;
        },
        { replace: true }
      );
    }
  }, [data, page, totalPages, searchParams, setSearchParams]);

  useEffect(() => {
    if (!isPlaceholderData) {
      window.scrollTo(0, 0);
    }
  }, [page, isPlaceholderData]);

  if (isPending) {
    return (
      <div className={classes.wrapper} aria-busy="true">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <div key={i} className={classes.skeletonCard} />
        ))}
      </div>
    );
  }

  if (data && data.total === 0) {
    return <p>No products found</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const productList = data.products.map((product: Product) => {
    return <ProductCard item={product} key={product.id} />;
  });

  return (
    <>
      <div className={classes.wrapper} data-testid="product-list">
        {productList}
      </div>
      {isPlaceholderData && (
        <div
          className={classes.spinnerOverlay}
          role="status"
          aria-label="Loading">
          <div className={classes.spinner}></div>
        </div>
      )}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
      />
    </>
  );
}

export default ProductList;
