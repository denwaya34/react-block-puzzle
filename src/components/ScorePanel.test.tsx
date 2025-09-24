import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScorePanel } from './ScorePanel';

describe('ScorePanel', () => {
  it('should display score', () => {
    render(<ScorePanel score={1000} level={1} lines={0} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('should display level', () => {
    render(<ScorePanel score={0} level={5} lines={0} />);

    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should display lines cleared', () => {
    render(<ScorePanel score={0} level={1} lines={42} />);

    expect(screen.getByText('Lines')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should format large scores with commas', () => {
    render(<ScorePanel score={1234567} level={1} lines={0} />);

    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('should display all stats together', () => {
    render(<ScorePanel score={5000} level={3} lines={25} />);

    expect(screen.getByText('5,000')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    render(<ScorePanel score={0} level={1} lines={0} />);

    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Lines')).toBeInTheDocument();
    // Score and Lines both have "0" values
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements.length).toBe(2);
  });

  it('should show level progress bar', () => {
    const { container } = render(<ScorePanel score={0} level={3} lines={25} />);

    const progressBar = container.querySelector('.progressBar');
    expect(progressBar).toBeTruthy();

    const progressFill = container.querySelector('.progressFill');
    expect(progressFill).toBeTruthy();
    // 25 lines, next level at 30, so 50% progress
    expect(progressFill?.getAttribute('style')).toContain('width');
  });

  it('should calculate correct progress percentage', () => {
    const { container } = render(<ScorePanel score={0} level={2} lines={15} />);

    const progressFill = container.querySelector('.progressFill');
    // Level 2 starts at 10 lines, level 3 at 20, so 15 lines = 50% progress
    expect(progressFill?.getAttribute('style')).toContain('50%');
  });

  it('should cap progress at 100% for max level', () => {
    const { container } = render(
      <ScorePanel score={0} level={10} lines={100} />,
    );

    const progressFill = container.querySelector('.progressFill');
    expect(progressFill?.getAttribute('style')).toContain('100%');
  });
});
