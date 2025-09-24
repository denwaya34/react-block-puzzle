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
import { useGameSound } from '@/hooks/useSound';
import { useCompliment } from '@/hooks/useCompliment';
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

  const {
    board,
    currentTetrimino,
    currentPosition,
    nextTetrimino,
    status,
    score,
    level,
    lines,
  } = gameState;

  const isClearingInProgress = clearingLines.length > 0;

  const { initializeAudio, syncGameStatus, playBlockLockSound } = useGameSound();
  const { speakCompliment, isSupported: isSpeechSupported } = useCompliment();

  useEffect(() => {
    syncGameStatus(status);
  }, [status, syncGameStatus]);

  // Spawn new tetrimino
  const spawnNewTetrimino = useCallback(() => {
    const activeTetrimino = nextTetrimino ?? generatorRef.current.next();
    const upcomingTetrimino = generatorRef.current.next();
    const position = getInitialPosition(activeTetrimino);

    // Check game over
    if (isGameOver(board, activeTetrimino)) {
      gameOver();
      return;
    }

    setCurrentTetrimino(activeTetrimino, position);
    setNextTetrimino(upcomingTetrimino);
    setIsGrounded(false);

    // Clear lock timer
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, [board, nextTetrimino, setCurrentTetrimino, setNextTetrimino, gameOver]);

  // Lock current tetrimino and spawn new one
  const lockTetrimino = useCallback(() => {
    if (!currentTetrimino) {
      return;
    }

    // Place tetrimino on board
    const newBoard = placeTetriminoOnBoard(
      board,
      currentTetrimino,
      currentPosition,
    );

    playBlockLockSound();
    if (isSpeechSupported) {
      speakCompliment();
    }

    // Check for completed lines
    const completedLines = findCompletedLines(newBoard);

    if (completedLines.length > 0) {
      // Show animation
      setClearingLines(completedLines);
      updateBoard(newBoard);

      // After animation, clear lines and continue
      setTimeout(() => {
        const clearedBoard = clearLines(newBoard, completedLines);
        const earnedScore = calculateScore(completedLines.length, level);
        updateScore(earnedScore, completedLines.length);
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
    board,
    currentTetrimino,
    currentPosition,
    level,
    updateBoard,
    updateScore,
    spawnNewTetrimino,
    playBlockLockSound,
    speakCompliment,
    isSpeechSupported,
  ]);

  // Handle automatic drop
  const handleAutoDrop = useCallback(() => {
    if (status !== 'playing' || !currentTetrimino || isClearingInProgress) {
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
    status,
    currentTetrimino,
    currentPosition,
    board,
    isClearingInProgress,
    isGrounded,
    lockTetrimino,
    moveTetrimino,
  ]);

  // Setup automatic drop timer
  useEffect(() => {
    if (dropTimerRef.current) {
      clearInterval(dropTimerRef.current);
    }

    if (status === 'playing') {
      const interval = isSoftDroppingRef.current
        ? 50
        : getDropInterval(level);
      dropTimerRef.current = setInterval(handleAutoDrop, interval);
    }

    return () => {
      if (dropTimerRef.current) {
        clearInterval(dropTimerRef.current);
      }
    };
  }, [level, status, handleAutoDrop]);

  // Keyboard controls
  const handleMoveLeft = useCallback(() => {
    if (status !== 'playing' || !currentTetrimino) {
      return;
    }

    const moved = tryMove(board, currentTetrimino, currentPosition, 'left');
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
  }, [board, currentPosition, currentTetrimino, status, isGrounded, lockTetrimino, moveTetrimino]);

  const handleMoveRight = useCallback(() => {
    if (status !== 'playing' || !currentTetrimino) {
      return;
    }

    const moved = tryMove(board, currentTetrimino, currentPosition, 'right');
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
  }, [board, currentPosition, currentTetrimino, status, isGrounded, lockTetrimino, moveTetrimino]);

  const handleRotate = useCallback(() => {
    if (status !== 'playing' || !currentTetrimino) {
      return;
    }

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
  }, [board, currentPosition, currentTetrimino, status, isGrounded, lockTetrimino, setCurrentTetrimino]);

  const handleSoftDrop = useCallback(() => {
    if (status !== 'playing' || !currentTetrimino) return;

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
  }, [status, currentTetrimino, currentPosition, board, moveTetrimino, isGrounded, lockTetrimino]);

  const handleSoftDropStart = useCallback(() => {
    isSoftDroppingRef.current = true;
  }, []);

  const handleSoftDropStop = useCallback(() => {
    isSoftDroppingRef.current = false;
  }, []);

  const handlePause = useCallback(() => {
    if (status === 'playing') {
      pauseGame();
    }
    else if (status === 'paused') {
      void initializeAudio('playing');
      resumeGame();
    }
  }, [status, pauseGame, resumeGame, initializeAudio]);

  const handleStart = useCallback(() => {
    generatorRef.current = createRandomGenerator();
    void initializeAudio('playing');
    startGame();
    spawnNewTetrimino();
  }, [startGame, spawnNewTetrimino, initializeAudio]);

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
    enabled: status === 'playing' && !isClearingInProgress,
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
      <div className={styles.haloOrbit} aria-hidden="true" />
      <div className={styles.mainArea}>
        <div className={styles.sidePanel}>
          <NextPiecePreview nextTetrimino={nextTetrimino} />
          <ScorePanel
            score={score}
            level={level}
            lines={lines}
          />
        </div>

        <GameBoard
          board={board}
          currentTetrimino={currentTetrimino}
          currentPosition={currentPosition}
          clearingLines={clearingLines}
        />

        <div className={styles.sidePanel}>
          <ControlPanel
            gameStatus={status}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handlePause}
            onReset={handleReset}
          />
        </div>
      </div>

      <GameOverScreen
        isGameOver={status === 'gameOver'}
        score={score}
        level={level}
        lines={lines}
        onNewGame={handleStart}
      />
    </div>
  );
}
