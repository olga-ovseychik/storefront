import { expect, test } from "vitest";
import App from "./App.tsx";
import { render, screen } from "@testing-library/react";

test("should render 'Hi!👋'", () => {
  render(<App />);
  expect(screen.getByText("Hi!👋"));
});
