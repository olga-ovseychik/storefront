import ProductCard from "../product-card/ProductCard.tsx";
import { useProductsQuery } from "../../api/useProductsQuery.ts";
import type { Product } from "../../types.ts";
import classes from "./ProductList.module.css";

function ProductList() {
  const { data, isPending, isError, error } = useProductsQuery();

  if (isPending) {
    return <p>Pending</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const productList = data.products.map((product: Product) => {
    return <ProductCard item={product} key={product.id} />;
  });

  return (
    <div className={classes.wrapper} data-testid="product-list">
      {productList}
    </div>
  );
}

export default ProductList;
