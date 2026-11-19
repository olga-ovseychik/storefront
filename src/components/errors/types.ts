export type ErrorPageProps = Omit<ErrorBlockProps, "isRetrying">;

export type ErrorBlockProps = {
  error: unknown;
  isRetrying?: boolean;
  onRetry?: () => void;
};
