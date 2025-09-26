// Sudoku game types and interfaces

export type SudokuNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type CellValue = SudokuNumber | 0; // 0 represents empty cell
export type SudokuGrid = CellValue[][];

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface CellPosition {
  row: number;
  col: number;
}

export interface GameMove {
  position: CellPosition;
  previousValue: CellValue;
  newValue: CellValue;
  timestamp: number;
}

export interface GameState {
  grid: SudokuGrid;
  solution: SudokuGrid;
  initialGrid: SudokuGrid;
  selectedCell: CellPosition | null;
  conflicts: Set<string>;
  difficulty: Difficulty;
  timeElapsed: number;
  isComplete: boolean;
  moves: GameMove[];
  hintsUsed: number;
  maxHints: number;
  hintCells: Set<string>; // Tracks cells filled by hints
  incorrectCells: Set<string>; // Tracks cells marked as incorrect
}

export interface SudokuCellProps {
  value: CellValue;
  isSelected: boolean;
  isPrefilled: boolean;
  hasConflict: boolean;
  position: CellPosition;
  onSelect: (position: CellPosition) => void;
  onChange: (position: CellPosition, value: CellValue) => void;
}

export interface SudokuBoardProps {
  grid: SudokuGrid;
  selectedCell: CellPosition | null;
  onCellSelect: (position: CellPosition) => void;
  onCellChange: (position: CellPosition, value: CellValue) => void;
  conflicts: Set<string>;
  initialGrid: SudokuGrid;
  hintCells: Set<string>; // Cells filled by hints
  incorrectCells: Set<string>; // Cells marked as incorrect
}

export interface GameControlsProps {
  onNewGame: (difficulty: Difficulty) => void;
  onCheckSolution: () => void;
  onHint: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hintsRemaining: number;
  difficulty: Difficulty;
}

export interface TimerProps {
  timeElapsed: number;
  isRunning: boolean;
}

export interface DifficultyConfig {
  name: Difficulty;
  label: string;
  clues: number;
  maxHints: number;
  description: string;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  bestTimes: Record<Difficulty, number>;
  totalPlayTime: number;
  hintsUsed: number;
}

// Utility types
export type ConflictKey = `${number}-${number}`;

export interface ValidationResult {
  isValid: boolean;
  conflicts: Set<ConflictKey>;
}

// Hook return types
export interface UseSudokuReturn {
  gameState: GameState;
  newGame: (difficulty: Difficulty) => void;
  selectCell: (position: CellPosition) => void;
  updateCell: (position: CellPosition, value: CellValue) => void;
  checkSolution: () => ValidationResult;
  getHint: () => boolean;
  undo: () => boolean;
  redo: () => boolean;
  isGameComplete: () => boolean;
}

export interface UseTimerReturn {
  timeElapsed: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
  formatTime: (seconds: number) => string;
}

export interface UseLocalStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
}