import type { RangeItem } from "../types.ts";

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): Array<RangeItem> {
  const totalSlots = siblingCount * 2 + 5;

  if (totalPages <= totalSlots) return range(1, totalPages);

  const left = Math.max(1, currentPage - siblingCount);
  const right = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;
  const edgeCount = 3 + 2 * siblingCount;

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", ...range(totalPages - edgeCount + 1, totalPages)];
  }

  if (showRightEllipsis && !showLeftEllipsis) {
    return [...range(1, edgeCount), "ellipsis", totalPages];
  }

  return [1, "ellipsis", ...range(left, right), "ellipsis", totalPages];
}
