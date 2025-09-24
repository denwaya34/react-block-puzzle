import styles from './GameOverScreen.module.css';

interface GameOverScreenProps {
  isGameOver: boolean;
  score: number;
  level: number;
  lines: number;
  onNewGame: () => void;
}

export function GameOverScreen({
  isGameOver,
  score,
  level,
  lines,
  onNewGame,
}: GameOverScreenProps) {
  if (!isGameOver) {
    return null;
  }

  const formatScore = (value: number): string => {
    return value.toLocaleString();
  };

  return (
    <div className={`${styles.overlay} overlay`}>
      <div className={`${styles.content} content`}>
        <h1 className={styles.title}>Game Over</h1>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Final Score</div>
            <div className={styles.statValue}>{formatScore(score)}</div>
          </div>

          <div className={styles.statRow}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Level</div>
              <div className={styles.statValue}>{level}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Lines</div>
              <div className={styles.statValue}>{lines}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.newGameButton}
          onClick={onNewGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
