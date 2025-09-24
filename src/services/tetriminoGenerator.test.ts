import { describe, it, expect } from 'vitest';
import {
  createRandomGenerator,
  getInitialPosition,
  placeTetriminoOnBoard,
  shouldLockTetrimino,
} from './tetriminoGenerator';
import { createEmptyBoard } from '@/types/board';
import { TETRIMINOS } from '@/types/tetrimino';

describe('TetriminoGenerator', () => {
  describe('createRandomGenerator', () => {
    it('should generate tetriminos from all 7 types', () => {
      const generator = createRandomGenerator();
      const types = new Set<string>();

      // Generate many tetriminos to ensure all types appear
      for (let i = 0; i < 100; i++) {
        const tetrimino = generator.next();
        types.add(tetrimino.type);
      }

      expect(types.size).toBe(7);
      expect(types.has('I')).toBe(true);
      expect(types.has('O')).toBe(true);
      expect(types.has('T')).toBe(true);
      expect(types.has('S')).toBe(true);
      expect(types.has('Z')).toBe(true);
      expect(types.has('J')).toBe(true);
      expect(types.has('L')).toBe(true);
    });

    it('should generate different sequences with different seeds', () => {
      const generator1 = createRandomGenerator(12345);
      const generator2 = createRandomGenerator(54321);

      const sequence1 = Array.from(
        { length: 10 },
        () => generator1.next().type,
      );
      const sequence2 = Array.from(
        { length: 10 },
        () => generator2.next().type,
      );

      // The sequences should be different (very unlikely to be the same)
      expect(sequence1).not.toEqual(sequence2);
    });

    it('should generate the same sequence with the same seed', () => {
      const generator1 = createRandomGenerator(12345);
      const generator2 = createRandomGenerator(12345);

      const sequence1 = Array.from(
        { length: 10 },
        () => generator1.next().type,
      );
      const sequence2 = Array.from(
        { length: 10 },
        () => generator2.next().type,
      );

      expect(sequence1).toEqual(sequence2);
    });

    it('should have peek functionality to see next tetrimino without consuming it', () => {
      const generator = createRandomGenerator();

      const peeked1 = generator.peek();
      const peeked2 = generator.peek();
      const next = generator.next();

      expect(peeked1).toEqual(peeked2);
      expect(peeked1).toEqual(next);
    });
  });

  describe('getInitialPosition', () => {
    it('should center I tetrimino correctly', () => {
      const tetrimino = TETRIMINOS.I;
      const position = getInitialPosition(tetrimino);

      // I tetrimino is 4 wide, so it should start at x = 3 to be centered
      expect(position.x).toBe(3);
      expect(position.y).toBe(0);
    });

    it('should center O tetrimino correctly', () => {
      const tetrimino = TETRIMINOS.O;
      const position = getInitialPosition(tetrimino);

      // O tetrimino is 2 wide, so it should start at x = 4 to be centered
      expect(position.x).toBe(4);
      expect(position.y).toBe(0);
    });

    it('should center T tetrimino correctly', () => {
      const tetrimino = TETRIMINOS.T;
      const position = getInitialPosition(tetrimino);

      // T tetrimino is 3 wide, so it should start at x = 3 or 4 to be centered
      expect(position.x).toBeGreaterThanOrEqual(3);
      expect(position.x).toBeLessThanOrEqual(4);
      expect(position.y).toBe(0);
    });

    it('should handle tetriminos with empty top rows', () => {
      const tetrimino = TETRIMINOS.T;
      const position = getInitialPosition(tetrimino);

      // Should still start at y = 0 even if top row is empty
      expect(position.y).toBe(0);
    });
  });

  describe('placeTetriminoOnBoard', () => {
    it('should place tetrimino on empty board', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.O;
      const position = { x: 4, y: 0 };

      const newBoard = placeTetriminoOnBoard(board, tetrimino, position);

      // Check that O tetrimino is placed correctly
      expect(newBoard[0][4].filled).toBe(true);
      expect(newBoard[0][5].filled).toBe(true);
      expect(newBoard[1][4].filled).toBe(true);
      expect(newBoard[1][5].filled).toBe(true);
      expect(newBoard[0][4].color).toBe(tetrimino.color);
    });

    it('should not modify original board', () => {
      const board = createEmptyBoard();
      const originalBoard = board.map(row => [...row]);
      const tetrimino = TETRIMINOS.I;
      const position = { x: 3, y: 10 };

      placeTetriminoOnBoard(board, tetrimino, position);

      expect(board).toEqual(originalBoard);
    });

    it('should merge with existing blocks on board', () => {
      const board = createEmptyBoard();
      // Place some existing blocks
      board[19][0] = { filled: true, color: '#FF0000' };
      board[19][1] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.I;
      const position = { x: 3, y: 18 };

      const newBoard = placeTetriminoOnBoard(board, tetrimino, position);

      // Check existing blocks are preserved
      expect(newBoard[19][0].filled).toBe(true);
      expect(newBoard[19][1].filled).toBe(true);
      // Check new tetrimino is placed
      expect(newBoard[19][3].filled).toBe(true);
      expect(newBoard[19][4].filled).toBe(true);
      expect(newBoard[19][5].filled).toBe(true);
      expect(newBoard[19][6].filled).toBe(true);
    });

    it('should handle placement at board edges', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.I;
      const position = { x: 6, y: 0 }; // Right edge

      const newBoard = placeTetriminoOnBoard(board, tetrimino, position);

      // Should place without error
      expect(newBoard[1][6].filled).toBe(true);
      expect(newBoard[1][7].filled).toBe(true);
      expect(newBoard[1][8].filled).toBe(true);
      expect(newBoard[1][9].filled).toBe(true);
    });
  });

  describe('shouldLockTetrimino', () => {
    it('should lock when tetrimino cannot move down', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.O;
      const position = { x: 4, y: 18 }; // At bottom

      const shouldLock = shouldLockTetrimino(board, tetrimino, position);

      expect(shouldLock).toBe(true);
    });

    it('should lock when tetrimino would collide with existing blocks', () => {
      const board = createEmptyBoard();
      // Place existing blocks
      board[10][4] = { filled: true, color: '#FF0000' };
      board[10][5] = { filled: true, color: '#FF0000' };

      const tetrimino = TETRIMINOS.O;
      const position = { x: 4, y: 8 }; // Just above existing blocks

      const shouldLock = shouldLockTetrimino(board, tetrimino, position);

      expect(shouldLock).toBe(true);
    });

    it('should not lock when tetrimino can still move down', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.T;
      const position = { x: 4, y: 5 }; // Middle of board

      const shouldLock = shouldLockTetrimino(board, tetrimino, position);

      expect(shouldLock).toBe(false);
    });

    it('should handle I tetrimino at bottom correctly', () => {
      const board = createEmptyBoard();
      const tetrimino = TETRIMINOS.I;
      const position = { x: 3, y: 18 }; // I piece horizontal at bottom

      const shouldLock = shouldLockTetrimino(board, tetrimino, position);

      expect(shouldLock).toBe(true);
    });
  });
});
