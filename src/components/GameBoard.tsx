import React from 'react';
import type { Board, Position } from '@/types/board';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';
import type { Tetrimino } from '@/types/tetrimino';
import styles from './GameBoard.module.css';

interface GameBoardProps {
  board: Board;
  currentTetrimino?: Tetrimino | null;
  currentPosition?: Position;
  clearingLines?: number[];
}

export const GameBoard = React.memo(function GameBoard({
  board,
  currentTetrimino,
  currentPosition,
  clearingLines = [],
}: GameBoardProps) {
  // Determine if a cell should be filled
  const getCellState = (row: number, col: number) => {
    // Check if cell is part of the current tetrimino
    if (currentTetrimino && currentPosition) {
      const relY = row - currentPosition.y;
      const relX = col - currentPosition.x;

      if (
        relY >= 0
        && relY < currentTetrimino.shape.length
        && relX >= 0
        && relX < currentTetrimino.shape[0].length
        && currentTetrimino.shape[relY][relX]
      ) {
        return {
          filled: true,
          color: currentTetrimino.color,
          isPreview: true,
        };
      }
    }

    // Return board state
    return {
      filled: board[row][col].filled,
      color: board[row][col].color,
      isPreview: false,
    };
  };

  return (
    <div className={styles.gameBoard}>
        {Array.from({ length: BOARD_HEIGHT }).map((_, row) => {
        const isClearing = clearingLines.includes(row);
        return (
          <div
            key={row}
            className={`${styles.row} row ${isClearing ? styles.clearing : ''}`}
          >
            {Array.from({ length: BOARD_WIDTH }).map((_, col) => {
              const cellState = getCellState(row, col);
              const classNames = [
                styles.cell,
                'cell',
                cellState.filled ? styles.filled : styles.empty,
                cellState.filled ? 'filled' : 'empty',
                cellState.isPreview ? styles.preview : '',
                cellState.isPreview ? 'preview' : '',
                isClearing ? styles.clearingCell : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={col}
                  className={classNames}
                  style={{
                    backgroundColor: cellState.filled
                      ? cellState.color || undefined
                      : undefined,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
});
