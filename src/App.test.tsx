import { expect, test } from "vitest";
import App from "./App.tsx";
import { render, screen } from "@testing-library/react";

test("should render 'Hello!👋'", () => {
  render(<App />);
  expect(screen.getByText("Hello!👋"));
});
