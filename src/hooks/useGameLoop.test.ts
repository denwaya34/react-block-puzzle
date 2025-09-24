import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGameLoop } from "./useGameLoop";

describe("useGameLoop", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should not run when not started", () => {
    const callback = vi.fn();
    renderHook(() => useGameLoop(callback, 1000));

    vi.advanceTimersByTime(2000);
    expect(callback).not.toHaveBeenCalled();
  });

  it("should run callback at specified interval when started", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useGameLoop(callback, 1000));

    act(() => {
      result.current.start();
    });

    vi.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("should stop running when stopped", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useGameLoop(callback, 1000));

    act(() => {
      result.current.start();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.stop();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2); // Still 2, not 4
  });

  it("should pause and resume correctly", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useGameLoop(callback, 1000));

    act(() => {
      result.current.start();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.pause();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2); // Paused, still 2

    act(() => {
      result.current.resume();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(4); // Resumed, now 4
  });

  it("should track running state", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useGameLoop(callback, 1000));

    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.pause();
    });
    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.resume();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.stop();
    });
    expect(result.current.isRunning).toBe(false);
  });

  it("should handle interval changes", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(
      ({ interval }) => useGameLoop(callback, interval),
      { initialProps: { interval: 1000 } },
    );

    act(() => {
      result.current.start();
    });

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(2);

    // Change interval to 500ms
    rerender({ interval: 500 });
    callback.mockClear();

    vi.advanceTimersByTime(2000);
    expect(callback).toHaveBeenCalledTimes(4); // 2000ms / 500ms = 4
  });
});
