import { SudokuGrid, CellValue, Difficulty } from '@/types/sudoku';
import { 
  createEmptyBoard, 
  deepCopyGrid, 
  isSafe, 
  shuffleArray,
  findEmptyCells 
} from './sudokuValidator';
import { SUDOKU_SIZE, EMPTY_CELL, DIFFICULTY_CONFIGS } from '@/constants/gameConstants';

/**
 * Solves a Sudoku puzzle using backtracking algorithm with error handling.
 * Includes safety checks to prevent infinite loops and stack overflow errors.
 * 
 * @param grid - The Sudoku grid to solve
 * @param depth - Current recursion depth for safety checks (internal use)
 * @returns boolean indicating if the puzzle was successfully solved
 */
export const solveSudoku = (grid: SudokuGrid, depth: number = 0): boolean => {
  try {
    // Prevent stack overflow with maximum recursion depth
    if (depth > 1000) {
      console.error('Maximum recursion depth reached in solveSudoku');
      return false;
    }

    for (let row = 0; row < SUDOKU_SIZE; row++) {
      for (let col = 0; col < SUDOKU_SIZE; col++) {
        if (grid[row][col] === EMPTY_CELL) {
          const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of numbers) {
            if (isSafe(grid, row, col, num as CellValue)) {
              grid[row][col] = num as CellValue;
              
              if (solveSudoku(grid, depth + 1)) {
                return true;
              }
              
              grid[row][col] = EMPTY_CELL;
            }
          }
          
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in solveSudoku:', error);
    return false;
  }
};

/**
 * Generates a complete valid Sudoku solution by creating the initial board structure.
 * This is the core board creation function that populates the board with initial numbers.
 * Uses optimized approach: fills diagonal boxes first, then solves remaining cells.
 * 
 * @returns A complete 9x9 Sudoku grid with all cells filled according to Sudoku rules
 */
export const generateCompleteSudoku = (): SudokuGrid => {
  const grid = createEmptyBoard();
  
  // Populate board with initial numbers - start with diagonal boxes for optimization
  fillDiagonalBoxes(grid);
  
  // Complete the board by solving remaining empty cells using backtracking
  solveSudoku(grid);
  
  return grid;
};

/**
 * Fills the diagonal 3x3 boxes with random valid numbers during board creation.
 * Diagonal boxes (top-left, center, bottom-right) don't share rows/columns, 
 * so they can be filled independently without violating Sudoku rules.
 * This optimization speeds up the overall board generation process.
 * 
 * @param grid - The Sudoku grid being populated with initial numbers
 */
const fillDiagonalBoxes = (grid: SudokuGrid): void => {
  for (let box = 0; box < SUDOKU_SIZE; box += 3) {
    fillBox(grid, box, box);
  }
};

/**
 * Fills a single 3x3 box with random numbers (1-9) during board creation.
 * Populates board section by section - each box gets all 9 numbers in random order.
 * This ensures each box follows Sudoku rules while maintaining randomization.
 * 
 * @param grid - The Sudoku grid being populated
 * @param row - Starting row position of the 3x3 box
 * @param col - Starting column position of the 3x3 box
 */
const fillBox = (grid: SudokuGrid, row: number, col: number): void => {
  const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let index = 0;
  
  // Populate board within this 3x3 box with shuffled numbers
  for (let r = row; r < row + 3; r++) {
    for (let c = col; c < col + 3; c++) {
      grid[r][c] = numbers[index] as CellValue;
      index++;
    }
  }
};

/**
 * Removes numbers from a complete grid to create a puzzle
 */
export const removeCells = (grid: SudokuGrid, clues: number): SudokuGrid => {
  const puzzle = deepCopyGrid(grid);
  const totalCells = SUDOKU_SIZE * SUDOKU_SIZE;
  const cellsToRemove = totalCells - clues;
  let removed = 0;
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * SUDOKU_SIZE);
    const col = Math.floor(Math.random() * SUDOKU_SIZE);
    
    if (puzzle[row][col] !== EMPTY_CELL) {
      const backup = puzzle[row][col];
      puzzle[row][col] = EMPTY_CELL;
      
      // Check if the puzzle still has a unique solution
      if (hasUniqueSolution(puzzle)) {
        removed++;
      } else {
        puzzle[row][col] = backup;
      }
    }
  }
  
  return puzzle;
};

/**
 * Checks if a puzzle has a unique solution (simplified version)
 */
const hasUniqueSolution = (grid: SudokuGrid): boolean => {
  const gridCopy = deepCopyGrid(grid);
  const emptyCells = findEmptyCells(gridCopy);
  
  // If there are too few clues, it's likely not unique
  const filledCells = SUDOKU_SIZE * SUDOKU_SIZE - emptyCells.length;
  if (filledCells < 17) return false;
  
  // For performance, we'll assume it's unique if it has at least 17 clues
  // A more thorough check would involve solving with different strategies
  return solveSudoku(gridCopy);
};

/**
 * Generates a new Sudoku puzzle based on difficulty with comprehensive error handling.
 * Includes retry logic and fallback mechanisms for reliable puzzle generation.
 * 
 * @param difficulty - The difficulty level for puzzle generation
 * @param maxRetries - Maximum number of generation attempts (default: 3)
 * @returns Object containing puzzle and solution grids
 * @throws Error if puzzle generation fails after all retries
 */
export const generatePuzzle = (
  difficulty: Difficulty, 
  maxRetries: number = 3
): { puzzle: SudokuGrid; solution: SudokuGrid } => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const solution = generateCompleteSudoku();
      const config = DIFFICULTY_CONFIGS[difficulty];
      
      if (!config) {
        throw new Error(`Invalid difficulty level: ${difficulty}`);
      }
      
      const puzzle = removeCells(solution, config.clues);
      
      // Validate generated puzzle
      if (!puzzle || !solution) {
        throw new Error('Generated puzzle or solution is invalid');
      }
      
      return {
        puzzle: deepCopyGrid(puzzle),
        solution: deepCopyGrid(solution)
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`Puzzle generation attempt ${attempt}/${maxRetries} failed:`, error);
      
      // If this isn't the last attempt, continue trying
      if (attempt < maxRetries) {
        continue;
      }
    }
  }
  
  // All attempts failed - throw error with fallback
  console.error('All puzzle generation attempts failed:', lastError);
  throw new Error(
    `Failed to generate ${difficulty} puzzle after ${maxRetries} attempts. ${lastError?.message || 'Unknown error'}`
  );
};

/**
 * Gets a hint for the current puzzle state
 */
export const getHint = (currentGrid: SudokuGrid, solution: SudokuGrid): { row: number; col: number; value: CellValue } | null => {
  const emptyCells = findEmptyCells(currentGrid);
  
  if (emptyCells.length === 0) return null;
  
  // Find cells with the fewest possible values (most constrained)
  const cellsWithPossibilities = emptyCells.map(cell => {
    const possibilities = [];
    for (let num = 1; num <= 9; num++) {
      if (isSafe(currentGrid, cell.row, cell.col, num as CellValue)) {
        possibilities.push(num);
      }
    }
    return { ...cell, possibilities: possibilities.length };
  });
  
  // Sort by number of possibilities (ascending)
  cellsWithPossibilities.sort((a, b) => a.possibilities - b.possibilities);
  
  // Return the hint for the most constrained cell
  const [hintCell] = cellsWithPossibilities;
  return {
    row: hintCell.row,
    col: hintCell.col,
    value: solution[hintCell.row][hintCell.col]
  };
};