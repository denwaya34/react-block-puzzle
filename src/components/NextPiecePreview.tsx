import React from "react";
import { type Tetrimino } from "@/types/tetrimino";
import styles from "./NextPiecePreview.module.css";

interface NextPiecePreviewProps {
  nextTetrimino: Tetrimino | null;
}

const PREVIEW_SIZE = 4;

export const NextPiecePreview = React.memo(function NextPiecePreview({
  nextTetrimino,
}: NextPiecePreviewProps) {
  // Create a 4x4 grid for preview
  const getCellState = (row: number, col: number) => {
    if (!nextTetrimino) {
      return { filled: false, color: null };
    }

    // Center the tetrimino in the 4x4 grid
    const shape = nextTetrimino.shape;
    const shapeHeight = shape.length;
    const shapeWidth = shape[0].length;

    // Calculate offset to center the piece
    const offsetY = Math.floor((PREVIEW_SIZE - shapeHeight) / 2);
    const offsetX = Math.floor((PREVIEW_SIZE - shapeWidth) / 2);

    const relY = row - offsetY;
    const relX = col - offsetX;

    if (
      relY >= 0 &&
      relY < shapeHeight &&
      relX >= 0 &&
      relX < shapeWidth &&
      shape[relY][relX]
    ) {
      return { filled: true, color: nextTetrimino.color };
    }

    return { filled: false, color: null };
  };

  return (
    <div className={styles.container}>
      <div className={styles.label}>Next</div>
      <div className={`${styles.nextPiecePreview} nextPiecePreview`}>
        {Array.from({ length: PREVIEW_SIZE }).map((_, row) => (
          <div key={row} className={`${styles.row} row`}>
            {Array.from({ length: PREVIEW_SIZE }).map((_, col) => {
              const cellState = getCellState(row, col);
              const classNames = [
                styles.cell,
                "cell",
                cellState.filled ? styles.filled : styles.empty,
                cellState.filled ? "filled" : "empty",
              ]
                .filter(Boolean)
                .join(" ");

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
        ))}
      </div>
    </div>
  );
});
