import { SudokuGrid, CellValue, CellPosition, ValidationResult, ConflictKey } from '@/types/sudoku';
import { SUDOKU_SIZE, EMPTY_CELL, BOX_SIZE } from '@/constants/gameConstants';

/**
 * Creates an empty 9x9 Sudoku board
 */
export const createEmptyBoard = (): SudokuGrid => {
  return Array.from({ length: SUDOKU_SIZE }, () => 
    Array.from({ length: SUDOKU_SIZE }, () => EMPTY_CELL)
  );
};

/**
 * Creates a deep copy of a Sudoku grid
 */
export const deepCopyGrid = (grid: SudokuGrid): SudokuGrid => {
  return grid.map(row => [...row]);
};

/**
 * Checks if a number can be safely placed at the given position
 */
export const isSafe = (grid: SudokuGrid, row: number, col: number, num: CellValue): boolean => {
  if (num === EMPTY_CELL) return true;

  // Check row
  for (let x = 0; x < SUDOKU_SIZE; x++) {
    if (grid[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < SUDOKU_SIZE; x++) {
    if (grid[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

/**
 * Validates the entire board and returns conflicts
 */
export const validateBoard = (grid: SudokuGrid): ValidationResult => {
  const conflicts = new Set<ConflictKey>();
  let isValid = true;

  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      const value = grid[row][col];
      if (value !== EMPTY_CELL) {
        // Temporarily remove the current cell value to check conflicts
        grid[row][col] = EMPTY_CELL;
        
        if (!isSafe(grid, row, col, value)) {
          conflicts.add(`${row}-${col}`);
          isValid = false;
        }
        
        // Restore the value
        grid[row][col] = value;
      }
    }
  }

  return { isValid, conflicts };
};

/**
 * Checks if the puzzle is completely solved
 */
export const isPuzzleComplete = (grid: SudokuGrid): boolean => {
  // Check if all cells are filled
  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) return false;
    }
  }

  // Check if the solution is valid
  return validateBoard(grid).isValid;
};

/**
 * Finds all empty cells in the grid
 */
export const findEmptyCells = (grid: SudokuGrid): CellPosition[] => {
  const emptyCells: CellPosition[] = [];
  
  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      if (grid[row][col] === EMPTY_CELL) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  return emptyCells;
};

/**
 * Gets all possible valid numbers for a given position
 */
export const getPossibleNumbers = (grid: SudokuGrid, row: number, col: number): CellValue[] => {
  const possible: CellValue[] = [];
  
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num as CellValue)) {
      possible.push(num as CellValue);
    }
  }
  
  return possible;
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Compares two grids for equality
 */
export const areGridsEqual = (grid1: SudokuGrid, grid2: SudokuGrid): boolean => {
  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      if (grid1[row][col] !== grid2[row][col]) return false;
    }
  }
  return true;
};

/**
 * Gets the box index for a given cell position
 */
export const getBoxIndex = (row: number, col: number): number => {
  return Math.floor(row / BOX_SIZE) * BOX_SIZE + Math.floor(col / BOX_SIZE);
};

/**
 * Gets all cell positions in the same row, column, or box as the given position
 */
export const getRelatedCells = (position: CellPosition): CellPosition[] => {
  const { row, col } = position;
  const related: CellPosition[] = [];
  
  // Add row cells
  for (let c = 0; c < SUDOKU_SIZE; c++) {
    if (c !== col) related.push({ row, col: c });
  }
  
  // Add column cells
  for (let r = 0; r < SUDOKU_SIZE; r++) {
    if (r !== row) related.push({ row: r, col });
  }
  
  // Add box cells
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  
  for (let r = startRow; r < startRow + BOX_SIZE; r++) {
    for (let c = startCol; c < startCol + BOX_SIZE; c++) {
      if (r !== row && c !== col) {
        related.push({ row: r, col: c });
      }
    }
  }
  
  return related;
};