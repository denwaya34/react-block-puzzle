# バグ修正履歴

## 2025-09-24 00:00 ビルドエラー: Game.tsxのシンタックスミス修正

**ブランチ**: team-d
**カテゴリ**: ビルドエラー
**修正前の症状**:
- `npm run build` 実行時に `src/Game.tsx` で構文エラーが発生
- ビルド時に `Cannot find namespace 'NodeJS'` や未使用インポート警告が多数発生

**修正内容**:
- src/Game.tsx:56-62 - `isGameOver` の判定がコメントアウトされていたため有効化し、JSXコメントをリファクタリング
- src/Game.tsx:360 - `NextPiecePreview` に `gameState.nextTetrimino` を渡すよう修正
- src/Game.tsx:41,45 - `NodeJS.Timeout` 型を `ReturnType<typeof setInterval>` や `ReturnType<typeof setTimeout>` に変更してDOM libと整合を取る
- src/hooks/useGameLoop.ts:8 - 同様に `NodeJS.Timeout` を `ReturnType<typeof setInterval>` に置き換え
- src/hooks/useKeyboardInput.ts:32-33 - タイマー参照型を `ReturnType<typeof setTimeout>` と `ReturnType<typeof setInterval>` に変更
- src/types/board.ts:30 - 未使用の `Tetrimino` インポートを削除
- src/types/tetrimino.ts:105 - 未使用の `Board` インポートを削除

**修正前のコード → 修正後のコード**:
- `setCurrentTetrimino(currentTetrimino, position);` 呼び出し行付近のコメントアウトされた `isGameOver` チェックを復元
- `NextPiecePreview nextTetrimino={null}` → `NextPiecePreview nextTetrimino={gameState.nextTetrimino}`
- `useRef<NodeJS.Timeout | null>` → `useRef<ReturnType<typeof setTimeout> | null>` / `useRef<ReturnType<typeof setInterval> | null>`

**確認方法**:
- `npm run build`

