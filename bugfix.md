# バグ修正履歴

## 2025-09-24 14:20 ビルドエラー: テストコードの型エラー是正

**ブランチ**: main
**カテゴリ**: ビルドエラー
**修正前の症状**:
- `npm run build` 実行時に `noUnusedLocals` や `Property 'style' does not exist on type 'Element'` などのTypeScriptエラーがテストコードで発生しビルドが停止

**修正内容**:
- src/components/ControlPanel.test.tsx:153 - 未使用の `container` 取得を削除
- src/components/GameBoard.test.tsx:12-85 - `querySelectorAll` の戻り値を `HTMLElement` 型に指定し `style` アクセス時の型エラーを解消
- src/hooks/useGameState.test.ts:5 - 未使用の `TETRIMINOS` インポートを削除
- src/services/collisionDetector.test.ts:10-112 - 未使用の `Board` 型と不要な `position` 変数を削除
- src/services/movementController.test.ts:9-96 - `Tetrimino` 型に適合する数値配列へ修正して型不整合を解消
- src/services/tetriminoGenerator.test.ts:1-8 - 未使用の `vi`, `beforeEach`, `BOARD_WIDTH` を削除
- src/types/board.test.ts:1-12 - 未使用の `Board` インポートを削除

**修正前のコード → 修正後のコード**:
- `const { container, rerender } = render(` → `const { rerender } = render(`
- `container.querySelectorAll(".row")` → `container.querySelectorAll<HTMLElement>(".row")`
- `shape: [[false, true, false], ...]` → `shape: [[0, 1, 0], ...]`

**確認方法**:
- `npm run build`

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

## 2025-09-24 12:52 ビルドエラー: type-only import未使用によるTS1484解消

**ブランチ**: main
**カテゴリ**: ビルドエラー
**修正前の症状**:
- `npm run build` 実行時に `TS1484: '...'' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled` が複数ファイルで発生しビルドが停止

**修正内容**:
- src/components/ControlPanel.tsx:1 - `GameStatus` のインポートを type-only import に変更
- src/hooks/useGameState.ts:4 - `GameState`, `GameStatus` のインポートを type-only import に変更
- src/types/game.ts:1-2 - 型と値のインポートを分離し、型は type-only import へ変更
- src/types/board.test.ts:2 - `Cell`, `Position` を type-only import で読み込みに変更
- src/types/game.test.ts:2-8 - `GameStatus` などの型を type-only import に変更

**修正前のコード → 修正後のコード**:
- `import { GameStatus } from '@/types/game';` → `import type { GameStatus } from '@/types/game';`
- `import { GameState, GameStatus } from '@/types/game';` → `import type { GameState, GameStatus } from '@/types/game';`
- `import { Board, Position, createEmptyBoard } from './board';` → `import { createEmptyBoard } from './board';` / `import type { Board, Position } from './board';`

**確認方法**:
- `npm run build`

## 2025-09-24 12:58 仕様バグ: daisyUIテーマがOS設定に依存

**ブランチ**: main
**カテゴリ**: 仕様バグ
**修正前の症状**:
- daisyUIのテーマがブラウザ/OSのダークモード設定に連動し、ユーザー環境によってライトテーマに切り替わる
- READMEで求められる常時ダーク基調のデザインが維持されない

**修正内容**:
- src/index.css:2 - `@plugin "daisyui"` の設定に `themes: dark --default;` を追加しデフォルトテーマをdarkに固定
- src/index.css:4-17 - `:root` と `[data-theme]` に `color-scheme: dark;` を指定しブラウザの自動ライト化を防止、ライト用の初期色指定を削除

**修正前のコード → 修正後のコード**:
- `@plugin "daisyui";` → `@plugin "daisyui" { themes: dark --default; }`
- `:root { color-scheme: light dark; ... }` → `:root, [data-theme] { color-scheme: dark; ... }`

**確認方法**:
- `npm run build`

## 2025-09-24 13:55 Lintエラー: npm run buildで@typescript-eslintエラーを解消

**ブランチ**: main
**カテゴリ**: Lintエラー
**修正前の症状**:
- npm run build 時に@typescript-eslint/restrict-template-expressionsおよび@typescript-eslint/prefer-nullish-coalescingのエラーが発生

**修正内容**:
- src/components/GameBoard.tsx:16,91 - rowIndexやcolIndexをString()でラップしテンプレートリテラルを安全に文字列化
- src/components/ScorePanel.tsx:45 - progressPercentageをString()でラップ
- src/services/tetriminoGenerator.ts:56 - nullish coalescing代入(??=)を使用

**確認方法**:
- npm run build を実行しエラーが発生しないことを確認

