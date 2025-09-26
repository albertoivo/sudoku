'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { GameControlsProps } from '@/types/sudoku';
import { DIFFICULTY_CONFIGS } from '@/constants/gameConstants';
import { getDifficultyColor } from '@/utils/gameHelpers';

/**
 * Game Controls component handles all game actions and difficulty selection.
 * 
 * Features:
 * - Difficulty selection (Easy, Medium, Hard, Expert)
 * - Game actions (New Game, Check Solution, Hint, Undo/Redo)
 * - Visual feedback for current difficulty
 * - Hints counter with remaining hints display
 * - Responsive button layout
 */
const GameControls: React.FC<GameControlsProps> = ({
  onNewGame,
  onCheckSolution,
  onHint,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  hintsRemaining,
  difficulty
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg shadow-md border border-border">
      {/* Difficulty Selection */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">New Game</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(DIFFICULTY_CONFIGS).map((config) => (
            <Button
              key={config.name}
              onClick={() => onNewGame(config.name)}
              variant={difficulty === config.name ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
            >
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Difficulty Badge */}
      <div className="flex items-center justify-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
          {DIFFICULTY_CONFIGS[difficulty].label}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button 
          onClick={onCheckSolution}
          className="w-full"
          variant="outline"
        >
          Check Solution
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            variant="ghost"
            size="sm"
          >
            Undo
          </Button>
          
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            variant="ghost"
            size="sm"
          >
            Redo
          </Button>
        </div>

        <Button
          onClick={onHint}
          disabled={hintsRemaining <= 0}
          variant="secondary"
          className="w-full"
        >
          Hint ({hintsRemaining})
        </Button>
      </div>

      {/* Game Info */}
      <div className="text-xs text-muted-foreground text-center">
        <p>{DIFFICULTY_CONFIGS[difficulty].description}</p>
        <p>Max hints: {DIFFICULTY_CONFIGS[difficulty].maxHints}</p>
      </div>
    </div>
  );
};

export default GameControls;