import React from 'react';
import styles from './ScorePanel.module.css';

interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
}

export const ScorePanel = React.memo(function ScorePanel({
  score,
  level,
  lines,
}: ScorePanelProps) {
  // Format score with thousands separator
  const formatScore = React.useCallback((value: number): string => {
    return value.toLocaleString();
  }, []);

  // Calculate level progress (lines needed for next level)
  const progressPercentage = React.useMemo(() => {
    if (level >= 10) return 100; // Max level

    const linesForCurrentLevel = (level - 1) * 10;
    const linesForNextLevel = level * 10;
    const linesInCurrentLevel = lines - linesForCurrentLevel;
    const linesNeededForLevel = linesForNextLevel - linesForCurrentLevel;

    return Math.min(100, (linesInCurrentLevel / linesNeededForLevel) * 100);
  }, [level, lines]);

  return (
    <div className={styles.scorePanel}>
      <span className={styles.headerGlow} aria-hidden="true" />
      <div className={styles.statBlock}>
        <div className={styles.label}>Score</div>
        <div className={styles.value}>{formatScore(score)}</div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.label}>Level</div>
        <div className={styles.value}>
          {level}
          <span className={styles.valueShadow}>lvl</span>
        </div>
        <div className={`${styles.progressBar} progressBar`}>
          <div
            className={`${styles.progressFill} progressFill`}
            style={{ width: `${String(progressPercentage)}%` }}
          />
        </div>
      </div>

      <div className={styles.statBlock}>
        <div className={styles.label}>Lines</div>
        <div className={styles.value}>
          {lines}
          <span className={styles.valueShadow}>cleared</span>
        </div>
      </div>
    </div>
  );
});
