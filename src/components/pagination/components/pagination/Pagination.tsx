import { getPaginationRange } from "../../utils/getPaginationRange.ts";
import { Link } from "react-router";
import { Ellipsis, ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "../../types.ts";
import classes from "./Pagination.module.css";
import { PAGE_SIZE } from "../../../../features/products/constants.ts";
import { PageControl } from "../page-control/PageControl.tsx";

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
}: PaginationProps) {
  const range = getPaginationRange(currentPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalItems);

  const prevIsDisabled = currentPage === 1;
  const nextIsDisabled = currentPage === totalPages;

  if (totalItems === 0) return null;

  return (
    <nav aria-label="Pagination" className={classes.paginationWrapper}>
      <span className={classes.summary}>
        {start}–{end} of {totalItems}
      </span>

      <ul className={classes.pagination}>
        <li>
          <PageControl
            disabled={prevIsDisabled}
            to={`?page=${currentPage - 1}`}
            ariaLabel={"Previous page"}>
            <ChevronLeft
              color="var(--color-neutral-600)"
              strokeWidth={1}
              size={20}
            />
          </PageControl>
        </li>

        {range.map((item, i) => {
          if (item === "ellipsis") {
            return (
              <li key={`ellipsis-${i}`} className={classes.ellipsis}>
                <Ellipsis size={20} color={"var(--color-neutral-600)"} />
              </li>
            );
          } else {
            return (
              <li key={item}>
                <Link
                  className={classes.pageItem}
                  to={`?page=${item}`}
                  aria-current={item === currentPage ? "page" : undefined}>
                  {item}
                </Link>
              </li>
            );
          }
        })}

        <li>
          <PageControl
            disabled={nextIsDisabled}
            to={`?page=${currentPage + 1}`}
            ariaLabel={"Next page"}>
            <span className={classes.controlLabel}>Next</span>
            <ChevronRight
              color="var(--color-neutral-600)"
              strokeWidth={1}
              size={20}
            />
          </PageControl>
        </li>
      </ul>
    </nav>
  );
}
