import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlPanel } from './ControlPanel';

const noop = () => undefined;

describe('ControlPanel', () => {
  it('should show start button when game is idle', () => {
    render(
      <ControlPanel
        gameStatus="idle"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('should show pause button when game is playing', () => {
    render(
      <ControlPanel
        gameStatus="playing"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });

  it('should show resume button when game is paused', () => {
    render(
      <ControlPanel
        gameStatus="paused"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('should show reset button when game is over', () => {
    render(
      <ControlPanel
        gameStatus="gameOver"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('New Game')).toBeInTheDocument();
  });

  it('should call onStart when start button is clicked', () => {
    const onStart = vi.fn();
    render(
      <ControlPanel
        gameStatus="idle"
        onStart={onStart}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    fireEvent.click(screen.getByText('Start Game'));
    expect(onStart).toHaveBeenCalled();
  });

  it('should call onPause when pause button is clicked', () => {
    const onPause = vi.fn();
    render(
      <ControlPanel
        gameStatus="playing"
        onStart={noop}
        onPause={onPause}
        onResume={noop}
        onReset={noop}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Pause' }));
    expect(onPause).toHaveBeenCalled();
  });

  it('should call onResume when resume button is clicked', () => {
    const onResume = vi.fn();
    render(
      <ControlPanel
        gameStatus="paused"
        onStart={noop}
        onPause={noop}
        onResume={onResume}
        onReset={noop}
      />,
    );

    fireEvent.click(screen.getByText('Resume'));
    expect(onResume).toHaveBeenCalled();
  });

  it('should call onReset when reset button is clicked', () => {
    const onReset = vi.fn();
    render(
      <ControlPanel
        gameStatus="playing"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={onReset}
      />,
    );

    fireEvent.click(screen.getByText('Reset'));
    expect(onReset).toHaveBeenCalled();
  });

  it('should always show reset button except in idle state', () => {
    const { rerender } = render(
      <ControlPanel
        gameStatus="playing"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();

    rerender(
      <ControlPanel
        gameStatus="paused"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('should display game status indicator', () => {
    const { rerender } = render(
      <ControlPanel
        gameStatus="playing"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Playing')).toBeInTheDocument();

    rerender(
      <ControlPanel
        gameStatus="paused"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('Paused')).toBeInTheDocument();
  });

  it('should show keyboard shortcuts hint', () => {
    render(
      <ControlPanel
        gameStatus="idle"
        onStart={noop}
        onPause={noop}
        onResume={noop}
        onReset={noop}
      />,
    );

    expect(screen.getByText('ESC')).toBeInTheDocument();
    const pauseLabels = screen.getAllByText('Pause');
    expect(pauseLabels.length).toBeGreaterThan(0);
  });
});
