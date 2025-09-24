import { describe, it, expect } from "vitest";
import {
  Cell,
  Board,
  Position,
  createEmptyBoard,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from "./board";

describe("Board Types", () => {
  it("should define board dimensions correctly", () => {
    expect(BOARD_WIDTH).toBe(10);
    expect(BOARD_HEIGHT).toBe(20);
  });

  it("should create an empty board with correct dimensions", () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(BOARD_HEIGHT);
    expect(board[0]).toHaveLength(BOARD_WIDTH);
  });

  it("should initialize all cells as empty", () => {
    const board = createEmptyBoard();
    board.forEach((row) => {
      row.forEach((cell) => {
        expect(cell.filled).toBe(false);
        expect(cell.color).toBe(null);
      });
    });
  });
});

describe("Cell Type", () => {
  it("should create an empty cell", () => {
    const cell: Cell = {
      filled: false,
      color: null,
    };
    expect(cell.filled).toBe(false);
    expect(cell.color).toBe(null);
  });

  it("should create a filled cell with color", () => {
    const cell: Cell = {
      filled: true,
      color: "#FF0000",
    };
    expect(cell.filled).toBe(true);
    expect(cell.color).toBe("#FF0000");
  });
});

describe("Position Type", () => {
  it("should create a position", () => {
    const pos: Position = {
      x: 5,
      y: 10,
    };
    expect(pos.x).toBe(5);
    expect(pos.y).toBe(10);
  });

  it("should handle board boundaries", () => {
    const topLeft: Position = { x: 0, y: 0 };
    const bottomRight: Position = { x: BOARD_WIDTH - 1, y: BOARD_HEIGHT - 1 };

    expect(topLeft.x).toBe(0);
    expect(topLeft.y).toBe(0);
    expect(bottomRight.x).toBe(9);
    expect(bottomRight.y).toBe(19);
  });
});
