export function roundToNearestHalfStar(rating: number) {
  return Math.round(rating * 2) / 2;
}
