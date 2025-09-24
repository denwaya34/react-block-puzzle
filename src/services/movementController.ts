import type { Board, Position } from "@/types/board";
import type { Tetrimino, TetriminoType } from "@/types/tetrimino";
import { rotateTetrimino } from "@/types/tetrimino";
import { isValidPosition } from "./collisionDetector";

export type Direction = "left" | "right" | "down";

export interface MoveResult {
  success: boolean;
  position: Position;
}

export interface RotateResult {
  success: boolean;
  tetrimino: Tetrimino;
  position: Position;
}

/**
 * Wall kick offset data for standard tetriminos (not I or O)
 * Based on Super Rotation System (SRS)
 */
const STANDARD_WALL_KICKS = [
  { x: 0, y: 0 }, // No offset
  { x: -1, y: 0 }, // Left
  { x: 1, y: 0 }, // Right
  { x: 0, y: -1 }, // Up
  { x: -1, y: -1 }, // Up-Left
  { x: 1, y: -1 }, // Up-Right
];

/**
 * Wall kick offset data for I tetrimino
 */
const I_WALL_KICKS = [
  { x: 0, y: 0 }, // No offset
  { x: -2, y: 0 }, // Left 2
  { x: 1, y: 0 }, // Right
  { x: -2, y: 1 }, // Left 2, Down
  { x: 1, y: -2 }, // Right, Up 2
];

/**
 * Try to move a tetrimino in a direction
 */
export function tryMove(
  board: Board,
  tetrimino: Tetrimino,
  currentPosition: Position,
  direction: Direction,
): MoveResult {
  const newPosition = { ...currentPosition };

  switch (direction) {
    case "left":
      newPosition.x--;
      break;
    case "right":
      newPosition.x++;
      break;
    case "down":
      newPosition.y++;
      break;
  }

  if (isValidPosition(board, tetrimino, newPosition)) {
    return {
      success: true,
      position: newPosition,
    };
  }

  return {
    success: false,
    position: currentPosition,
  };
}

/**
 * Perform wall kick to find a valid position for a rotated tetrimino
 */
export function performWallKick(
  board: Board,
  rotatedTetrimino: Tetrimino,
  position: Position,
  tetriminoType: TetriminoType,
): Position | null {
  // O tetrimino doesn't need wall kicks
  if (tetriminoType === "O") {
    return position;
  }

  // Choose appropriate kick data
  const kicks = tetriminoType === "I" ? I_WALL_KICKS : STANDARD_WALL_KICKS;

  // Try each kick offset
  for (const kick of kicks) {
    const testPosition = {
      x: position.x + kick.x,
      y: position.y + kick.y,
    };

    if (isValidPosition(board, rotatedTetrimino, testPosition)) {
      return testPosition;
    }
  }

  return null;
}

/**
 * Try to rotate a tetrimino with wall kick support
 */
export function tryRotateWithKick(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): RotateResult {
  // Special case for O tetrimino - it doesn't change when rotated
  if (tetrimino.type === "O") {
    return {
      success: true,
      tetrimino,
      position,
    };
  }

  const rotatedTetrimino = rotateTetrimino(tetrimino);

  // First try direct rotation
  if (isValidPosition(board, rotatedTetrimino, position)) {
    return {
      success: true,
      tetrimino: rotatedTetrimino,
      position,
    };
  }

  // Try wall kicks
  const kickedPosition = performWallKick(
    board,
    rotatedTetrimino,
    position,
    tetrimino.type,
  );

  if (kickedPosition) {
    return {
      success: true,
      tetrimino: rotatedTetrimino,
      position: kickedPosition,
    };
  }

  // Rotation failed
  return {
    success: false,
    tetrimino,
    position,
  };
}
