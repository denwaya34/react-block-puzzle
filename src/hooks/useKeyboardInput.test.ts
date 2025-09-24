import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardInput } from './useKeyboardInput';

describe('useKeyboardInput', () => {
  let keydownHandler: ((event: KeyboardEvent) => void) | null = null;
  let keyupHandler: ((event: KeyboardEvent) => void) | null = null;

  beforeEach(() => {
    // Mock addEventListener
    vi.spyOn(window, 'addEventListener').mockImplementation(
      (event, handler) => {
        if (event === 'keydown') {
          keydownHandler = handler as (event: KeyboardEvent) => void;
        }
        else if (event === 'keyup') {
          keyupHandler = handler as (event: KeyboardEvent) => void;
        }
      },
    );

    // Mock removeEventListener
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    keydownHandler = null;
    keyupHandler = null;
  });

  it('should register event listeners on mount', () => {
    renderHook(() => {
      useKeyboardInput();
    });

    expect(window.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
    );
  });

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => {
      useKeyboardInput();
    });

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'keyup',
      expect.any(Function),
    );
  });

  it('should handle left arrow key', () => {
    const onMoveLeft = vi.fn();
    renderHook(() => {
      useKeyboardInput({
        onMoveLeft,
        enabled: true,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(onMoveLeft).toHaveBeenCalled();
  });

  it('should handle right arrow key', () => {
    const onMoveRight = vi.fn();
    renderHook(() => {
      useKeyboardInput({
        onMoveRight,
        enabled: true,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });

    expect(onMoveRight).toHaveBeenCalled();
  });

  it('should handle down arrow key for soft drop', () => {
    const onSoftDrop = vi.fn();
    renderHook(() => {
      useKeyboardInput({
        onSoftDrop,
        enabled: true,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    expect(onSoftDrop).toHaveBeenCalled();
  });

  it('should handle up arrow key for rotation', () => {
    const onRotate = vi.fn();
    renderHook(() => {
      useKeyboardInput({
        onRotate,
        enabled: true,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    expect(onRotate).toHaveBeenCalled();
  });

  it('should handle Escape key for pause', () => {
    const onPause = vi.fn();
    renderHook(() => {
      useKeyboardInput({
        onPause,
        enabled: true,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(onPause).toHaveBeenCalled();
  });

  it('should not trigger callbacks when disabled', () => {
    const onMoveLeft = vi.fn();
    const onMoveRight = vi.fn();
    const onRotate = vi.fn();

    renderHook(() => {
      useKeyboardInput({
        onMoveLeft,
        onMoveRight,
        onRotate,
        enabled: false,
      });
    },
    );

    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    });

    expect(onMoveLeft).not.toHaveBeenCalled();
    expect(onMoveRight).not.toHaveBeenCalled();
    expect(onRotate).not.toHaveBeenCalled();
  });

  it('should handle key repeat for movement', () => {
    vi.useFakeTimers();
    const onMoveLeft = vi.fn();

    renderHook(() => {
      useKeyboardInput({
        onMoveLeft,
        enabled: true,
        repeatDelay: 300,
        repeatInterval: 50,
      });
    },
    );

    // Press and hold left arrow
    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });

    expect(onMoveLeft).toHaveBeenCalledTimes(1);

    // Wait for repeat delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should start repeating
    act(() => {
      vi.advanceTimersByTime(150); // 3 intervals of 50ms
    });

    expect(onMoveLeft).toHaveBeenCalledTimes(4); // 1 initial + 3 repeats

    // Release key
    act(() => {
      keyupHandler?.(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
    });

    // Should stop repeating
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onMoveLeft).toHaveBeenCalledTimes(4); // No more calls

    vi.useRealTimers();
  });

  it('should stop soft drop on key release', () => {
    const onSoftDropStart = vi.fn();
    const onSoftDropStop = vi.fn();

    renderHook(() => {
      useKeyboardInput({
        onSoftDropStart,
        onSoftDropStop,
        enabled: true,
      });
    },
    );

    // Press down arrow
    act(() => {
      keydownHandler?.(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    });

    expect(onSoftDropStart).toHaveBeenCalled();

    // Release down arrow
    act(() => {
      keyupHandler?.(new KeyboardEvent('keyup', { key: 'ArrowDown' }));
    });

    expect(onSoftDropStop).toHaveBeenCalled();
  });

  it('should prevent default behavior for game keys', () => {
    renderHook(() => {
      useKeyboardInput({
        enabled: true,
      });
    },
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    act(() => {
      keydownHandler?.(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
