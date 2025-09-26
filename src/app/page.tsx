'use client';

import React, { useCallback } from 'react';
import { SudokuBoard } from '@/components/SudokuBoard';
import { GameControls } from '@/components/GameControls';
import { NumberPad } from '@/components/NumberPad';
import { Timer } from '@/components/Timer';
import { Top10Scores } from '@/components/Top10Scores';
import { NotificationContainer } from '@/components/ui/NotificationToast';
import { useSudoku } from '@/hooks/useSudoku';
import { useNotifications } from '@/hooks/useNotifications';
import { CellValue } from '@/types/sudoku';

export default function HomePage() {
  // Initialize notification system for error handling
  const notifications = useNotifications();
  
  // State for showing/hiding leaderboard
  const [showLeaderboard, setShowLeaderboard] = React.useState(false);
  
  const {
    gameState,
    newGame,
    selectCell,
    updateCell,
    checkSolution,
    getHint,
    undo,
    redo,
    isGameComplete
  } = useSudoku();

  const handleNumberSelect = useCallback((number: CellValue) => {
    if (gameState.selectedCell) {
      updateCell(gameState.selectedCell, number);
    }
  }, [gameState.selectedCell, updateCell]);

  const handleClear = useCallback(() => {
    if (gameState.selectedCell) {
      updateCell(gameState.selectedCell, 0);
    }
  }, [gameState.selectedCell, updateCell]);

  const handleCheckSolution = useCallback(() => {
    try {
      const result = checkSolution();
      const incorrectCount = gameState.incorrectCells.size;
      
      if (result.isValid && isGameComplete()) {
        // Game is complete and valid
        notifications.showSuccess(
          '🎉 Congratulations!', 
          'You solved the puzzle! Well done!'
        );
      } else if (result.conflicts.size > 0) {
        notifications.showError(
          'Conflicts Found', 
          `Found ${result.conflicts.size} conflicts. Check the highlighted cells in red.`
        );
      } else if (incorrectCount > 0) {
        notifications.showError(
          'Incorrect Answers', 
          `Found ${incorrectCount} incorrect ${incorrectCount === 1 ? 'answer' : 'answers'}. Check the highlighted cells in orange.`
        );
      } else {
        notifications.showSuccess(
          'Looking Good!', 
          'All filled cells are correct so far. Keep going!'
        );
      }
    } catch (error) {
      console.error('Error checking solution:', error);
      notifications.showError(
        'Check Failed',
        'Unable to validate your solution. Please try again.',
        [
          {
            label: 'Retry',
            onClick: handleCheckSolution
          }
        ]
      );
    }
  }, [checkSolution, isGameComplete, notifications, gameState.incorrectCells.size]);

  const canUndo = gameState.moves.length > 0;
  const canRedo = false; // This would need redo history implementation
  const hintsRemaining = gameState.maxHints - gameState.hintsUsed;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Game Status */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-4">
            <Timer 
              timeElapsed={gameState.timeElapsed}
              isRunning={!gameState.isComplete}
            />
            <button
              onClick={() => setShowLeaderboard(true)}
              className="px-4 py-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold rounded-lg shadow-md hover:from-accent/90 hover:to-accent/70 transition-all duration-200 transform hover:scale-105"
            >
              🏆 Leaderboard
            </button>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left Panel - Game Controls */}
          <div className="flex-shrink-0">
            <GameControls
              onNewGame={newGame}
              onCheckSolution={handleCheckSolution}
              onHint={getHint}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
              hintsRemaining={hintsRemaining}
              difficulty={gameState.difficulty}
            />
          </div>

          {/* Center - Sudoku Board with Event Delegation */}
          <div className="flex-shrink-0">
            <SudokuBoard
              grid={gameState.grid}
              selectedCell={gameState.selectedCell}
              onCellSelect={selectCell}
              onCellChange={updateCell}
              conflicts={gameState.conflicts}
              initialGrid={gameState.initialGrid}
              hintCells={gameState.hintCells}
              incorrectCells={gameState.incorrectCells}
            />
          </div>

          {/* Right Panel - Number Pad */}
          <div className="flex-shrink-0">
            <NumberPad
              onNumberSelect={handleNumberSelect}
              onClear={handleClear}
              disabled={gameState.isComplete}
            />
          </div>
        </div>

        {/* Game Statistics */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Moves: {gameState.moves.length}</span>
            <span>Hints Used: {gameState.hintsUsed}/{gameState.maxHints}</span>
            <span>Difficulty: {gameState.difficulty.charAt(0).toUpperCase() + gameState.difficulty.slice(1)}</span>
          </div>
        </div>

        {/* Game Complete Message */}
        {gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg celebration">
              <h2 className="text-xl font-bold mb-2">🎉 Congratulations!</h2>
              <p>You completed the puzzle in {Math.floor(gameState.timeElapsed / 60)} minutes and {gameState.timeElapsed % 60} seconds!</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">How to Play</h3>
          <div className="text-muted-foreground text-sm space-y-2">
            <p>• Click on a cell to select it, then use the number pad or keyboard to enter numbers</p>
            <p>• Each row, column, and 3×3 box must contain all digits from 1 to 9</p>
            <p>• Red cells indicate conflicts - multiple instances of the same number</p>
            <p>• Use hints sparingly - they&apos;re limited based on difficulty level</p>
            <p>• Use undo/redo to correct mistakes</p>
          </div>
        </div>
        
        {/* Leaderboard Modal */}
        {showLeaderboard && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <Top10Scores
                onClose={() => setShowLeaderboard(false)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Notification System for Error Handling */}
      <NotificationContainer
        notifications={notifications.notifications}
        onRemove={notifications.removeNotification}
      />
    </div>
  );
}