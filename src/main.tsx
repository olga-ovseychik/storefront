import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import { ApiError } from "./lib/api-error.ts";
import { ErrorPage } from "./components/errors/error-page/ErrorPage.tsx";
import NotFound from "./app/routes/not-found/NotFound.tsx";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "always",
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 404 &&
          error.status < 500
        )
          return false;
        return failureCount < 2;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <ErrorPage error={error} onRetry={resetErrorBoundary} />
              )}>
              <Routes>
                <Route path="/products" element={<App />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
