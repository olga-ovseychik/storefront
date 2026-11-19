import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createProduct } from "../../../../testing/mocks/data/product.factory.ts";
import ProductCard from "./ProductCard.tsx";

describe("ProductCard component", () => {
  describe("without discount", () => {
    it("renders product details with regular price", () => {
      const mockItem = createProduct({ discountPercentage: undefined });
      const priceParts = mockItem.price.toString().split(".");

      render(<ProductCard item={mockItem} />);

      expect(screen.getByTestId("card-image")).toBeInTheDocument();
      expect(screen.getByTestId("product-brand")).toHaveTextContent(
        mockItem.brand
      );
      expect(screen.getByTestId("product-title")).toHaveTextContent(
        mockItem.title
      );
      expect(screen.getByTestId("product-rating")).toHaveTextContent(
        mockItem.rating.toString()
      );
      expect(screen.getByTestId("product-reviews-count")).toHaveTextContent(
        mockItem.reviews.length.toString()
      );
      expect(
        screen.getByTestId("product-price-integer-part")
      ).toHaveTextContent(priceParts[0]);
      expect(
        screen.getByTestId("product-price-decimal-part")
      ).toHaveTextContent(priceParts[1]);
    });
  });

  describe("with discount", () => {
    it("renders the discounted price instead of the original", () => {
      const mockItem = createProduct({ discountPercentage: 10, price: 100 });
      render(<ProductCard item={mockItem} />);

      expect(
        screen.getByTestId("product-price-integer-part")
      ).toHaveTextContent("90");
      expect(
        screen.getByTestId("product-price-decimal-part")
      ).toHaveTextContent("00");
      expect(screen.getByTestId("product-discount-amount")).toHaveTextContent(
        "10"
      );
    });

    it("renders the original price next to the discounted price", () => {
      const mockItem = createProduct({ discountPercentage: 10, price: 100 });
      render(<ProductCard item={mockItem} />);

      expect(screen.getByTestId("product-previous-price")).toHaveTextContent(
        /100/
      );
    });
  });

  it("should display Free Delivery if price is equal or more than 1000", () => {
    const mockItem = createProduct({ price: 1000 });
    render(<ProductCard item={mockItem} />);

    expect(screen.getByTestId("free-delivery-badge")).toHaveTextContent(
      /free delivery/i
    );
  });

  it("should display only N left if availability status is low", () => {
    const mockItem = createProduct({
      availabilityStatus: "Low Stock",
      stock: 5,
    });
    render(<ProductCard item={mockItem} />);

    expect(screen.getByTestId("product-stock-amount")).toHaveTextContent(
      `Only ${mockItem.stock} left`
    );
  });

  it("should display Best seller badge if rating of product is more than 4.5", () => {
    const mockItem = createProduct({ rating: 4.6 });
    render(<ProductCard item={mockItem} />);

    expect(screen.getByTestId("best-seller-badge")).toHaveTextContent(
      /best seller/i
    );
  });

  it("should display action buttons when onMouseEnter event occurs", async () => {
    const mockItem = createProduct({ rating: 4.6 });
    render(<ProductCard item={mockItem} />);

    fireEvent.mouseEnter(screen.getByTestId("product-card"));

    await waitFor(() => {
      expect(screen.getByTestId("add-to-wishlist-button")).toBeInTheDocument();
      expect(screen.getByTestId("add-to-cart-button")).toBeInTheDocument();
    });
  });

  it("should hide action buttons when onMouseLeave event occurs", async () => {
    const mockItem = createProduct({ rating: 4.6 });
    render(<ProductCard item={mockItem} />);

    fireEvent.mouseLeave(screen.getByTestId("product-card"));

    await waitFor(() => {
      expect(screen.queryByTestId("add-to-wishlist-button")).toBeNull();
      expect(screen.queryByTestId("add-to-cart-button")).toBeNull();
    });
  });
});
