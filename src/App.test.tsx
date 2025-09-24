import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the game component", () => {
    render(<App />);
    // Check for game elements
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("Lines")).toBeInTheDocument();
  });

  it("renders the control panel", () => {
    render(<App />);
    expect(
      screen.getByRole("button", { name: "Start Game" }),
    ).toBeInTheDocument();
  });
});
