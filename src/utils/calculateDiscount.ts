export function calculateDiscount(
  originalPrice: number,
  discountPercentage: number
): { finalPrice: string[]; discountAmount: string | undefined } | null {
  if (discountPercentage <= 1) {
    return null;
  }

  const finalPrice = originalPrice * (1 - discountPercentage / 100);
  const discountAmount = parseFloat(
    (originalPrice * (discountPercentage / 100)).toFixed(2)
  )
    .toString()
    .replace(".", ",");

  return {
    finalPrice: finalPrice.toFixed(2).toString().split("."),
    discountAmount,
  };
}
