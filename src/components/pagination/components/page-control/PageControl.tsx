import { Link } from "react-router";
import type { PageControlProps } from "../../types.ts";
import classes from "./PageControl.module.css";

export function PageControl({
  disabled,
  to,
  children,
  ariaLabel,
}: PageControlProps) {
  return disabled ? (
    <span
      className={`${classes.control} ${classes.disabled}`}
      aria-disabled="true">
      {children}
    </span>
  ) : (
    <Link className={classes.control} to={to} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
