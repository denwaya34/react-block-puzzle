import React from 'react';
import type { Board, Position } from '@/types/board';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/types/board';
import type { Tetrimino } from '@/types/tetrimino';
import styles from './GameBoard.module.css';

const DEFAULT_CLEARING_LINES: number[] = [];

const createRowKey = (rowIndex: number, rowCells: Board[number]) => {
  const cellSignature = rowCells
    .map((cell, colIndex) => {
      const state = cell.filled ? cell.color ?? 'filled' : 'empty';
      return `${String(colIndex)}-${state}`;
    })
    .join('|');
  return `row-${String(rowIndex)}-${cellSignature}`;
};

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
  clearingLines = DEFAULT_CLEARING_LINES,
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

  const clearingLinesSet = React.useMemo(
    () => new Set(clearingLines),
    [clearingLines],
  );

  return (
    <div className={styles.gameBoard}>
      <div className={styles.quantumScan} aria-hidden="true" />
      <div className={styles.gridWrap}>
        {board.slice(0, BOARD_HEIGHT).map((boardRow, rowIndex) => {
          const rowKey = createRowKey(rowIndex, boardRow);
          const isClearing = clearingLinesSet.has(rowIndex);
          return (
            <div
              key={rowKey}
              className={`${styles.row} row ${isClearing ? styles.clearing : ''}`}
            >
              {boardRow.slice(0, BOARD_WIDTH).map((_, colIndex) => {
                const cellState = getCellState(rowIndex, colIndex);
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

                const cellKey = `${rowKey}-col-${String(colIndex)}`;

                return (
                  <div
                    key={cellKey}
                    className={classNames}
                    style={{
                      backgroundColor: cellState.filled
                        ? cellState.color ?? undefined
                        : undefined,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
});
