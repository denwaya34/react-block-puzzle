import { describe, it, expect } from "vitest";
import {
  GameStatus,
  GameState,
  GameMetrics,
  createInitialGameState,
  getDropInterval,
} from "./game";

describe("Game State", () => {
  it("should create initial game state", () => {
    const state = createInitialGameState();

    expect(state.board).toBeDefined();
    expect(state.currentTetrimino).toBe(null);
    expect(state.nextTetrimino).toBeDefined();
    expect(state.currentPosition).toEqual({ x: 3, y: 0 });
    expect(state.score).toBe(0);
    expect(state.level).toBe(1);
    expect(state.lines).toBe(0);
    expect(state.gameStatus).toBe("idle");
  });

  it("should have correct game status types", () => {
    const statuses: GameStatus[] = ["idle", "playing", "paused", "gameOver"];
    statuses.forEach((status) => {
      const state: GameState = {
        board: [],
        currentTetrimino: null,
        nextTetrimino: null,
        currentPosition: { x: 0, y: 0 },
        score: 0,
        level: 1,
        lines: 0,
        gameStatus: status,
      };
      expect(state.gameStatus).toBe(status);
    });
  });
});

describe("Game Metrics", () => {
  it("should track game metrics", () => {
    const metrics: GameMetrics = {
      score: 1000,
      level: 5,
      lines: 42,
      dropInterval: 500,
    };

    expect(metrics.score).toBe(1000);
    expect(metrics.level).toBe(5);
    expect(metrics.lines).toBe(42);
    expect(metrics.dropInterval).toBe(500);
  });

  it("should calculate drop interval based on level", () => {
    expect(getDropInterval(1)).toBe(1000);
    expect(getDropInterval(2)).toBe(900);
    expect(getDropInterval(5)).toBe(600);
    expect(getDropInterval(10)).toBe(100);
    expect(getDropInterval(15)).toBe(100); // Max speed
  });
});
