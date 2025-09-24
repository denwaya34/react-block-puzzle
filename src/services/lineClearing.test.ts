import { describe, it, expect } from 'vitest';
import {
  findCompletedLines,
  clearLines,
  calculateScore,
  updateLevel,
  shouldLevelUp,
} from './lineClearing';
import { createEmptyBoard, BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';

describe('LineClearing', () => {
  describe('findCompletedLines', () => {
    it('should find no completed lines in empty board', () => {
      const board = createEmptyBoard();
      const completedLines = findCompletedLines(board);

      expect(completedLines).toEqual([]);
    });

    it('should find single completed line', () => {
      const board = createEmptyBoard();
      // Fill bottom row completely
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: '#FF0000' };
      }

      const completedLines = findCompletedLines(board);
      expect(completedLines).toEqual([BOARD_HEIGHT - 1]);
    });

    it('should find multiple completed lines', () => {
      const board = createEmptyBoard();
      // Fill bottom two rows
      for (let y = BOARD_HEIGHT - 2; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = { filled: true, color: '#FF0000' };
        }
      }

      const completedLines = findCompletedLines(board);
      expect(completedLines).toEqual([BOARD_HEIGHT - 2, BOARD_HEIGHT - 1]);
    });

    it('should not find incomplete lines', () => {
      const board = createEmptyBoard();
      // Fill bottom row except one cell
      for (let x = 0; x < BOARD_WIDTH - 1; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: '#FF0000' };
      }

      const completedLines = findCompletedLines(board);
      expect(completedLines).toEqual([]);
    });
  });

  describe('clearLines', () => {
    it('should clear single line and drop blocks above', () => {
      const board = createEmptyBoard();
      // Place a block above the line to be cleared
      board[BOARD_HEIGHT - 2][5] = { filled: true, color: '#00FF00' };
      // Fill bottom row
      for (let x = 0; x < BOARD_WIDTH; x++) {
        board[BOARD_HEIGHT - 1][x] = { filled: true, color: '#FF0000' };
      }

      const newBoard = clearLines(board, [BOARD_HEIGHT - 1]);

      // Check that the line was cleared and block dropped
      expect(newBoard[BOARD_HEIGHT - 1][5].filled).toBe(true);
      expect(newBoard[BOARD_HEIGHT - 1][5].color).toBe('#00FF00');
      expect(newBoard[BOARD_HEIGHT - 2][5].filled).toBe(false);
    });

    it('should clear multiple lines', () => {
      const board = createEmptyBoard();
      // Place a block above the lines to be cleared
      board[BOARD_HEIGHT - 3][5] = { filled: true, color: '#00FF00' };
      // Fill bottom two rows
      for (let y = BOARD_HEIGHT - 2; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = { filled: true, color: '#FF0000' };
        }
      }

      const newBoard = clearLines(board, [BOARD_HEIGHT - 2, BOARD_HEIGHT - 1]);

      // Check that lines were cleared and block dropped by 2
      expect(newBoard[BOARD_HEIGHT - 1][5].filled).toBe(true);
      expect(newBoard[BOARD_HEIGHT - 1][5].color).toBe('#00FF00');
      expect(newBoard[BOARD_HEIGHT - 3][5].filled).toBe(false);
    });

    it('should handle four lines', () => {
      const board = createEmptyBoard();
      // Fill bottom 4 rows
      for (let y = BOARD_HEIGHT - 4; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          board[y][x] = { filled: true, color: '#FF0000' };
        }
      }

      const linesToClear = [
        BOARD_HEIGHT - 4,
        BOARD_HEIGHT - 3,
        BOARD_HEIGHT - 2,
        BOARD_HEIGHT - 1,
      ];
      const newBoard = clearLines(board, linesToClear);

      // All bottom 4 rows should be empty
      for (let y = BOARD_HEIGHT - 4; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
          expect(newBoard[y][x].filled).toBe(false);
        }
      }
    });
  });

  describe('calculateScore', () => {
    it('should calculate score for 1 line', () => {
      expect(calculateScore(1, 1)).toBe(100);
      expect(calculateScore(1, 5)).toBe(500);
      expect(calculateScore(1, 10)).toBe(1000);
    });

    it('should calculate score for 2 lines', () => {
      expect(calculateScore(2, 1)).toBe(300);
      expect(calculateScore(2, 5)).toBe(1500);
    });

    it('should calculate score for 3 lines', () => {
      expect(calculateScore(3, 1)).toBe(500);
      expect(calculateScore(3, 5)).toBe(2500);
    });

    it('should calculate score for four lines', () => {
      expect(calculateScore(4, 1)).toBe(800);
      expect(calculateScore(4, 5)).toBe(4000);
      expect(calculateScore(4, 10)).toBe(8000);
    });
  });

  describe('updateLevel', () => {
    it('should stay at level 1 with less than 10 lines', () => {
      expect(updateLevel(1, 9)).toBe(1);
    });

    it('should increase level every 10 lines', () => {
      expect(updateLevel(1, 10)).toBe(2);
      expect(updateLevel(1, 20)).toBe(3);
      expect(updateLevel(1, 50)).toBe(6);
    });

    it('should cap at level 10', () => {
      expect(updateLevel(1, 100)).toBe(10);
      expect(updateLevel(1, 200)).toBe(10);
    });
  });

  describe('shouldLevelUp', () => {
    it('should return true when crossing 10-line threshold', () => {
      expect(shouldLevelUp(9, 10)).toBe(true);
      expect(shouldLevelUp(19, 20)).toBe(true);
    });

    it('should return false when not crossing threshold', () => {
      expect(shouldLevelUp(5, 6)).toBe(false);
      expect(shouldLevelUp(10, 11)).toBe(false);
      expect(shouldLevelUp(20, 22)).toBe(false);
    });
  });
});
