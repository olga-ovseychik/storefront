import type { ErrorInfo } from "./types.ts";

export const ERROR_INFO = {
  noConnection: {
    title: "No connection",
    description: "Check your internet connection and try again.",
    retryable: true,
  },
  notFound: {
    title: "Not found",
    description:
      "We couldn't find what you're looking for. It may have been moved or removed.",
    retryable: false,
  },
  unauthorized: {
    title: "Sign in required",
    description: "Please sign in to your account to continue.",
    retryable: false,
  },
  forbidden: {
    title: "Access denied",
    description: "You don’t have permission to view this content.",
    retryable: false,
  },
  tooManyRequests: {
    title: "Too many requests",
    description: "Please wait a minute and try again.",
    retryable: true,
  },
  server: {
    title: "We're having technical issues",
    description: "We're working on it. Please try again in a few minutes.",
    retryable: true,
  },
  unknown: {
    title: "Something went wrong",
    description: "Please try refreshing the page.",
    retryable: true,
  },
} satisfies Record<string, ErrorInfo>;
