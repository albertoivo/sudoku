import React, { useState, useCallback, useEffect } from 'react';
import { 
  GameState, 
  Difficulty, 
  CellPosition, 
  CellValue, 
  UseSudokuReturn,
  ValidationResult,
  GameMove
} from '@/types/sudoku';
import { generatePuzzle, getHint } from '@/utils/sudokuGenerator';
import { 
  validateBoard, 
  isPuzzleComplete, 
  deepCopyGrid,
  createEmptyBoard
} from '@/utils/sudokuValidator';
import { arePositionsEqual, createMove } from '@/utils/gameHelpers';
import { DIFFICULTY_CONFIGS } from '@/constants/gameConstants';
import { useLocalStorage } from './useLocalStorage';
import { useTimer } from './useTimer';
import { useNotifications } from './useNotifications';
import { useScores } from './useScores';

/**
 * Helper function to compare two Sets for equality
 */
const areSetsEqual = <T>(set1: Set<T>, set2: Set<T>): boolean => {
  if (set1.size !== set2.size) return false;
  const array1 = Array.from(set1);
  const array2 = Array.from(set2);
  return array1.every(item => array2.includes(item));
};

/**
 * Custom hook for managing Sudoku game state and core game logic.
 * Handles board creation, validation, user interactions, and game progression.
 * Integrates timer functionality and persistent storage for complete game experience.
 * This is the central game controller that coordinates all Sudoku operations.
 * Includes comprehensive error handling with user-friendly notifications.
 * 
 * @returns Object containing game state and all game manipulation functions
 */
export const useSudoku = (): UseSudokuReturn => {
  // Error notification system for user-friendly error handling
  const { showError, showSuccess, showWarning, showInfo } = useNotifications();
  
  // Scoring system for leaderboard functionality
  const { addScore, qualifiesForTop10 } = useScores();

  // Initialize game state with error handling for puzzle generation
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const { puzzle, solution } = generatePuzzle('medium');
      return {
        grid: puzzle,
        solution,
        initialGrid: deepCopyGrid(puzzle),
        selectedCell: null,
        conflicts: new Set(),
        difficulty: 'medium',
        timeElapsed: 0,
        isComplete: false,
        moves: [],
        hintsUsed: 0,
        maxHints: DIFFICULTY_CONFIGS.medium.maxHints,
        hintCells: new Set(),
        incorrectCells: new Set()
      };
    } catch (error) {
      console.error('Error initializing Sudoku game:', error);
      showError(
        'Game Initialization Error',
        'Failed to create initial puzzle. Using fallback empty board.',
        [
          {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        ]
      );
      
      // Fallback to empty board
      const emptyGrid = createEmptyBoard();
      return {
        grid: emptyGrid,
        solution: emptyGrid,
        initialGrid: emptyGrid,
        selectedCell: null,
        conflicts: new Set(),
        difficulty: 'medium',
        timeElapsed: 0,
        isComplete: false,
        moves: [],
        hintsUsed: 0,
        maxHints: DIFFICULTY_CONFIGS.medium.maxHints,
        hintCells: new Set(),
        incorrectCells: new Set()
      };
    }
  });

  // Move history for undo/redo
  const [moveHistory, setMoveHistory] = useState<GameMove[]>([]);
  const [redoHistory, setRedoHistory] = useState<GameMove[]>([]);

  // Timer hook
  const timer = useTimer();

  // Local storage for persistence
  const { setValue: saveGameState } = useLocalStorage('sudoku-game-state', gameState);

  // Update conflicts when grid changes
  useEffect(() => {
    const validation = validateBoard(gameState.grid);
    const isComplete = isPuzzleComplete(gameState.grid) && validation.isValid;
    
    // Only update if there are actual changes to avoid infinite loops
    if (validation.conflicts.size !== gameState.conflicts.size || 
        isComplete !== gameState.isComplete ||
        !areSetsEqual(validation.conflicts, gameState.conflicts)) {
      setGameState(prev => ({
        ...prev,
        conflicts: validation.conflicts,
        isComplete
      }));
    }
  }, [gameState.grid, gameState.conflicts, gameState.isComplete]);

  // Save game state when it changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState, saveGameState]);

  // Check if game is complete and stop timer
  useEffect(() => {
    if (gameState.isComplete) {
      timer.stop();
    }
  }, [gameState.isComplete, timer]);

  // Handle game completion and score saving
  useEffect(() => {
    if (gameState.isComplete && timer.timeElapsed > 0) {
      // Check if time qualifies for Top 10
      const qualifies = qualifiesForTop10(gameState.difficulty, timer.timeElapsed);
      
      if (qualifies) {
        // Format time for display
        const minutes = Math.floor(timer.timeElapsed / 60);
        const seconds = timer.timeElapsed % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Prompt for player name and save score
        const playerName = window.prompt(
          `🎉 Congratulations! You completed the puzzle!\n\n` +
          `⏱️ Time: ${timeStr}\n` +
          `💡 Hints Used: ${gameState.hintsUsed}\n` +
          `🏆 Your time qualifies for the Top 10!\n\n` +
          `Enter your name for the leaderboard:`, 
          'Anonymous'
        ) || 'Anonymous';
        
        if (playerName.trim()) {
          try {
            addScore({
              playerName: playerName.trim(),
              difficulty: gameState.difficulty,
              timeElapsed: timer.timeElapsed,
              hintsUsed: gameState.hintsUsed
            });
            
            showSuccess(
              'Top 10 Entry Added!',
              `Your score has been added to the ${gameState.difficulty} Top 10 leaderboard!`
            );
          } catch (error) {
            console.error('Error saving score:', error);
            showError(
              'Score Save Failed',
              'Unable to save your score to the leaderboard.'
            );
          }
        }
      } else {
        // Show completion message without leaderboard entry
        const minutes = Math.floor(timer.timeElapsed / 60);
        const seconds = timer.timeElapsed % 60;
        const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        showSuccess(
          'Puzzle Complete!',
          `🎉 Great job! You finished in ${timeStr} with ${gameState.hintsUsed} hints.`
        );
      }
    }
  }, [gameState.isComplete, gameState.difficulty, gameState.hintsUsed, timer.timeElapsed, addScore, qualifiesForTop10, showSuccess, showError]);

  /**
   * Creates a new game by generating a fresh puzzle and resetting all game state.
   * This is the primary board creation function that populates board with initial numbers
   * based on the selected difficulty level. Initializes timer and clears history.
   * Includes comprehensive error handling for puzzle generation failures.
   * 
   * @param difficulty - The difficulty level for the new game (easy, medium, hard, expert)
   */
  const newGame = useCallback((difficulty: Difficulty) => {
    try {
      const { puzzle, solution } = generatePuzzle(difficulty);
      const config = DIFFICULTY_CONFIGS[difficulty];
      
      // Reset all game state and populate board with initial numbers for new game
      setGameState({
        grid: puzzle,
        solution,
        initialGrid: deepCopyGrid(puzzle),
        selectedCell: null,
        conflicts: new Set(),
        difficulty,
        timeElapsed: 0,
        isComplete: false,
        moves: [],
        hintsUsed: 0,
        maxHints: config.maxHints,
        hintCells: new Set(),
        incorrectCells: new Set()
      });
      
      setMoveHistory([]);
      setRedoHistory([]);
      timer.reset();
      timer.start();
      
      showSuccess('New Game Started', `${config.label} puzzle generated successfully!`);
    } catch (error) {
      console.error('Error creating new game:', error);
      showError(
        'Failed to Create New Game',
        'Unable to generate a new puzzle. Please try again or select a different difficulty.',
        [
          {
            label: 'Retry Same Difficulty',
            onClick: () => newGame(difficulty)
          },
          {
            label: 'Try Easy Mode',
            onClick: () => newGame('easy')
          }
        ]
      );
    }
  }, [timer, showError, showSuccess]);

  const selectCell = useCallback((position: CellPosition) => {
    setGameState(prev => ({
      ...prev,
      selectedCell: position
    }));
  }, []);

  const updateCell = useCallback((position: CellPosition, value: CellValue) => {
    try {
      const { row, col } = position;
      
      // Validate position bounds with error handling
      if (row < 0 || row >= 9 || col < 0 || col >= 9) {
        showError('Invalid Move', 'Cell position is out of bounds.');
        return;
      }
      
      // Don't allow changes to prefilled cells or hint cells
      if (gameState.initialGrid[row][col] !== 0) {
        showWarning('Invalid Move', 'Cannot modify pre-filled numbers.');
        return;
      }
      
      // Don't allow changes to hint cells
      const cellKey = `${row}-${col}`;
      if (gameState.hintCells.has(cellKey)) {
        showWarning('Invalid Move', 'Cannot modify cells filled by hints.');
        return;
      }
      
      // Validate input value
      if (value !== 0 && (value < 1 || value > 9)) {
        showError('Invalid Input', 'Please enter a number between 1 and 9.');
        return;
      }
      
      const previousValue = gameState.grid[row][col];
      
      // Don't create move if value hasn't changed
      if (previousValue === value) return;

      // Start timer on first move if not already running
      if (gameState.moves.length === 0 && !timer.isRunning) {
        timer.start();
      }
      
      const move = createMove(position, previousValue, value);
      
      setGameState(prev => {
        const newGrid = deepCopyGrid(prev.grid);
        newGrid[row][col] = value;
        
        // Clear incorrect marking if cell is now correct or empty
        const newIncorrectCells = new Set(prev.incorrectCells);
        const cellKey = `${row}-${col}`;
        
        if (value === 0 || value === prev.solution[row][col]) {
          newIncorrectCells.delete(cellKey);
        }
        
        return {
          ...prev,
          grid: newGrid,
          moves: [...prev.moves, move],
          incorrectCells: newIncorrectCells
        };
      });
      
      setMoveHistory(prev => [...prev, move]);
      setRedoHistory([]); // Clear redo history when new move is made
    } catch (error) {
      console.error('Error updating cell:', error);
      showError(
        'Move Failed',
        'Unable to update the cell. Please try again.',
        [
          {
            label: 'Retry',
            onClick: () => updateCell(position, value)
          }
        ]
      );
    }
  }, [gameState.grid, gameState.initialGrid, gameState.moves.length, timer, showError, showWarning]);

  const checkSolution = useCallback((): ValidationResult => {
    const validation = validateBoard(gameState.grid);
    const newIncorrectCells = new Set<string>();
    
    // Check each filled cell against the solution
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const currentValue = gameState.grid[row][col];
        const correctValue = gameState.solution[row][col];
        
        // If cell is filled and doesn't match solution, mark as incorrect
        if (currentValue !== 0 && currentValue !== correctValue) {
          newIncorrectCells.add(`${row}-${col}`);
        }
      }
    }
    
    // Update incorrect cells in game state
    setGameState(prev => ({
      ...prev,
      incorrectCells: newIncorrectCells
    }));
    
    return {
      isValid: validation.isValid && newIncorrectCells.size === 0,
      conflicts: validation.conflicts
    };
  }, [gameState.grid, gameState.solution]);

  const getHintForCell = useCallback((): boolean => {
    try {
      if (gameState.hintsUsed >= gameState.maxHints) {
        showWarning('No Hints Remaining', `You've used all ${gameState.maxHints} hints for this difficulty level.`);
        return false;
      }
      
      const hint = getHint(gameState.grid, gameState.solution);
      if (!hint) {
        showInfo('No Hints Available', 'All possible cells are already filled correctly!');
        return false;
      }
      
      // Start timer on first action (including hints) if not already running
      if (gameState.moves.length === 0 && !timer.isRunning) {
        timer.start();
      }
      
      const { row, col, value } = hint;
      const move = createMove({ row, col }, gameState.grid[row][col], value);
      
      setGameState(prev => {
        const newGrid = deepCopyGrid(prev.grid);
        newGrid[row][col] = value;
        
        // Mark this cell as a hint cell
        const newHintCells = new Set(prev.hintCells);
        newHintCells.add(`${row}-${col}`);
        
        // Clear from incorrect cells if it was marked as such
        const newIncorrectCells = new Set(prev.incorrectCells);
        newIncorrectCells.delete(`${row}-${col}`);
        
        return {
          ...prev,
          grid: newGrid,
          hintsUsed: prev.hintsUsed + 1,
          moves: [...prev.moves, move],
          hintCells: newHintCells,
          incorrectCells: newIncorrectCells
        };
      });
      
      setMoveHistory(prev => [...prev, move]);
      setRedoHistory([]);
      
      const hintsRemaining = gameState.maxHints - gameState.hintsUsed - 1;
      showSuccess(
        'Hint Applied', 
        `Number ${value} placed at row ${row + 1}, column ${col + 1}. ${hintsRemaining} hints remaining.`
      );
      
      return true;
    } catch (error) {
      console.error('Error getting hint:', error);
      showError(
        'Hint Failed',
        'Unable to generate a hint. Please try again.',
        [
          {
            label: 'Retry',
            onClick: () => getHintForCell()
          }
        ]
      );
      return false;
    }
  }, [gameState.grid, gameState.solution, gameState.hintsUsed, gameState.maxHints, gameState.moves.length, timer, showError, showWarning, showInfo, showSuccess]);

  const undo = useCallback((): boolean => {
    if (moveHistory.length === 0) return false;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    const { position, previousValue } = lastMove;
    
    setGameState(prev => {
      const newGrid = deepCopyGrid(prev.grid);
      newGrid[position.row][position.col] = previousValue;
      
      return {
        ...prev,
        grid: newGrid,
        moves: prev.moves.slice(0, -1)
      };
    });
    
    setMoveHistory(prev => prev.slice(0, -1));
    setRedoHistory(prev => [...prev, lastMove]);
    
    return true;
  }, [moveHistory]);

  const redo = useCallback((): boolean => {
    if (redoHistory.length === 0) return false;
    
    const moveToRedo = redoHistory[redoHistory.length - 1];
    const { position, newValue } = moveToRedo;
    
    setGameState(prev => {
      const newGrid = deepCopyGrid(prev.grid);
      newGrid[position.row][position.col] = newValue;
      
      return {
        ...prev,
        grid: newGrid,
        moves: [...prev.moves, moveToRedo]
      };
    });
    
    setMoveHistory(prev => [...prev, moveToRedo]);
    setRedoHistory(prev => prev.slice(0, -1));
    
    return true;
  }, [redoHistory]);

  const isGameComplete = useCallback((): boolean => {
    return gameState.isComplete;
  }, [gameState.isComplete]);

  return {
    gameState: {
      ...gameState,
      timeElapsed: timer.timeElapsed
    },
    newGame,
    selectCell,
    updateCell,
    checkSolution,
    getHint: getHintForCell,
    undo,
    redo,
    isGameComplete
  };
};