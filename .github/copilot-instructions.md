# Copilot Instructions for Sudoku App Development

## Project Overview
You are helping to build a modern Sudoku puzzle game using React, Next.js, and ES6+ best practices. The application should provide an interactive, responsive, and accessible Sudoku playing experience.

## Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Frontend**: React 18+ with TypeScript
- **Styling**: Tailwind CSS or CSS Modules
- **Language**: ES6+ with modern JavaScript features
- **State Management**: React hooks (useState, useEffect, useReducer)
- **Testing**: Jest + React Testing Library

## Code Standards and Best Practices

### ES6+ Features to Use
- Arrow functions for cleaner syntax
- Template literals for string interpolation
- Destructuring assignment for objects and arrays
- Spread operator and rest parameters
- Async/await for asynchronous operations
- Modules (import/export)
- Classes and modern OOP patterns
- Optional chaining (?.) and nullish coalescing (??)
- Array methods: map, filter, reduce, forEach, find, some, every

### React Best Practices
- Use functional components exclusively
- Implement proper hooks (useState, useEffect, useMemo, useCallback)
- Follow component composition patterns
- Use prop destructuring and default values
- Implement proper error boundaries
- Use React.memo for performance optimization when needed
- Follow the principle of single responsibility for components

### Next.js Specific Guidelines
- Use App Router (app/ directory structure)
- Implement proper SEO with metadata API
- Use Next.js Image component for optimized images
- Leverage server and client components appropriately
- Implement proper routing with page.tsx files
- Use loading.tsx and error.tsx for better UX

### File Structure
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── favicon.ico
├── components/
│   ├── sudoku/
│   │   ├── SudokuBoard.tsx
│   │   ├── SudokuCell.tsx
│   │   ├── NumberPad.tsx
│   │   └── GameControls.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── Timer.tsx
├── hooks/
│   ├── useSudoku.ts
│   ├── useTimer.ts
│   └── useLocalStorage.ts
├── utils/
│   ├── sudokuGenerator.ts
│   ├── sudokuValidator.ts
│   └── gameHelpers.ts
├── types/
│   └── sudoku.ts
└── constants/
    └── gameConstants.ts
```

## Core Functionality Requirements

### Sudoku Game Features
1. **Grid Generation**: Generate valid 9x9 Sudoku puzzles
2. **Difficulty Levels**: Easy, Medium, Hard, Expert
3. **Input Methods**: Click + number pad, keyboard input
4. **Validation**: Real-time conflict detection
5. **Hints System**: Provide hints when requested
6. **Timer**: Track solving time
7. **Save/Load**: Persist game state
8. **Undo/Redo**: Action history management

### UI/UX Requirements
- Responsive design (mobile-first approach)
- Dark/light theme support
- Accessibility compliance (WCAG 2.1)
- Smooth animations and transitions
- Keyboard navigation support
- Touch-friendly interactions

## Component Guidelines

### SudokuBoard Component
```typescript
interface SudokuBoardProps {
  grid: number[][];
  selectedCell: [number, number] | null;
  onCellSelect: (row: number, col: number) => void;
  conflicts: Set<string>;
  isComplete: boolean;
}
```

### Game State Management
```typescript
interface GameState {
  grid: number[][];
  solution: number[][];
  initialGrid: number[][];
  selectedCell: [number, number] | null;
  conflicts: Set<string>;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  timeElapsed: number;
  isComplete: boolean;
  moves: Move[];
}
```

## Coding Guidelines

### Function Naming
- Use descriptive, verb-based names: `validateMove`, `generatePuzzle`, `checkConflicts`
- Use camelCase for functions and variables
- Use PascalCase for components and types
- Use UPPER_SNAKE_CASE for constants

### Error Handling
- Implement proper try-catch blocks for async operations
- Use error boundaries for React component errors
- Provide meaningful error messages to users
- Log errors appropriately for debugging

### Performance Optimization
- Use `useCallback` for event handlers passed to child components
- Use `useMemo` for expensive calculations
- Implement proper memoization for game validation functions
- Use React.lazy for code splitting when appropriate

### TypeScript Usage
- Define proper interfaces for all data structures
- Use union types for game states and difficulties
- Implement proper type guards where needed
- Use generic types for reusable utilities

## Testing Strategy
- Write unit tests for utility functions (validation, generation)
- Test React components with React Testing Library
- Test user interactions and game flow
- Implement integration tests for complete game scenarios
- Aim for >80% test coverage

## Accessibility Requirements
- Implement proper ARIA labels and roles
- Support keyboard navigation (arrow keys, tab)
- Provide screen reader announcements for game state changes
- Use sufficient color contrast ratios
- Support high contrast mode

## Performance Considerations
- Optimize re-renders with proper dependency arrays
- Use efficient algorithms for Sudoku generation and validation
- Implement virtual scrolling if needed for large components
- Minimize bundle size with proper tree shaking

## Code Review Checklist
- [ ] ES6+ features used appropriately
- [ ] Components are properly typed with TypeScript
- [ ] Accessibility standards met
- [ ] Performance optimizations implemented
- [ ] Error handling in place
- [ ] Tests written and passing
- [ ] Code follows naming conventions
- [ ] Responsive design implemented

## Additional Notes
- Prioritize code readability and maintainability
- Use semantic HTML elements
- Implement proper loading states
- Consider PWA features for offline play
- Follow React and Next.js official documentation guidelines
- Keep components small and focused on single responsibilities
