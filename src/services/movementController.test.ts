import { describe, it, expect } from 'vitest';
import {
  performWallKick,
  tryMove,
  tryRotateWithKick,
} from './movementController';
import { createEmptyBoard, BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';
import { type Tetrimino, TETRIMINOS } from '@/types/tetrimino';

describe('MovementController', () => {
  describe('tryMove', () => {
    it('should allow valid left movement', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const currentPosition = { x: 5, y: 10 };

      const result = tryMove(board, tetrimino, currentPosition, 'left');

      expect(result.success).toBe(true);
      expect(result.position.x).toBe(4);
      expect(result.position.y).toBe(10);
    });

    it('should allow valid right movement', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const currentPosition = { x: 5, y: 10 };

      const result = tryMove(board, tetrimino, currentPosition, 'right');

      expect(result.success).toBe(true);
      expect(result.position.x).toBe(6);
      expect(result.position.y).toBe(10);
    });

    it('should allow valid down movement', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const currentPosition = { x: 5, y: 10 };

      const result = tryMove(board, tetrimino, currentPosition, 'down');

      expect(result.success).toBe(true);
      expect(result.position.x).toBe(5);
      expect(result.position.y).toBe(11);
    });

    it('should prevent movement into walls', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.I;
      const currentPosition = { x: 0, y: 10 };

      const result = tryMove(board, tetrimino, currentPosition, 'left');

      expect(result.success).toBe(false);
      expect(result.position).toEqual(currentPosition);
    });

    it('should prevent movement into existing blocks', () => {
      const board = createEmptyBoard();
      board[10][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.O;
      const currentPosition = { x: 4, y: 9 };

      const result = tryMove(board, tetrimino, currentPosition, 'down');

      expect(result.success).toBe(false);
      expect(result.position).toEqual(currentPosition);
    });
  });

  describe('performWallKick', () => {
    it('should find valid position using wall kick offsets', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const rotatedTetrimino: Tetrimino = {
        ...tetrimino,
        shape: [
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 0],
        ],
      };
      const position = { x: 8, y: 10 }; // Near right wall

      const kickedPosition = performWallKick(
        board,
        rotatedTetrimino,
        position,
        'T',
      );

      expect(kickedPosition).not.toBeNull();
      expect(kickedPosition!.x).toBeLessThanOrEqual(position.x); // Should kick left or stay
    });

    it('should return null if no valid kick position found', () => {
      const board = createEmptyBoard();
      // Fill the board to make kicks impossible
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          if (x !== 5 || y !== 5) {
            board[y][x] = { filled: true, color: '#FF0000' };
          }
        }
      }

      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 5 };

      const kickedPosition = performWallKick(board, tetrimino, position, 'T');

      expect(kickedPosition).toBeNull();
    });

    it('should handle I tetrimino special kicks', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.I;
      const position = { x: 8, y: 10 };

      const kickedPosition = performWallKick(board, tetrimino, position, 'I');

      expect(kickedPosition).not.toBeNull();
    });

    it('should handle O tetrimino (no kick needed)', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.O;
      const position = { x: 5, y: 10 };

      const kickedPosition = performWallKick(board, tetrimino, position, 'O');

      // O tetrimino doesn't need wall kicks
      expect(kickedPosition).toEqual(position);
    });
  });

  describe('tryRotateWithKick', () => {
    it('should rotate tetrimino when valid', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 10 };

      const result = tryRotateWithKick(board, tetrimino, position);

      expect(result.success).toBe(true);
      expect(result.tetrimino.shape).not.toEqual(tetrimino.shape);
      expect(result.position).toEqual(position);
    });

    it('should apply wall kick when direct rotation fails', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.I;
      const position = { x: 8, y: 10 }; // Near right wall

      const result = tryRotateWithKick(board, tetrimino, position);

      expect(result.success).toBe(true);
      expect(result.tetrimino.shape).not.toEqual(tetrimino.shape);
      // Position should be adjusted
      expect(result.position.x).toBeLessThanOrEqual(position.x);
    });

    it('should fail when no valid rotation exists', () => {
      const board = createEmptyBoard();
      // Surround the tetrimino with blocks
      for (let y = 8; y < 13; y++) {
        for (let x = 3; x < 8; x++) {
          if (!(x === 5 && y === 10)) {
            board[y][x] = { filled: true, color: '#FF0000' };
          }
        }
      }

      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 10 };

      const result = tryRotateWithKick(board, tetrimino, position);

      expect(result.success).toBe(false);
      expect(result.tetrimino).toEqual(tetrimino); // Should be unchanged
      expect(result.position).toEqual(position);
    });

    it('should handle O tetrimino rotation (no change)', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.O;
      const position = { x: 5, y: 10 };

      const result = tryRotateWithKick(board, tetrimino, position);

      expect(result.success).toBe(true);
      // O tetrimino doesn't change when rotated
      expect(result.tetrimino.shape).toEqual(tetrimino.shape);
      expect(result.position).toEqual(position);
    });
  });
});
