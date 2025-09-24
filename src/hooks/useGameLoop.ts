import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook for managing game loop with start, stop, pause, and resume functionality
 */
export function useGameLoop(callback: () => void, interval: number) {
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
      setIsRunning(true);
    }
  }, [interval, isRunning]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const pause = useCallback(() => {
    if (intervalRef.current && isRunning) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
  }, [isRunning]);

  const resume = useCallback(() => {
    if (!isRunning) {
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
      setIsRunning(true);
    }
  }, [interval, isRunning]);

  // Handle interval changes when running
  useEffect(() => {
    if (isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        callbackRef.current();
      }, interval);
    }
  }, [interval, isRunning]);

  return {
    start,
    stop,
    pause,
    resume,
    isRunning,
  };
}
