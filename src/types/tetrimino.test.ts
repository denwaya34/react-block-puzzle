import { describe, it, expect } from "vitest";
import {
  type TetriminoType,
  type Tetrimino,
  TETRIMINOS,
  rotateTetrimino,
} from "./tetrimino";

describe("Tetrimino Types", () => {
  it("should have all 7 standard tetrimino types", () => {
    const expectedTypes: TetriminoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
    expectedTypes.forEach((type) => {
      expect(TETRIMINOS[type]).toBeDefined();
    });
  });

  it("should have correct shapes for each tetrimino", () => {
    // I piece - horizontal line
    expect(TETRIMINOS.I.shape).toEqual([
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    // O piece - square
    expect(TETRIMINOS.O.shape).toEqual([
      [1, 1],
      [1, 1],
    ]);

    // T piece
    expect(TETRIMINOS.T.shape).toEqual([
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ]);
  });

  it("should have unique colors for each tetrimino", () => {
    const colors = Object.values(TETRIMINOS).map((t) => t.color);
    const uniqueColors = new Set(colors);
    expect(uniqueColors.size).toBe(colors.length);
  });
});

describe("Tetrimino Rotation", () => {
  it("should rotate tetrimino shape 90 degrees clockwise", () => {
    const tPiece: Tetrimino = {
      type: "T",
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      color: "#FF00FF",
      rotation: 0,
    };

    const rotated = rotateTetrimino(tPiece);
    expect(rotated.shape).toEqual([
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ]);
    expect(rotated.rotation).toBe(1);
  });

  it("should handle 4 rotations returning to original", () => {
    const original = TETRIMINOS.T;
    let rotated = original;

    for (let i = 0; i < 4; i++) {
      rotated = rotateTetrimino(rotated);
    }

    expect(rotated.shape).toEqual(original.shape);
    expect(rotated.rotation).toBe(0);
  });
});
