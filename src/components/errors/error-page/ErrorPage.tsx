import { Link } from "react-router";
import { type ErrorPageProps } from "../types.ts";
import { ErrorBlock } from "../error-block/ErrorBlock.tsx";

export function ErrorPage({ error, onRetry }: ErrorPageProps) {
  return (
    <main>
      <ErrorBlock error={error} onRetry={onRetry} />
      <Link to="/">Back to home</Link>
    </main>
  );
}
