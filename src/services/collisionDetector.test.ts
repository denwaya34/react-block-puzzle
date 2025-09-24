import { describe, it, expect } from 'vitest';
import {
  canMoveTo,
  canRotate,
  isValidPosition,
  willCollide,
  isGameOver,
} from './collisionDetector';
import {
  createEmptyBoard,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '@/types/board';
import { TETRIMINOS } from '@/types/tetrimino';

describe('CollisionDetector', () => {
  describe('isValidPosition', () => {
    it('should return true for valid position within board', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 5 };

      expect(isValidPosition(board, tetrimino, position)).toBe(true);
    });

    it('should return false when tetrimino is out of left boundary', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: -2, y: 5 };

      expect(isValidPosition(board, tetrimino, position)).toBe(false);
    });

    it('should return false when tetrimino is out of right boundary', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: BOARD_WIDTH - 1, y: 5 };

      expect(isValidPosition(board, tetrimino, position)).toBe(false);
    });

    it('should return false when tetrimino is out of bottom boundary', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: BOARD_HEIGHT - 1 };

      expect(isValidPosition(board, tetrimino, position)).toBe(false);
    });

    it('should return false when tetrimino collides with existing blocks', () => {
      const board = createEmptyBoard();
      // Place a block at position (5, 5)
      board[5][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.T;
      const position = { x: 4, y: 4 }; // T-piece center would be at (5, 5)

      expect(isValidPosition(board, tetrimino, position)).toBe(false);
    });
  });

  describe('canMoveTo', () => {
    it('should allow movement to empty position', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 10 };

      expect(canMoveTo(board, tetrimino, position)).toBe(true);
    });

    it('should prevent movement to occupied position', () => {
      const board = createEmptyBoard();
      board[10][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.T;
      const position = { x: 4, y: 9 };

      expect(canMoveTo(board, tetrimino, position)).toBe(false);
    });
  });

  describe('canRotate', () => {
    it('should allow rotation in open space', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 5, y: 5 };

      expect(canRotate(board, tetrimino, position)).toBe(true);
    });

    it('should prevent rotation when it would cause collision', () => {
      const board = createEmptyBoard();
      // Fill the right side to block rotation
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        board[y][9] = { filled: true, color: '#FF0000' };
      }

      const tetrimino = TETRIMINOS.I;
      const position = { x: 8, y: 5 };

      expect(canRotate(board, tetrimino, position)).toBe(false);
    });
  });

  describe('willCollide', () => {
    it('should detect collision with bottom', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const nextPosition = { x: 5, y: BOARD_HEIGHT - 1 };

      expect(willCollide(board, tetrimino, nextPosition)).toBe(true);
    });

    it('should detect collision with other pieces', () => {
      const board = createEmptyBoard();
      board[10][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.T;
      const position = { x: 4, y: 9 };

      expect(willCollide(board, tetrimino, position)).toBe(true);
    });
  });

  describe('isGameOver', () => {
    it('should return false when spawn position is clear', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;

      expect(isGameOver(board, tetrimino)).toBe(false);
    });

    it('should return true when spawn position is blocked', () => {
      const board = createEmptyBoard();
      // Block the spawn area
      board[0][3] = { filled: true, color: '#FF0000' };
      board[0][4] = { filled: true, color: '#FF0000' };
      board[0][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.T;

      expect(isGameOver(board, tetrimino)).toBe(true);
    });
  });
});
