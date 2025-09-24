import { useReducer, useCallback } from "react";
import type { Board, Position } from "@/types/board";
import { createEmptyBoard } from "@/types/board";
import { GameState, GameStatus } from "@/types/game";
import {
  type Tetrimino,
  type TetriminoType,
  TETRIMINOS,
  rotateTetrimino,
} from "@/types/tetrimino";
import { isValidPosition, canRotate } from "@/services/collisionDetector";
import { updateLevel } from "@/services/lineClearing";

type GameStateWithPosition = GameState & {
  currentPosition: Position;
  status: GameStatus; // alias for gameStatus for backward compatibility
};

type GameAction =
  | { type: "START_GAME" }
  | { type: "PAUSE_GAME" }
  | { type: "RESUME_GAME" }
  | { type: "GAME_OVER" }
  | { type: "RESET_GAME" }
  | { type: "MOVE_TETRIMINO"; direction: "left" | "right" | "down" }
  | { type: "ROTATE_TETRIMINO" }
  | { type: "UPDATE_SCORE"; score: number; lines: number }
  | { type: "SET_CURRENT_TETRIMINO"; tetrimino: Tetrimino; position: Position }
  | { type: "SET_NEXT_TETRIMINO"; tetrimino: Tetrimino }
  | { type: "UPDATE_BOARD"; board: Board };

const getRandomTetrimino = (): Tetrimino => {
  const types: TetriminoType[] = ["I", "O", "T", "S", "Z", "J", "L"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return TETRIMINOS[randomType];
};

const initialState: GameStateWithPosition = {
  board: createEmptyBoard(),
  currentTetrimino: null,
  nextTetrimino: null,
  score: 0,
  level: 1,
  lines: 0,
  gameStatus: "idle",
  status: "idle", // alias for gameStatus
  currentPosition: { x: 4, y: 0 },
};

function gameReducer(
  state: GameStateWithPosition,
  action: GameAction,
): GameStateWithPosition {
  switch (action.type) {
    case "START_GAME": {
      const currentTetrimino = getRandomTetrimino();
      const nextTetrimino = getRandomTetrimino();
      return {
        ...initialState,
        gameStatus: "playing",
        status: "playing",
        currentTetrimino,
        nextTetrimino,
        currentPosition: { x: 4, y: 0 },
      };
    }

    case "PAUSE_GAME":
      return {
        ...state,
        gameStatus: "paused",
        status: "paused",
      };

    case "RESUME_GAME":
      return {
        ...state,
        gameStatus: "playing",
        status: "playing",
      };

    case "GAME_OVER":
      return {
        ...state,
        gameStatus: "gameOver",
        status: "gameOver",
      };

    case "RESET_GAME":
      return initialState;

    case "MOVE_TETRIMINO": {
      if (!state.currentTetrimino || state.status !== "playing") {
        return state;
      }

      let newPosition = { ...state.currentPosition };

      switch (action.direction) {
        case "left":
          newPosition.x -= 1;
          break;
        case "right":
          newPosition.x += 1;
          break;
        case "down":
          newPosition.y += 1;
          break;
      }

      // Check if the new position is valid
      if (isValidPosition(state.board, state.currentTetrimino, newPosition)) {
        return {
          ...state,
          currentPosition: newPosition,
        };
      }

      return state;
    }

    case "ROTATE_TETRIMINO": {
      if (!state.currentTetrimino || state.status !== "playing") {
        return state;
      }

      // Check if rotation is valid
      if (
        canRotate(state.board, state.currentTetrimino, state.currentPosition)
      ) {
        const rotatedTetrimino = rotateTetrimino(state.currentTetrimino);
        return {
          ...state,
          currentTetrimino: rotatedTetrimino,
        };
      }

      return state;
    }

    case "UPDATE_SCORE": {
      const newLines = state.lines + action.lines;
      const newLevel = updateLevel(state.level, newLines);

      return {
        ...state,
        score: state.score + action.score,
        lines: newLines,
        level: newLevel,
      };
    }

    case "SET_CURRENT_TETRIMINO":
      return {
        ...state,
        currentTetrimino: action.tetrimino,
        currentPosition: action.position,
      };

    case "SET_NEXT_TETRIMINO":
      return {
        ...state,
        nextTetrimino: action.tetrimino,
      };

    case "UPDATE_BOARD":
      return {
        ...state,
        board: action.board,
      };

    default:
      return state;
  }
}

export function useGameState() {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: "PAUSE_GAME" });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: "RESUME_GAME" });
  }, []);

  const gameOver = useCallback(() => {
    dispatch({ type: "GAME_OVER" });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);

  const moveTetrimino = useCallback((direction: "left" | "right" | "down") => {
    dispatch({ type: "MOVE_TETRIMINO", direction });
  }, []);

  const rotateTetrimino = useCallback(() => {
    dispatch({ type: "ROTATE_TETRIMINO" });
  }, []);

  const updateScore = useCallback((score: number, lines: number) => {
    dispatch({ type: "UPDATE_SCORE", score, lines });
  }, []);

  const setCurrentTetrimino = useCallback(
    (tetrimino: Tetrimino, position: Position) => {
      dispatch({ type: "SET_CURRENT_TETRIMINO", tetrimino, position });
    },
    [],
  );

  const setNextTetrimino = useCallback((tetrimino: Tetrimino) => {
    dispatch({ type: "SET_NEXT_TETRIMINO", tetrimino });
  }, []);

  const updateBoard = useCallback((board: Board) => {
    dispatch({ type: "UPDATE_BOARD", board });
  }, []);

  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    gameOver,
    resetGame,
    moveTetrimino,
    rotateTetrimino,
    updateScore,
    setCurrentTetrimino,
    setNextTetrimino,
    updateBoard,
  };
}
