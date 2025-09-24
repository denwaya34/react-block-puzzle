import type { GameStatus } from '@/types/game';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  gameStatus: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export function ControlPanel({
  gameStatus,
  onStart,
  onPause,
  onResume,
  onReset,
}: ControlPanelProps) {
  const getStatusClass = () => {
    switch (gameStatus) {
      case 'playing':
        return styles.statusPlaying;
      case 'paused':
        return styles.statusPaused;
      case 'gameOver':
        return styles.statusGameOver;
      default:
        return styles.statusIdle;
    }
  };

  const getStatusText = () => {
    switch (gameStatus) {
      case 'playing':
        return 'Playing';
      case 'paused':
        return 'Paused';
      case 'gameOver':
        return 'Game Over';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={styles.controlPanel}>
      <div className={`${styles.status} ${getStatusClass()}`}>
        <span className={`${styles.statusIndicator} ${getStatusClass()}`} />
        <span className={styles.statusText}>{getStatusText()}</span>
      </div>

      <div className={styles.buttons}>
        {gameStatus === 'idle' && (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={onStart}
          >
            Start Game
          </button>
        )}

        {gameStatus === 'playing' && (
          <button
            type="button"
            className={`${styles.button} ${styles.pauseButton}`}
            onClick={onPause}
          >
            Pause
          </button>
        )}

        {gameStatus === 'paused' && (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={onResume}
          >
            Resume
          </button>
        )}

        {gameStatus === 'gameOver' && (
          <button
            type="button"
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={onReset}
          >
            New Game
          </button>
        )}

        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <button
            type="button"
            className={`${styles.button} ${styles.resetButton}`}
            onClick={onReset}
          >
            Reset
          </button>
        )}
      </div>

      <div className={styles.shortcuts}>
        <div className={styles.shortcutItem}>
          <span className={styles.key}>ESC</span>
          <span className={styles.keyLabel}>Pause</span>
        </div>
        <div className={styles.shortcutItem}>
          <span className={styles.key}>←→</span>
          <span className={styles.keyLabel}>Move</span>
        </div>
        <div className={styles.shortcutItem}>
          <span className={styles.key}>↑</span>
          <span className={styles.keyLabel}>Rotate</span>
        </div>
        <div className={styles.shortcutItem}>
          <span className={styles.key}>↓</span>
          <span className={styles.keyLabel}>Soft Drop</span>
        </div>
      </div>
    </div>
  );
}
