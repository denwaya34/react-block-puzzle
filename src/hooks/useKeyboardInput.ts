import { useEffect, useRef, useCallback } from "react";

export interface KeyboardInputOptions {
  enabled?: boolean;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onSoftDrop?: () => void;
  onSoftDropStart?: () => void;
  onSoftDropStop?: () => void;
  onRotate?: () => void;
  onPause?: () => void;
  repeatDelay?: number;
  repeatInterval?: number;
}

const GAME_KEYS = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "Escape"];

export function useKeyboardInput(options: KeyboardInputOptions = {}) {
  const {
    enabled = true,
    onMoveLeft,
    onMoveRight,
    onSoftDrop,
    onSoftDropStart,
    onSoftDropStop,
    onRotate,
    onPause,
    repeatDelay = 100,
    repeatInterval = 30,
  } = options;

  const repeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());

  const stopRepeat = useCallback(() => {
    if (repeatTimerRef.current) {
      clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    if (intervalTimerRef.current) {
      clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
  }, []);

  const startRepeat = useCallback(
    (callback: () => void) => {
      callback(); // Initial call

      repeatTimerRef.current = setTimeout(() => {
        intervalTimerRef.current = setInterval(callback, repeatInterval);
      }, repeatDelay);
    },
    [repeatDelay, repeatInterval],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const key = event.key;

      // Prevent default for game keys
      if (GAME_KEYS.includes(key)) {
        event.preventDefault();
      }

      // Prevent repeat events from browser
      if (pressedKeysRef.current.has(key)) {
        return;
      }

      pressedKeysRef.current.add(key);

      switch (key) {
        case "ArrowLeft":
          if (onMoveLeft) {
            startRepeat(onMoveLeft);
          }
          break;

        case "ArrowRight":
          if (onMoveRight) {
            startRepeat(onMoveRight);
          }
          break;

        case "ArrowDown":
          if (onSoftDropStart) {
            onSoftDropStart();
          }
          if (onSoftDrop) {
            startRepeat(onSoftDrop);
          }
          break;

        case "ArrowUp":
          onRotate?.();
          break;

        case "Escape": // Bug: no handler
          onPause?.();
          break;
      }
    },
    [
      enabled,
      onMoveLeft,
      onMoveRight,
      onSoftDrop,
      onSoftDropStart,
      onRotate,
      onPause,
      startRepeat,
    ],
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      pressedKeysRef.current.delete(key);

      switch (key) {
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowDown":
          stopRepeat();
          if (key === "ArrowDown" && onSoftDropStop) {
            onSoftDropStop();
          }
          break;
      }
    },
    [onSoftDropStop, stopRepeat],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      stopRepeat();
    };
  }, [handleKeyDown, handleKeyUp, stopRepeat]);

  // Clean up on disable
  useEffect(() => {
    if (!enabled) {
      stopRepeat();
      pressedKeysRef.current.clear();
    }
  }, [enabled, stopRepeat]);
}
