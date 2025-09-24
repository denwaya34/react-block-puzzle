import { Board, BOARD_WIDTH, BOARD_HEIGHT } from "@/types/board";

/**
 * Find all completed (filled) lines in the board
 */
export function findCompletedLines(board: Board): number[] {
  const completedLines: number[] = [];

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    const isLineComplete = board[y].every((cell) => cell.filled);
    if (isLineComplete) {
      completedLines.push(y);
    }
  }

  return completedLines;
}

/**
 * Clear specified lines and drop blocks above
 */
export function clearLines(board: Board, linesToClear: number[]): Board {
  // Create a set for quick lookup
  const linesToClearSet = new Set(linesToClear);

  // Filter out the lines to be cleared
  const remainingRows = board.filter((_, index) => !linesToClearSet.has(index));

  // Add empty rows at the top
  const emptyRowsCount = linesToClear.length;
  const emptyRows: Board = Array(emptyRowsCount)
    .fill(null)
    .map(() =>
      Array(BOARD_WIDTH)
        .fill(null)
        .map(() => ({
          filled: false,
          color: null,
        })),
    );

  // Combine empty rows at the top with remaining rows
  return [...emptyRows, ...remainingRows];
}

/**
 * Calculate score based on number of lines cleared and current level
 */
export function calculateScore(linesCleared: number, level: number): number {
  const baseScores: { [key: number]: number } = {
    1: 100, // Single
    2: 300, // Double
    3: 500, // Triple
    4: 800, // Four Lines
  };

  const baseScore = baseScores[linesCleared] || 0;
  return baseScore * level;
}

/**
 * Update level based on total lines cleared
 */
export function updateLevel(_currentLevel: number, totalLines: number): number {
  // Level up every 10 lines, capped at level 10
  const newLevel = Math.floor(totalLines / 10) + 1;
  return Math.min(newLevel, 10);
}

/**
 * Check if player should level up
 */
export function shouldLevelUp(
  previousLines: number,
  currentLines: number,
): boolean {
  const previousLevel = Math.floor(previousLines / 10);
  const currentLevel = Math.floor(currentLines / 10);
  return currentLevel > previousLevel;
}
