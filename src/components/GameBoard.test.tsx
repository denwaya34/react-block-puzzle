import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { GameBoard } from './GameBoard';
import { createEmptyBoard, BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';
import { TETRIMINOS } from '@/types/tetrimino';

describe('GameBoard', () => {
  it('should render a 10x20 grid', () => {
    const board = createEmptyBoard();
    const { container } = render(<GameBoard board={board} />);

    const cells = container.querySelectorAll<HTMLElement>('.cell');
    expect(cells.length).toBe(BOARD_WIDTH * BOARD_HEIGHT);
  });

  it('should display empty cells correctly', () => {
    const board = createEmptyBoard();
    const { container } = render(<GameBoard board={board} />);

    const cells = container.querySelectorAll<HTMLElement>('.cell');
    cells.forEach((cell) => {
      expect(cell.classList.contains('empty')).toBe(true);
      expect(cell.classList.contains('filled')).toBe(false);
    });
  });

  it('should display filled cells with correct color', () => {
    const board = createEmptyBoard();
    board[19][0] = { filled: true, color: '#FF0000' };
    board[19][1] = { filled: true, color: '#00FF00' };

    const { container } = render(<GameBoard board={board} />);

    const rows = container.querySelectorAll<HTMLElement>('.row');
    const lastRow = rows[19];
    const cells = lastRow.querySelectorAll<HTMLElement>('.cell');

    expect(cells[0].classList.contains('filled')).toBe(true);
    expect(cells[0].style.backgroundColor).toBe('rgb(255, 0, 0)');

    expect(cells[1].classList.contains('filled')).toBe(true);
    expect(cells[1].style.backgroundColor).toBe('rgb(0, 255, 0)');
  });

  it('should display current tetrimino when provided', () => {
    const board = createEmptyBoard();
    const currentTetrimino = TETRIMINOS.T;
    const currentPosition = { x: 4, y: 0 };

    const { container } = render(
      <GameBoard
        board={board}
        currentTetrimino={currentTetrimino}
        currentPosition={currentPosition}
      />,
    );

    // T tetrimino at position (4, 0) should fill specific cells
    const rows = container.querySelectorAll<HTMLElement>('.row');

    // Check first row (has the top of T)
    const row0Cells = rows[0].querySelectorAll<HTMLElement>('.cell');
    expect(row0Cells[5].classList.contains('filled')).toBe(true); // Center top of T
    expect(row0Cells[5].classList.contains('preview')).toBe(true);

    // Check second row (has the base of T)
    const row1Cells = rows[1].querySelectorAll<HTMLElement>('.cell');
    expect(row1Cells[4].classList.contains('filled')).toBe(true);
    expect(row1Cells[5].classList.contains('filled')).toBe(true);
    expect(row1Cells[6].classList.contains('filled')).toBe(true);
  });

  it('should have proper grid structure with rows', () => {
    const board = createEmptyBoard();
    const { container } = render(<GameBoard board={board} />);

    const boardElement = container.querySelector('div');
    expect(boardElement).toBeTruthy();

    const rows = container.querySelectorAll<HTMLElement>('.row');
    expect(rows.length).toBe(BOARD_HEIGHT);

    rows.forEach((row) => {
      const cells = row.querySelectorAll<HTMLElement>('.cell');
      expect(cells.length).toBe(BOARD_WIDTH);
    });
  });

  it('should merge board and current tetrimino correctly', () => {
    const board = createEmptyBoard();
    // Add some fixed blocks
    board[19][0] = { filled: true, color: '#FF0000' };
    board[19][1] = { filled: true, color: '#FF0000' };

    const currentTetrimino = TETRIMINOS.O;
    const currentPosition = { x: 4, y: 17 };

    const { container } = render(
      <GameBoard
        board={board}
        currentTetrimino={currentTetrimino}
        currentPosition={currentPosition}
      />,
    );

    // Check that both fixed blocks and current tetrimino are displayed
    const filledCells = container.querySelectorAll('.cell.filled');
    expect(filledCells.length).toBe(6); // 2 fixed + 4 from O tetrimino
  });
});
