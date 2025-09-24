import React, { useEffect, useCallback, useRef } from 'react';
import {
  GameBoard,
  ScorePanel,
  ControlPanel,
  NextPiecePreview,
  GameOverScreen,
} from '@/components';
import { useGameState } from '@/hooks/useGameState';
import { useKeyboardInput } from '@/hooks/useKeyboardInput';
import { tryMove, tryRotateWithKick } from '@/services/movementController';
import {
  findCompletedLines,
  clearLines,
  calculateScore,
} from '@/services/lineClearing';
import {
  placeTetriminoOnBoard,
  createRandomGenerator,
  getInitialPosition,
} from '@/services/tetriminoGenerator';
import { isGameOver } from '@/services/collisionDetector';
import { getDropInterval } from '@/types/game';
import styles from './Game.module.css';

export function Game() {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    moveTetrimino,
    updateScore,
    setCurrentTetrimino,
    setNextTetrimino,
    updateBoard,
  } = useGameState();

  const dropTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const generatorRef = useRef(createRandomGenerator());
  const isSoftDroppingRef = useRef(false);
  const [clearingLines, setClearingLines] = React.useState<number[]>([]);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isGrounded, setIsGrounded] = React.useState(false);

  // Spawn new tetrimino
  const spawnNewTetrimino = useCallback(() => {
    const currentTetrimino
      = gameState.nextTetrimino ?? generatorRef.current.next();
    const nextTetrimino = generatorRef.current.next();
    const position = getInitialPosition(currentTetrimino);

    // Check game over
    if (isGameOver(gameState.board, currentTetrimino)) {
      gameOver();
      return;
    }

    setCurrentTetrimino(currentTetrimino, position);
    setNextTetrimino(nextTetrimino);
    setIsGrounded(false);

    // Clear lock timer
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, [
    gameState.board,
    gameState.nextTetrimino,
    setCurrentTetrimino,
    setNextTetrimino,
    gameOver,
  ]);

  // Lock current tetrimino and spawn new one
  const lockTetrimino = useCallback(() => {
    if (!gameState.currentTetrimino || !gameState.currentPosition) return;

    // Place tetrimino on board
    const newBoard = placeTetriminoOnBoard(
      gameState.board,
      gameState.currentTetrimino,
      gameState.currentPosition,
    );

    // Check for completed lines
    const completedLines = findCompletedLines(newBoard);

    if (completedLines.length > 0) {
      // Show animation
      setClearingLines(completedLines);
      updateBoard(newBoard);

      // After animation, clear lines and continue
      setTimeout(() => {
        const clearedBoard = clearLines(newBoard, completedLines);
        const score = calculateScore(completedLines.length, gameState.level);
        updateScore(score, completedLines.length);
        updateBoard(clearedBoard);
        setClearingLines([]);
        spawnNewTetrimino();
      }, 500);
    }
    else {
      // No lines to clear, just update and spawn
      updateBoard(newBoard);
      spawnNewTetrimino();
    }
  }, [
    gameState.board,
    gameState.currentTetrimino,
    gameState.currentPosition,
    gameState.level,
    updateBoard,
    updateScore,
    spawnNewTetrimino,
  ]);

  // Handle automatic drop
  const handleAutoDrop = useCallback(() => {
    const { status, currentTetrimino, currentPosition, board } = gameState;
    if (status !== 'playing' || !currentTetrimino || clearingLines.length > 0) {
      return;
    }

    const moved = tryMove(
      board,
      currentTetrimino,
      currentPosition,
      'down',
    );

    if (moved.success) {
      moveTetrimino('down');
      setIsGrounded(false);
      // Clear lock timer if piece moves down
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    }
    else {
      // Can't move down, start lock delay if not already grounded
      if (!isGrounded) {
        setIsGrounded(true);
        // Start lock timer (1000ms delay before locking)
        lockTimerRef.current = setTimeout(() => {
          lockTetrimino();
        }, 1000);
      }
    }
  }, [
    gameState.board,
    gameState.currentPosition,
    gameState.currentTetrimino,
    gameState.status,
    clearingLines,
    isGrounded,
    lockTetrimino,
    moveTetrimino,
  ]);

  // Setup automatic drop timer
  useEffect(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current);
    }

    if (gameState.status === 'playing') {
      const interval = isSoftDroppingRef.current
        ? 50
        : getDropInterval(gameState.level);
      dropTimerRef.current = setInterval(handleAutoDrop, interval);
    }

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
    };
  }, [gameState.level, gameState.status, handleAutoDrop]);

  // Keyboard controls
  const handleMoveLeft = useCallback(() => {
    const {
      status,
      currentTetrimino,
      currentPosition,
      board,
    } = gameState;
    if (status !== 'playing' || !currentTetrimino || !currentPosition) return;

    const moved = tryMove(
      board,
      currentTetrimino,
      currentPosition,
      'left',
    );
    if (moved.success) {
      moveTetrimino('left');
      // Reset lock timer if piece is grounded and moves successfully
      if (isGrounded) {
        if (lockTimerRef.current) {
          clearTimeout(lockTimerRef.current);
        }
        lockTimerRef.current = setTimeout(() => {
          lockTetrimino();
        }, 1000);
      }
    }
  }, [gameState.board, gameState.currentPosition, gameState.currentTetrimino, gameState.status, isGrounded, lockTetrimino, moveTetrimino]);

  const handleMoveRight = useCallback(() => {
    const {
      status,
      currentTetrimino,
      currentPosition,
      board,
    } = gameState;
    if (status !== 'playing' || !currentTetrimino || !currentPosition) return;

    const moved = tryMove(
      board,
      currentTetrimino,
      currentPosition,
      'right',
    );
    if (moved.success) {
      moveTetrimino('right');
      // Reset lock timer if piece is grounded and moves successfully
      if (isGrounded) {
        if (lockTimerRef.current) {
          clearTimeout(lockTimerRef.current);
        }
        lockTimerRef.current = setTimeout(() => {
          lockTetrimino();
        }, 1000);
      }
    }
  }, [gameState.board, gameState.currentPosition, gameState.currentTetrimino, gameState.status, isGrounded, lockTetrimino, moveTetrimino]);

  const handleRotate = useCallback(() => {
    const {
      status,
      currentTetrimino,
      currentPosition,
      board,
    } = gameState;
    if (status !== 'playing' || !currentTetrimino || !currentPosition) return;

    const result = tryRotateWithKick(board, currentTetrimino, currentPosition);
    if (result.success) {
      setCurrentTetrimino(result.tetrimino, result.position);
      // Reset lock timer if piece is grounded and rotates successfully
      if (isGrounded && lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = setTimeout(() => {
          lockTetrimino();
        }, 500);
      }
    }
  }, [gameState.board, gameState.currentPosition, gameState.currentTetrimino, gameState.status, isGrounded, lockTetrimino, setCurrentTetrimino]);

  const handleSoftDrop = useCallback(() => {
    const {
      status,
      currentTetrimino,
      currentPosition,
      board,
    } = gameState;
    if (status !== 'playing' || !currentTetrimino || !currentPosition) return;

    const moved = tryMove(board, currentTetrimino, currentPosition, 'down');
    if (moved.success) {
      moveTetrimino('down');
      setIsGrounded(false);
      // Clear lock timer if piece moves down
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
        lockTimerRef.current = null;
      }
    }
    else {
      // Can't move down when soft dropping, start lock delay if not already grounded
      if (!isGrounded) {
        setIsGrounded(true);
        lockTimerRef.current = setTimeout(() => {
          lockTetrimino();
        }, 1000);
      }
    }
  }, [gameState, moveTetrimino, isGrounded, lockTetrimino]);

  const handleSoftDropStart = useCallback(() => {
    isSoftDroppingRef.current = true;
  }, []);

  const handleSoftDropStop = useCallback(() => {
    isSoftDroppingRef.current = false;
  }, []);

  const handlePause = useCallback(() => {
    if (gameState.status === 'playing') {
      pauseGame();
    }
    else if (gameState.status === 'paused') {
      resumeGame();
    }
  }, [gameState.status, pauseGame, resumeGame]);

  const handleStart = useCallback(() => {
    generatorRef.current = createRandomGenerator();
    startGame();
    spawnNewTetrimino();
  }, [startGame, spawnNewTetrimino]);

  const handleReset = useCallback(() => {
    generatorRef.current = createRandomGenerator();
    resetGame();
    setIsGrounded(false);
    // Clear lock timer
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, [resetGame]);

  useKeyboardInput({
    enabled: gameState.status === 'playing' && clearingLines.length === 0,
    onMoveLeft: handleMoveLeft,
    onMoveRight: handleMoveRight,
    onRotate: handleRotate,
    onSoftDrop: handleSoftDrop,
    onSoftDropStart: handleSoftDropStart,
    onSoftDropStop: handleSoftDropStop,
    onPause: handlePause,
  });

  // Cleanup lock timer on unmount
  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.game}>
      <div className={styles.mainArea}>
        <div className={styles.sidePanel}>
          <NextPiecePreview nextTetrimino={gameState.nextTetrimino} />
          <ScorePanel
            score={gameState.score}
            level={gameState.level}
            lines={gameState.lines}
          />
        </div>

        <GameBoard
          board={gameState.board}
          currentTetrimino={gameState.currentTetrimino}
          currentPosition={gameState.currentPosition}
          clearingLines={clearingLines}
        />

        <div className={styles.sidePanel}>
          <ControlPanel
            gameStatus={gameState.status}
            onStart={handleStart}
            onPause={pauseGame}
            onResume={resumeGame}
            onReset={handleReset}
          />
        </div>
      </div>

      <GameOverScreen
        isGameOver={gameState.status === 'gameOver'}
        score={gameState.score}
        level={gameState.level}
        lines={gameState.lines}
        onNewGame={handleStart}
      />
    </div>
  );
}
