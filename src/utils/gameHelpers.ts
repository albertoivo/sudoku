import { GameMove, CellPosition, CellValue, Difficulty } from '@/types/sudoku';

/**
 * Formats time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsStr = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString();
  return `${minutesStr}:${secondsStr}`;
};

/**
 * Creates a game move object
 */
export const createMove = (
  position: CellPosition,
  previousValue: CellValue,
  newValue: CellValue
): GameMove => ({
  position,
  previousValue,
  newValue,
  timestamp: Date.now()
});

/**
 * Checks if two positions are equal
 */
export const arePositionsEqual = (pos1: CellPosition | null, pos2: CellPosition | null): boolean => {
  if (!pos1 || !pos2) return pos1 === pos2;
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

/**
 * Gets a random integer between min and max (inclusive)
 */
export const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Debounces a function call
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function call
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Gets difficulty color for UI styling
 */
export const getDifficultyColor = (difficulty: Difficulty): string => {
  const colors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-orange-600 bg-orange-100',
    expert: 'text-red-600 bg-red-100'
  };
  
  return colors[difficulty];
};

/**
 * Calculates score based on time, difficulty, and hints used
 */
export const calculateScore = (
  timeElapsed: number,
  difficulty: Difficulty,
  hintsUsed: number
): number => {
  const baseScore = 1000;
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2,
    expert: 3
  };
  
  const timeBonus = Math.max(0, 600 - timeElapsed); // Bonus for solving quickly
  const hintPenalty = hintsUsed * 50; // Penalty for using hints
  
  const score = Math.round(
    baseScore * difficultyMultiplier[difficulty] + timeBonus - hintPenalty
  );
  
  return Math.max(0, score);
};

/**
 * Validates if a value is a valid Sudoku number
 */
export const isValidSudokuNumber = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num >= 1 && num <= 9;
};

/**
 * Creates a conflict key for tracking cell conflicts
 */
export const createConflictKey = (row: number, col: number): string => {
  return `${row}-${col}`;
};

/**
 * Parses a conflict key back to position
 */
export const parseConflictKey = (key: string): CellPosition => {
  const [row, col] = key.split('-').map(Number);
  return { row, col };
};

/**
 * Generates a random puzzle seed
 */
export const generateSeed = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Checks if the device is mobile
 */
export const isMobile = (): boolean => {
  return typeof window !== 'undefined' && window.innerWidth < 768;
};

/**
 * Gets the next cell position for keyboard navigation
 */
export const getNextPosition = (
  current: CellPosition,
  direction: 'up' | 'down' | 'left' | 'right'
): CellPosition => {
  const { row, col } = current;
  
  switch (direction) {
    case 'up':
      return { row: Math.max(0, row - 1), col };
    case 'down':
      return { row: Math.min(8, row + 1), col };
    case 'left':
      return { row, col: Math.max(0, col - 1) };
    case 'right':
      return { row, col: Math.min(8, col + 1) };
    default:
      return current;
  }
};