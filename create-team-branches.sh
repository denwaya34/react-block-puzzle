#!/bin/bash

# team-d: 循環依存エラー、React Hook依存配列の欠落、Escapeキーが効かない、次のピース表示されない、ゲームオーバーにならない
git checkout -b team-d 65e2539
echo 'import { Board } from "./board";' >> src/types/tetrimino.ts
echo 'import { Tetrimino } from "./tetrimino";' >> src/types/board.ts
sed -i '' 's/}, \[gameState.status, gameState.level, handleAutoDrop\]);/}, [gameState.status, handleAutoDrop]); \/\/ Bug: missing dependency/' src/Game.tsx
sed -i '' 's/case "Escape":/case "Escape": \/\/ Bug: no handler/' src/hooks/useKeyboardInput.ts
sed -i '' 's/<NextPiecePreview nextTetrimino={gameState.nextTetrimino}/<NextPiecePreview nextTetrimino={null} \/\/ Bug: no preview/' src/Game.tsx
sed -i '' 's/if (isGameOver/\/\/ if (isGameOver \/\/ Bug: no game over check/' src/Game.tsx
git add -A && git commit -m "feat(team-d): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-e: モジュール解決エラー、import文の順序違反、ポーズから復帰できない、リセットボタンが効かない、自動落下しない
git checkout -b team-e 65e2539
echo 'import { NonExistent } from "@/components/NonExistent";' >> src/Game.tsx
sed -i '' '1s/^/import styles from ".\/GameBoard.module.css";\n/' src/components/GameBoard.tsx
sed -i '' 's/onClick={onResume}/onClick={onPause} \/\/ Bug: wrong handler/' src/components/ControlPanel.tsx
sed -i '' 's/resetGame();/\/\/ resetGame(); \/\/ Bug: no reset/' src/Game.tsx
sed -i '' 's/dropTimerRef.current = setInterval/\/\/ dropTimerRef.current = setInterval \/\/ Bug: no auto drop/' src/Game.tsx
git add -A && git commit -m "feat(team-e): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-f: 型の不一致、未使用変数、ラインが消えない、左右キーが逆、同じテトリミノしか出ない
git checkout -b team-f 65e2539
sed -i '' 's/"I" | //' src/types/tetrimino.ts
echo 'const unusedDebugFlag = true; // Bug: unused variable' >> src/Game.tsx
sed -i '' 's/setClearingLines(completedLines);/\/\/ setClearingLines(completedLines); \/\/ Bug: no line clear/' src/Game.tsx
sed -i '' 's/onMoveLeft/temp/g; s/onMoveRight/onMoveLeft/g; s/temp/onMoveRight/g' src/hooks/useKeyboardInput.ts
sed -i '' 's/return TETRIMINOS\[types\[index\]\];/return TETRIMINOS.O; \/\/ Bug: always O/' src/services/tetriminoGenerator.ts
git add -A && git commit -m "feat(team-f): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-g: プロパティ欠落、any型、スコア更新されない、初期位置間違い、ゲーム開始ボタン効かない
git checkout -b team-g 65e2539
sed -i '' 's/lines: number;/\/\/ lines: number; \/\/ Bug: missing prop/' src/components/ScorePanel.tsx
sed -i '' 's/(): Tetrimino/(data?: any): Tetrimino \/\/ Bug: any type/' src/hooks/useGameState.ts
sed -i '' 's/score: state.score + action.score/score: state.score \/\/ Bug: no score update/' src/hooks/useGameState.ts
sed -i '' 's/y: 0,/y: 2, \/\/ Bug: wrong position/' src/services/tetriminoGenerator.ts
sed -i '' 's/onClick={onStart}/\/\/ onClick={onStart} Bug: no handler/' src/components/ControlPanel.tsx
git add -A && git commit -m "feat(team-g): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-h: 戻り値型エラー、==使用、回転方向逆、ボードサイズ19、レベル上がらない
git checkout -b team-h 65e2539
sed -i '' 's/): number {/): string { \/\/ Bug: wrong return type/' src/services/lineClearing.ts
sed -i '' 's/return score \* level;/return String(score * level);/' src/services/lineClearing.ts
sed -i '' 's/=== BOARD_WIDTH/== BOARD_WIDTH \/\/ Bug: == instead of ===/' src/services/collisionDetector.ts
sed -i '' 's/row.slice().reverse()/row.slice() \/\/ Bug: wrong rotation/' src/types/tetrimino.ts
sed -i '' 's/BOARD_HEIGHT = 20/BOARD_HEIGHT = 19 \/\/ Bug: wrong height/' src/types/board.ts
sed -i '' 's/level: newLevel/\/\/ level: newLevel Bug: no level up/' src/hooks/useGameState.ts
git add -A && git commit -m "feat(team-h): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-i: 循環依存、Hook依存欠落、Escapeキー効かない、次のピース表示されない、ゲームオーバーにならない
git checkout -b team-i 65e2539
echo 'import { Board } from "./board"; // Bug: circular' >> src/types/tetrimino.ts
echo 'import { Tetrimino } from "./tetrimino"; // Bug: circular' >> src/types/board.ts
sed -i '' 's/\[gameState, moveTetrimino\]/[moveTetrimino] \/\/ Bug: missing deps/' src/Game.tsx
sed -i '' 's/onPause?.();/\/\/ onPause?.(); \/\/ Bug: no pause/' src/hooks/useKeyboardInput.ts
sed -i '' 's/{gameState.nextTetrimino}/{null} \/\/ Bug: no preview/' src/Game.tsx
sed -i '' 's/gameOver();/\/\/ gameOver(); \/\/ Bug: no game over/' src/Game.tsx
git add -A && git commit -m "feat(team-i): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

# team-j: モジュール解決、import順序、ポーズから復帰できない、リセット効かない、自動落下しない
git checkout -b team-j 65e2539
echo 'import { FakeComponent } from "@/components/Fake"; // Bug: not found' >> src/Game.tsx
sed -i '' '1s/^/import ".\/styles.css";\n/' src/components/ScorePanel.tsx
sed -i '' 's/onResume}/onPause} \/\/ Bug: wrong handler/' src/components/ControlPanel.tsx
sed -i '' 's/resetGame();/\/\/ resetGame(); \/\/ Bug: no reset/' src/Game.tsx
sed -i '' 's/setInterval(handleAutoDrop/\/\/ setInterval(handleAutoDrop \/\/ Bug: no drop/' src/Game.tsx
git add -A && git commit -m "feat(team-j): 学習用バグを仕込む - ビルドエラー1件、Lintエラー1件、仕様バグ3件"

echo "All team branches created successfully!"
git checkout main
git branch | grep team-