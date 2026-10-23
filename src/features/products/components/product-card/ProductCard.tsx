import classes from "./ProductCard.module.css";
import type { ProductItemProps } from "../../types.ts";
import {
  Star,
  StarHalf,
  ShoppingCartPlus,
  Heart,
  Package,
  Flame,
} from "lucide-react";
import { useState, type JSX } from "react";
import { roundToNearestHalfStar } from "../../../../utils/roundToNearestHalfStar.ts";
import { calculateDiscount } from "../../../../utils/calculateDiscount.ts";

function ProductCard({ item }: { item: ProductItemProps }) {
  const [showActions, setShowActions] = useState<boolean>(false);
  const priceParts = item.price.toString().split(".");
  const rating = roundToNearestHalfStar(item.rating);
  const { finalPrice, discountAmount } = calculateDiscount(
    item.price,
    item.discountPercentage
  ) ?? { finalPrice: priceParts, discountAmount: undefined };
  const maxStars = 5;

  const renderStars = () => {
    const stars: JSX.Element[] = [];

    for (let i = 1; i <= maxStars; i++) {
      if (rating > i) {
        stars.push(
          <Star
            color="var(--color-warning-500)"
            size={12}
            fill="var(--color-warning-500)"
            key={i}
          />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <StarHalf
            color="var(--color-warning-500)"
            size={12}
            fill="var(--color-warning-500)"
            key={i}
          />
        );
      } else {
        stars.push(<Star color="var(--color-warning-500)" size={12} key={i} />);
      }
    }

    return stars;
  };

  return (
    <div
      className={classes.wrapper}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)} data-testid="product-card">
      <div className={classes.header}>
        <img
          src={item.images[0]}
          className={classes.image}
          alt={item.title}
          data-testid="card-image"
        />
        {item.rating > 4.5 && (
          <div className={classes.bestSellerBadgeWrapper}>
            <span data-testid="best-seller-badge">Best seller</span>
          </div>
        )}
        {showActions && (
          <button
            className={classes.addToWishlistButton}
            title="Add to wishlist"
            aria-label="Add to wishlist"
            data-testid="add-to-wishlist-button">
            <Heart strokeWidth={1} />
          </button>
        )}
      </div>
      <div className={classes.cardInfoWrapper}>
        <a href="#" className={classes.link}>
          <h3 className={classes.brandWrapper}>
            <span data-testid="product-brand" className={classes.brandText}>
              {item.brand ?? ""}
            </span>
          </h3>
          <h2 className={classes.title}>
            <span data-testid="product-title">{" " + item.title}</span>
          </h2>
        </a>
        <div className={classes.ratingPartsWrapper}>
          <div>{renderStars()}</div>
          <span data-testid="product-rating" className={classes.rating}>
            {item.rating}
          </span>
          <span
            data-testid="product-reviews-count"
            className={classes.reviewsCount}>
            ({item.reviews.length})
          </span>
        </div>
        {item.availabilityStatus === "Low Stock" && (
          <div className={classes.stockWrapper}>
            <Flame
              strokeWidth={1}
              size={16}
              color="var(--color-danger-600)"
              fill="var(--color-danger-600)"
            />
            <span data-testid="product-stock-amount">
              Only {item.stock} left{" "}
            </span>
          </div>
        )}

        <div className={classes.bottomWrapper}>
          <div className={classes.offerWrapper}>
            <div className={classes.priceWrapper}>
              <div className={classes.origPriceWrapper}>
                <span
                  data-testid="product-price-integer-part"
                  className={`${classes.price} ${discountAmount ? classes.discountPrice : ""}`}>
                  {finalPrice[0]}
                </span>
                <div className={classes.decimalWrapper}>
                  <span
                    data-testid="product-price-decimal-part"
                    className={`${classes.decimalPart} ${discountAmount ? classes.discountPrice : ""}`}>
                    {finalPrice[1]}
                  </span>
                  <span
                    className={`${classes.currency} ${discountAmount ? classes.discountPrice : ""}`}>
                    €
                  </span>
                </div>
              </div>
              {discountAmount && (
                <div
                  data-testid="product-discount-amount"
                  className={classes.discount}>
                  -{discountAmount} €
                </div>
              )}
            </div>
            {discountAmount && (
              <div className={classes.previousPriceWrapper}>
                <span className={classes.previousPrice}>Lowest price: </span>
                <span
                  className={classes.previousPrice}
                  data-testid="product-previous-price">
                  {item.price.toFixed(2).replace(".", ",")} €
                </span>
              </div>
            )}
            {Number(finalPrice[0]) >= 1000 && (
              <div className={classes.deliveryWrapper}>
                <Package size={16} strokeWidth={1} />
                <span
                  data-testid="free-delivery-badge"
                  className={classes.deliveryText}>
                  Free delivery
                </span>
              </div>
            )}
          </div>

          {showActions && (
            <button
              aria-label="Add to cart"
              title="Add to cart"
              className={classes.addToBasketButton}
              data-testid="add-to-cart-button">
              <ShoppingCartPlus size="24px" strokeWidth={1} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
