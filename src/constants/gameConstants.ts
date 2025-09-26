import { Difficulty, DifficultyConfig } from '@/types/sudoku';

// Game constants
export const SUDOKU_SIZE = 9;
export const EMPTY_CELL = 0;
export const BOX_SIZE = 3;

// Difficulty configurations
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    name: 'easy',
    label: 'Easy',
    clues: 45,
    maxHints: 5,
    description: 'Perfect for beginners'
  },
  medium: {
    name: 'medium',
    label: 'Medium',
    clues: 35,
    maxHints: 3,
    description: 'Moderate challenge'
  },
  hard: {
    name: 'hard',
    label: 'Hard',
    clues: 28,
    maxHints: 2,
    description: 'For experienced players'
  },
  expert: {
    name: 'expert',
    label: 'Expert',
    clues: 22,
    maxHints: 1,
    description: 'Ultimate challenge'
  }
};

// Valid numbers for Sudoku
export const VALID_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

// CSS class names
export const CELL_CLASSES = {
  base: 'w-12 h-12 border border-gray-300 text-center text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
  empty: 'bg-white hover:bg-gray-50',
  filled: 'bg-gray-100',
  prefilled: 'bg-gray-200 text-gray-800 cursor-not-allowed',
  selected: 'bg-blue-100 border-blue-500',
  conflict: 'bg-red-100 text-red-600 border-red-400',
  hint: 'bg-green-100 text-green-600 border-green-400'
} as const;

// Animation durations
export const ANIMATION_DURATIONS = {
  fast: 150,
  normal: 300,
  slow: 500
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  gameState: 'sudoku-game-state',
  gameStats: 'sudoku-game-stats',
  settings: 'sudoku-settings'
} as const;