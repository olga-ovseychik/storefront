import { describe, expect } from "vitest";
import { getPaginationRange } from "./getPaginationRange.ts";

describe("getPaginationRange", () => {
  it("should return an empty array when totalPages is 0", () => {
    const result = getPaginationRange(0, 0);

    expect(result).toEqual([]);
  });

  it("should return all page numbers when totalPages is within the visible limit", () => {
    const result = getPaginationRange(3, 5);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should display the correct range when the current page is near the beginning", () => {
    const result = getPaginationRange(2, 10);

    expect(result).toEqual([1, 2, 3, 4, 5, "ellipsis", 10]);
  });

  it("should display the correct range when the current page is near the end", () => {
    const result = getPaginationRange(8, 10);

    expect(result).toEqual([1, "ellipsis", 6, 7, 8, 9, 10]);
  });

  it("should display left and right ellipsis when the current page is in the middle", () => {
    const result = getPaginationRange(5, 10);

    expect(result).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("should clamp currentPage to 1 when it is less than 1", () => {
    const result = getPaginationRange(-2, 5);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should clamp currentPage to totalPages when it exceeds the total", () => {
    const result = getPaginationRange(9, 5);

    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("should display the correct number of pages before and after the current page based on siblingCount", () => {
    const result = getPaginationRange(10, 20, 2);

    expect(result).toEqual([1, "ellipsis", 8, 9, 10, 11, 12, "ellipsis", 20]);
  });
});
