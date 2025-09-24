import type { Board, Position } from "@/types/board";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/types/board";
import type { Tetrimino } from "@/types/tetrimino";
import { rotateTetrimino } from "@/types/tetrimino";

/**
 * Check if a tetrimino position is valid (no collision and within bounds)
 */
export function isValidPosition(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): boolean {
  const shape = tetrimino.shape;
  const n = shape.length;

  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      // Skip empty cells in the tetrimino shape
      if (!shape[row][col]) continue;

      const newX = position.x + col;
      const newY = position.y + row;

      // Check boundaries
      if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
        return false;
      }

      // Allow positions above the board (for spawning)
      if (newY < 0) continue;

      // Check collision with existing blocks
      if (board[newY][newX].filled) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Check if a tetrimino can move to a specific position
 */
export function canMoveTo(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): boolean {
  return isValidPosition(board, tetrimino, position);
}

/**
 * Check if a tetrimino can rotate at its current position
 */
export function canRotate(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): boolean {
  const rotatedTetrimino = rotateTetrimino(tetrimino);
  return isValidPosition(board, rotatedTetrimino, position);
}

/**
 * Check if moving to a position would cause a collision
 */
export function willCollide(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): boolean {
  return !isValidPosition(board, tetrimino, position);
}

/**
 * Check if the game is over (tetrimino cannot be placed at spawn position)
 */
export function isGameOver(board: Board, tetrimino: Tetrimino): boolean {
  const spawnPosition: Position = { x: 3, y: 0 };
  return !isValidPosition(board, tetrimino, spawnPosition);
}
