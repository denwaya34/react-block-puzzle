export interface Cell {
  filled: boolean;
  color: string | null;
}

export type Board = Cell[][];

export interface Position {
  x: number;
  y: number;
}

// Standard block puzzle board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Create an empty board with all cells unfilled
export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT)
    .fill(null)
    .map(() =>
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({
          filled: false,
          color: null,
        })),
    );
}
