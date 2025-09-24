import { createEmptyBoard } from './board';
import type { Board, Position } from './board';
import { TETRIMINOS } from './tetrimino';
import type { Tetrimino, TetriminoType } from './tetrimino';

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameOver';

export interface GameState {
  board: Board;
  currentTetrimino: Tetrimino | null;
  nextTetrimino: Tetrimino | null;
  currentPosition: Position;
  score: number;
  level: number;
  lines: number;
  gameStatus: GameStatus;
}

export interface GameMetrics {
  score: number;
  level: number;
  lines: number;
  dropInterval: number;
}

// Get a random tetrimino
export function getRandomTetrimino(): Tetrimino {
  const types: TetriminoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return { ...TETRIMINOS[randomType] };
}

// Calculate drop interval based on level (speed increases with level)
export function getDropInterval(level: number): number {
  const baseInterval = 1000; // 1 second at level 1
  const speedIncrease = 100; // Decrease by 100ms per level
  const minInterval = 100; // Minimum interval (fastest speed)

  const interval = baseInterval - (level - 1) * speedIncrease;
  return Math.max(interval, minInterval);
}

// Create the initial game state
export function createInitialGameState(): GameState {
  return {
    board: createEmptyBoard(),
    currentTetrimino: null,
    nextTetrimino: getRandomTetrimino(),
    currentPosition: { x: 3, y: 0 }, // Start position (centered at top)
    score: 0,
    level: 1,
    lines: 0,
    gameStatus: 'idle',
  };
}
