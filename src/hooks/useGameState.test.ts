import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameState } from './useGameState';
import { createEmptyBoard } from '@/types/board';

describe('useGameState', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.gameState.status).toBe('idle');
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.level).toBe(1);
    expect(result.current.gameState.lines).toBe(0);
    expect(result.current.gameState.board).toEqual(createEmptyBoard());
    expect(result.current.gameState.currentTetrimino).toBeNull();
    expect(result.current.gameState.nextTetrimino).toBeNull();
  });

  it('should start game when startGame is called', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.gameState.status).toBe('playing');
    expect(result.current.gameState.currentTetrimino).not.toBeNull();
    expect(result.current.gameState.nextTetrimino).not.toBeNull();
    expect(result.current.gameState.currentPosition).toEqual({ x: 4, y: 0 });
  });

  it('should pause game when pauseGame is called', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.pauseGame();
    });

    expect(result.current.gameState.status).toBe('paused');
  });

  it('should resume game when resumeGame is called', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.pauseGame();
    });

    act(() => {
      result.current.resumeGame();
    });

    expect(result.current.gameState.status).toBe('playing');
  });

  it('should reset game when resetGame is called', () => {
    const { result } = renderHook(() => useGameState());

    // Start and modify game state
    act(() => {
      result.current.startGame();
    });

    // Reset game
    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState.status).toBe('idle');
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.level).toBe(1);
    expect(result.current.gameState.lines).toBe(0);
    expect(result.current.gameState.board).toEqual(createEmptyBoard());
    expect(result.current.gameState.currentTetrimino).toBeNull();
    expect(result.current.gameState.nextTetrimino).toBeNull();
  });

  it('should set game over when gameOver is called', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.gameOver();
    });

    expect(result.current.gameState.status).toBe('gameOver');
  });

  it('should move tetrimino left', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    const initialX = result.current.gameState.currentPosition.x;

    act(() => {
      result.current.moveTetrimino('left');
    });

    expect(result.current.gameState.currentPosition.x).toBe(initialX - 1);
  });

  it('should move tetrimino right', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    const initialX = result.current.gameState.currentPosition.x;

    act(() => {
      result.current.moveTetrimino('right');
    });

    expect(result.current.gameState.currentPosition.x).toBe(initialX + 1);
  });

  it('should move tetrimino down', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    const initialY = result.current.gameState.currentPosition.y;

    act(() => {
      result.current.moveTetrimino('down');
    });

    expect(result.current.gameState.currentPosition.y).toBe(initialY + 1);
  });

  it('should rotate tetrimino', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    const initialShape = result.current.gameState.currentTetrimino?.shape;

    act(() => {
      result.current.rotateTetrimino();
    });

    // For most tetriminos (except O), the shape should change after rotation
    if (result.current.gameState.currentTetrimino?.type !== 'O') {
      expect(result.current.gameState.currentTetrimino?.shape).not.toEqual(
        initialShape,
      );
    }
  });

  it('should update score and lines when clearing lines', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    act(() => {
      result.current.updateScore(100, 1);
    });

    expect(result.current.gameState.score).toBe(100);
    expect(result.current.gameState.lines).toBe(1);
  });

  it('should update level based on lines cleared', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    // Clear 10 lines to level up
    act(() => {
      result.current.updateScore(1000, 10);
    });

    expect(result.current.gameState.level).toBe(2);
  });
});
