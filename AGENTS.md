# AGENTS.md

## Project Overview

React Block Puzzle - A classic block puzzle game implementation for educational purposes. This project includes intentional bugs across 10 team branches for learning debugging and problem-solving skills.

**Important**: Avoid using "Tetris" terminology due to copyright concerns. Use "block puzzle" or similar alternatives.

## Setup Commands

```bash
# Install dependencies (requires pnpm 10.16.1)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run linter
pnpm lint

# Fix linting issues
pnpm lint --fix

# Type checking
pnpm tsc --noEmit

# Run tests
pnpm test

# Preview production build
pnpm preview
```

## Development Environment

### Prerequisites
- Node.js LTS/22 (managed by mise)
- pnpm 10.16.1 (managed by mise)

### Environment Setup
```bash
# Install mise if not already installed
curl https://mise.run | sh

# Trust project configuration and install tools
mise trust
mise install

# Verify setup
mise list
```

## Code Style

- **Language**: TypeScript with strict mode
- **Framework**: React 19 with functional components and hooks
- **Styling**: CSS Modules (*.module.css)
- **Imports**: Use absolute imports with @/ prefix
- **File naming**:
  - Components: PascalCase (e.g., GameBoard.tsx)
  - Hooks: camelCase with 'use' prefix (e.g., useGameState.ts)
  - Services: camelCase (e.g., collisionDetector.ts)

## Project Structure

```
src/
├── components/     # React components
├── hooks/          # Custom React hooks
├── services/       # Game logic and utilities
├── types/          # TypeScript type definitions
└── Game.tsx        # Main game component

.cursor/rules/      # Cursor AI assistant rules
```

## Testing Instructions

### For Educational Bug Practice

This project contains 10 team branches (team-a through team-j), each with:
- 1 Build error
- 1 Lint error
- 3 Specification bugs

To practice debugging:

```bash
# Switch to a team branch
git checkout team-a

# Check build errors
pnpm build

# Check lint errors
pnpm lint

# Check specification bugs (compare with README.md)
pnpm dev
# Then test the game functionality
```

### Bug Categories

1. **Build Errors**: TypeScript type mismatches, missing properties, incorrect return types
2. **Lint Errors**: Unused variables, any types, == vs ===, missing dependencies
3. **Specification Bugs**: Game behavior not matching README.md specifications

## Cursor Rules

This project includes Cursor-specific rules in `.cursor/rules/`:

- `bug-tracking.md` - Always active, tracks all bug fixes in bugfix.md
- `lint-fix.md` - Manual command: `/lint-fix` for fixing lint errors
- `build-fix.md` - Manual command: `/build-fix` for fixing build errors
- `spec-fix.md` - Manual command: `/spec-fix` for fixing specification bugs

## Security Considerations

- Never use the trademarked term "Tetris" in code, comments, or documentation
- Use generic terms: "block puzzle", "falling blocks", "tetrimino" (generic geometric term)

## PR Instructions

### Branch Naming
- Feature: `feature/description`
- Bug fix: `fix/issue-description`
- Team practice: `team-[a-j]` (for educational branches)

### Commit Messages
```
type: description

- Detailed change 1
- Detailed change 2

Fixes #issue-number (if applicable)
```

Types: feat, fix, refactor, docs, test, style, chore

### Before Committing
1. Run `pnpm lint` and fix any issues
2. Run `pnpm build` to ensure no type errors
3. Run `pnpm dev` and verify game functionality
4. Update `bugfix.md` if fixing bugs (automatic with bug-tracking rule)

## Game Specifications

### Controls
- **←/→**: Move left/right
- **↑**: Rotate clockwise (90°)
- **↓**: Soft drop (faster descent)
- **Escape**: Pause/Resume

### Scoring System
- 1 line: 100 × level
- 2 lines: 300 × level
- 3 lines: 500 × level
- 4 lines: 800 × level

### Levels
- Start at level 1
- Advance every 10 lines cleared
- Maximum level: 10
- Drop speed increases with level

## Common Issues and Solutions

### Build Errors
- Check `src/types/tetrimino.ts` for TetriminoType definition
- Verify all component props match their interfaces
- Ensure function return types are correct

### Lint Errors
- Remove unused variables or add to dependency arrays
- Replace `any` with proper types
- Use `===` instead of `==`
- Check React hook dependency arrays

### Game Not Working
- Verify all event handlers are connected
- Check game state management in `useGameState` hook
- Ensure collision detection is working properly
- Verify line clearing logic in `lineClearing.ts`

## Additional Context

This is an educational project designed for learning:
- React and TypeScript best practices
- Debugging techniques
- Code review skills
- Team collaboration

Each team branch represents a different debugging scenario. After fixing bugs, document your solutions in `bugfix.md` for future reference and team learning.

## Related Documentation

- `README.md` - User-facing documentation and game specifications