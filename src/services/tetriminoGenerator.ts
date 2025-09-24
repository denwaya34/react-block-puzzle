import type { Board, Position } from '@/types/board';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';
import type { Tetrimino, TetriminoType } from '@/types/tetrimino';
import { TETRIMINOS } from '@/types/tetrimino';
import { isValidPosition } from './collisionDetector';

/**
 * Simple seedable random number generator
 */
class SeededRandom {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? Date.now();
  }

  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
}

/**
 * Tetrimino generator interface
 */
export interface TetriminoGenerator {
  next(): Tetrimino;
  peek(): Tetrimino;
}

/**
 * Create a random tetrimino generator
 */
export function createRandomGenerator(seed?: number): TetriminoGenerator {
  const random = new SeededRandom(seed);
  const types: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  let nextTetrimino: Tetrimino | null = null;

  const generateTetrimino = (): Tetrimino => {
    const index = Math.floor(random.next() * types.length);
    return { ...TETRIMINOS[types[index]] };
  };

  return {
    next(): Tetrimino {
      if (nextTetrimino) {
        const current = nextTetrimino;
        nextTetrimino = null;
        return { ...current };
      }
      return { ...generateTetrimino() };
    },

    peek(): Tetrimino {
      nextTetrimino ??= generateTetrimino();
      return { ...nextTetrimino };
    },
  };
}

/**
 * Get the initial position for a tetrimino (centered at top)
 */
export function getInitialPosition(tetrimino: Tetrimino): Position {
  // Find the actual width of the tetrimino
  let minX = tetrimino.shape[0].length;
  let maxX = 0;

  for (const row of tetrimino.shape) {
    for (let x = 0; x < row.length; x++) {
      if (row[x]) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }

  const actualWidth = maxX - minX + 1;
  const centerX = Math.floor((BOARD_WIDTH - actualWidth) / 2);

  return {
    x: centerX,
    y: 0,
  };
}

/**
 * Place a tetrimino on the board at the given position
 */
export function placeTetriminoOnBoard(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): Board {
  // Create a copy of the board
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  // Place the tetrimino
  for (let y = 0; y < tetrimino.shape.length; y++) {
    for (let x = 0; x < tetrimino.shape[y].length; x++) {
      if (tetrimino.shape[y][x]) {
        const boardY = position.y + y;
        const boardX = position.x + x;

        if (
          boardY >= 0
          && boardY < BOARD_HEIGHT
          && boardX >= 0
          && boardX < BOARD_WIDTH
        ) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: tetrimino.color,
          };
        }
      }
    }
  }

  return newBoard;
}

/**
 * Check if a tetrimino should be locked in place
 */
export function shouldLockTetrimino(
  board: Board,
  tetrimino: Tetrimino,
  position: Position,
): boolean {
  // Check if the tetrimino can move down one more position
  const nextPosition = { x: position.x, y: position.y + 1 };
  return !isValidPosition(board, tetrimino, nextPosition);
}
