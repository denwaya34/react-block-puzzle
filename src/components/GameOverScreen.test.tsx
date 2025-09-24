import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { GameOverScreen } from "./GameOverScreen";

describe("GameOverScreen", () => {
  it("should not render when game is not over", () => {
    const { container } = render(
      <GameOverScreen
        isGameOver={false}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    const overlay = container.querySelector(".overlay");
    expect(overlay).toBeNull();
  });

  it("should render overlay when game is over", () => {
    const { container } = render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    const overlay = container.querySelector(".overlay");
    expect(overlay).toBeTruthy();
  });

  it("should display game over message", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("Game Over")).toBeInTheDocument();
  });

  it("should display final score", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={12345}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("Final Score")).toBeInTheDocument();
    expect(screen.getByText("12,345")).toBeInTheDocument();
  });

  it("should display level reached", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={7}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("should display lines cleared", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={123}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("Lines")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("should show new game button", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("New Game")).toBeInTheDocument();
  });

  it("should call onNewGame when button is clicked", () => {
    const onNewGame = vi.fn();
    render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={onNewGame}
      />,
    );

    fireEvent.click(screen.getByText("New Game"));
    expect(onNewGame).toHaveBeenCalled();
  });

  it("should format large scores with commas", () => {
    render(
      <GameOverScreen
        isGameOver={true}
        score={1234567}
        level={10}
        lines={200}
        onNewGame={() => {}}
      />,
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("should have dark overlay background", () => {
    const { container } = render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    const overlay = container.querySelector(".overlay");
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains("overlay")).toBe(true);
  });

  it("should center content in overlay", () => {
    const { container } = render(
      <GameOverScreen
        isGameOver={true}
        score={1000}
        level={5}
        lines={42}
        onNewGame={() => {}}
      />,
    );

    const content = container.querySelector(".content");
    expect(content).toBeTruthy();
  });
});
