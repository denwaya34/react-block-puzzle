export type TetriminoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export type Rotation = 0 | 1 | 2 | 3;

export interface Tetrimino {
  type: TetriminoType;
  shape: number[][];
  color: string;
  rotation: Rotation;
}

// Define the 7 standard tetriminos with their shapes and colors
export const TETRIMINOS: Record<TetriminoType, Tetrimino> = {
  I: {
    type: 'I',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: '#00F0F0', // Cyan
    rotation: 0,
  },
  O: {
    type: 'O',
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: '#F0F000', // Yellow
    rotation: 0,
  },
  T: {
    type: 'T',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#A000F0', // Purple
    rotation: 0,
  },
  S: {
    type: 'S',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: '#00F000', // Green
    rotation: 0,
  },
  Z: {
    type: 'Z',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: '#F00000', // Red
    rotation: 0,
  },
  J: {
    type: 'J',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#0000F0', // Blue
    rotation: 0,
  },
  L: {
    type: 'L',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: '#F0A000', // Orange
    rotation: 0,
  },
};

// Rotate a tetrimino 90 degrees clockwise
export function rotateTetrimino(tetrimino: Tetrimino): Tetrimino {
  const n = tetrimino.shape.length;
  const rotatedShape = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      rotatedShape[j][n - 1 - i] = tetrimino.shape[i][j];
    }
  }

  return {
    ...tetrimino,
    shape: rotatedShape,
    rotation: ((tetrimino.rotation + 1) % 4) as Rotation,
  };
}
