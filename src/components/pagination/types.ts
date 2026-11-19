import type { ReactNode } from "react";

export type RangeItem = number | "ellipsis";

export type PageControlProps = {
  disabled: boolean;
  to: string;
  ariaLabel: string;
  children?: ReactNode;
};
