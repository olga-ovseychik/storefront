import { expect, test } from "vitest";
import App from "./App.tsx";
import { render, screen } from "@testing-library/react";

test("should render App", async () => {
  render(<App />);

  const list = await screen.findByTestId("product-list");
  expect(list).toBeInTheDocument();
});
