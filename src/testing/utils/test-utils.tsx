/* eslint-disable react-refresh/only-export-components */

import { MemoryRouter, useLocation } from "react-router";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function LocationDisplay() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function createProviders(route: string = "/?page=1") {
  const QueryClientWrapper = createWrapper();

  return ({ children }: { children: ReactNode }) => (
    <QueryClientWrapper>
      <MemoryRouter initialEntries={[route]}>
        {children}
        <LocationDisplay />
      </MemoryRouter>
    </QueryClientWrapper>
  );
}

const customRender = (
  ui: ReactNode,
  {
    route,
    ...options
  }: Omit<RenderOptions, "wrapper"> & { route?: string } = {}
) => render(ui, { wrapper: createProviders(route), ...options });

export * from "@testing-library/react";
export { customRender as render, createWrapper };
