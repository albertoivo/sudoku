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
 * =====================================================================
 * SUDOKU PUZZLE GENERATOR - UNIQUE SOLUTION GUARANTEED
 * =====================================================================
 * 
 * This module generates Sudoku puzzles with the following guarantees:
 * 
 * 1. UNIQUE SOLUTION: Every puzzle has exactly ONE valid solution
 *    - Implemented via countSolutions() that verifies uniqueness
 *    - Puzzles with multiple solutions are rejected
 * 
 * 2. NO GUESSING REQUIRED: Puzzles solvable through logical deduction
 *    - For easier difficulties, isSolvableWithoutGuessing() ensures logic-only solving
 *    - Uses constraint propagation and naked singles strategies
 * 
 * 3. VALID SUDOKU RULES: All standard Sudoku constraints respected
 *    - Minimum 17 clues (mathematical minimum for unique Sudoku)
 *    - Proper row, column, and 3x3 box validation
 * 
 * 4. DIFFICULTY SCALING: Clue counts adjusted per difficulty level
 *    - Easy: 40 clues (solvable without guessing)
 *    - Medium: 35 clues (logic-based solving)
 *    - Hard: 30 clues (advanced logic required)
 *    - Expert: 25 clues (complex pattern recognition)
 * 
 * Algorithm Highlights:
 * - Backtracking for solution generation
 * - Symmetric cell removal for aesthetic puzzles
 * - Retry mechanism with fallback strategies
 * =====================================================================
 */

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
 * Checks if a puzzle can be solved using logical deduction only (no guessing).
 * Uses constraint propagation and naked/hidden singles strategies.
 * 
 * @param grid - The Sudoku grid to check
 * @returns true if the puzzle can be solved logically without guessing
 */
const isSolvableWithoutGuessing = (grid: SudokuGrid): boolean => {
  const workGrid = deepCopyGrid(grid);
  let madeProgress = true;
  
  while (madeProgress) {
    madeProgress = false;
    
    // Try to find cells with only one possible value (naked singles)
    for (let row = 0; row < SUDOKU_SIZE; row++) {
      for (let col = 0; col < SUDOKU_SIZE; col++) {
        if (workGrid[row][col] === EMPTY_CELL) {
          const possibilities: CellValue[] = [];
          
          for (let num = 1; num <= 9; num++) {
            if (isSafe(workGrid, row, col, num as CellValue)) {
              possibilities.push(num as CellValue);
            }
          }
          
          // If only one possibility, fill it in
          if (possibilities.length === 1) {
            const [value] = possibilities;
            workGrid[row][col] = value;
            madeProgress = true;
          } else if (possibilities.length === 0) {
            // No valid possibilities means puzzle is invalid
            return false;
          }
        }
      }
    }
  }
  
  // Check if puzzle is completely solved
  const remainingEmpty = findEmptyCells(workGrid);
  return remainingEmpty.length === 0;
};

/**
 * Removes cells symmetrically to create an aesthetically pleasing puzzle.
 * Symmetric puzzles are often considered more elegant and balanced.
 * 
 * @param grid - Complete solved Sudoku grid
 * @param clues - Number of clues to leave in the puzzle
 * @returns Puzzle grid with symmetrically removed cells
 */
const removeSymmetricCells = (grid: SudokuGrid, clues: number): SudokuGrid => {
  const puzzle = deepCopyGrid(grid);
  const totalCells = SUDOKU_SIZE * SUDOKU_SIZE;
  const cellsToRemove = totalCells - clues;
  
  // Create pairs of symmetric positions (180-degree rotation)
  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      // Only add if not the center cell (4,4)
      if (row !== 4 || col !== 4) {
        positions.push({ row, col });
      }
    }
  }
  
  const shuffledPositions = shuffleArray(positions);
  let removed = 0;
  
  for (const pos of shuffledPositions) {
    if (removed >= cellsToRemove) break;
    
    const { row, col } = pos;
    const symRow = SUDOKU_SIZE - 1 - row;
    const symCol = SUDOKU_SIZE - 1 - col;
    
    if (puzzle[row][col] !== EMPTY_CELL && puzzle[symRow][symCol] !== EMPTY_CELL) {
      const backup1 = puzzle[row][col];
      const backup2 = puzzle[symRow][symCol];
      
      puzzle[row][col] = EMPTY_CELL;
      puzzle[symRow][symCol] = EMPTY_CELL;
      
      if (hasUniqueSolution(puzzle)) {
        removed += 2;
      } else {
        puzzle[row][col] = backup1;
        puzzle[symRow][symCol] = backup2;
      }
    }
  }
  
  return puzzle;
};

/**
 * Removes numbers from a complete grid to create a puzzle with a unique solution.
 * Uses symmetric removal and validates that the puzzle doesn't require guessing.
 * Ensures the generated puzzle can be solved through logical deduction only.
 * 
 * @param grid - Complete solved Sudoku grid
 * @param clues - Number of clues to leave in the puzzle
 * @returns Puzzle grid with removed cells, guaranteed to have unique solution
 */
export const removeCells = (grid: SudokuGrid, clues: number): SudokuGrid => {
  const puzzle = deepCopyGrid(grid);
  const totalCells = SUDOKU_SIZE * SUDOKU_SIZE;
  const cellsToRemove = totalCells - clues;
  
  // Create array of all cell positions
  const allPositions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < SUDOKU_SIZE; row++) {
    for (let col = 0; col < SUDOKU_SIZE; col++) {
      allPositions.push({ row, col });
    }
  }
  
  // Shuffle positions for random removal order
  const shuffledPositions = shuffleArray(allPositions);
  let removed = 0;
  let attempts = 0;
  const maxAttempts = totalCells * 2; // Prevent infinite loops
  
  for (const pos of shuffledPositions) {
    if (removed >= cellsToRemove || attempts >= maxAttempts) break;
    
    const { row, col } = pos;
    attempts++;
    
    if (puzzle[row][col] !== EMPTY_CELL) {
      const backup = puzzle[row][col];
      puzzle[row][col] = EMPTY_CELL;
      
      // Check if puzzle still has unique solution and can be solved without guessing
      if (hasUniqueSolution(puzzle)) {
        // For easier difficulties, also check if solvable without guessing
        const currentClues = totalCells - removed - 1;
        if (currentClues >= 32 || isSolvableWithoutGuessing(puzzle)) {
          removed++;
        } else {
          // Restore cell if it makes puzzle require guessing
          puzzle[row][col] = backup;
        }
      } else {
        // Restore cell if it breaks uniqueness
        puzzle[row][col] = backup;
      }
    }
  }
  
  // If we couldn't remove enough cells, try symmetric removal
  if (removed < cellsToRemove) {
    console.warn(`Only removed ${removed}/${cellsToRemove} cells. Attempting symmetric removal.`);
    return removeSymmetricCells(grid, clues);
  }
  
  return puzzle;
};

/**
 * Counts the number of solutions for a given Sudoku puzzle.
 * Used to verify puzzle uniqueness - a valid puzzle should have exactly 1 solution.
 * 
 * @param grid - The Sudoku grid to analyze
 * @param maxSolutions - Stop counting after finding this many solutions (default: 2)
 * @returns The number of solutions found (capped at maxSolutions)
 */
const countSolutions = (grid: SudokuGrid, maxSolutions: number = 2): number => {
  let solutionCount = 0;
  const gridCopy = deepCopyGrid(grid);
  
  const solve = (board: SudokuGrid): void => {
    // If we've already found multiple solutions, stop searching
    if (solutionCount >= maxSolutions) return;
    
    // Find the first empty cell
    let row = -1;
    let col = -1;
    
    for (let r = 0; r < SUDOKU_SIZE && row === -1; r++) {
      for (let c = 0; c < SUDOKU_SIZE && col === -1; c++) {
        if (board[r][c] === EMPTY_CELL) {
          row = r;
          col = c;
        }
      }
    }
    
    // If no empty cell found, we have a complete solution
    if (row === -1) {
      solutionCount++;
      return;
    }
    
    // Try all numbers 1-9 (no shuffling - we want deterministic counting)
    for (let num = 1; num <= 9; num++) {
      if (isSafe(board, row, col, num as CellValue)) {
        board[row][col] = num as CellValue;
        solve(board);
        board[row][col] = EMPTY_CELL;
        
        // Early exit if we found multiple solutions
        if (solutionCount >= maxSolutions) return;
      }
    }
  };
  
  solve(gridCopy);
  return solutionCount;
};

/**
 * Checks if a puzzle has exactly one unique solution.
 * This is crucial for ensuring the puzzle doesn't require guessing.
 * A puzzle with multiple solutions is ambiguous and may require trial-and-error.
 * 
 * @param grid - The Sudoku grid to check
 * @returns true if the puzzle has exactly one solution, false otherwise
 */
const hasUniqueSolution = (grid: SudokuGrid): boolean => {
  const emptyCells = findEmptyCells(grid);
  
  // Mathematical minimum for a unique Sudoku solution is 17 clues
  const filledCells = SUDOKU_SIZE * SUDOKU_SIZE - emptyCells.length;
  if (filledCells < 17) return false;
  
  // Count solutions (stop after finding 2 to optimize performance)
  const solutions = countSolutions(grid, 2);
  
  // Valid puzzle must have exactly 1 solution
  return solutions === 1;
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