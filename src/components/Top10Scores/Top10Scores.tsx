'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Top10ScoresProps } from '@/types/scores';
import { Difficulty } from '@/types/sudoku';
import { useScores } from '@/hooks/useScores';
import { formatTime, getDifficultyColor } from '@/utils/gameHelpers';

/**
 * Top 10 Scores component displays the leaderboard for each difficulty level.
 * 
 * Features:
 * - Tabbed interface for different difficulty levels
 * - Top 10 scores per difficulty with ranking
 * - Player name, time, hints used, and calculated score
 * - Highlight current player's score if provided
 * - Clear scores functionality with confirmation
 * - Responsive design for mobile and desktop
 */
const Top10Scores: React.FC<Top10ScoresProps> = ({
  currentScore,
  onClose,
  onClearScores
}) => {
  const { scores, clearScores, getCurrentRank } = useScores();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);

  const difficulties: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' },
    { value: 'expert', label: 'Expert' }
  ];

  // Sort scores by time (fastest first) to ensure proper top 10 ordering
  const currentScores = [...scores[selectedDifficulty]].sort((a, b) => a.timeElapsed - b.timeElapsed);
  const currentRank = currentScore ? getCurrentRank(currentScore) : 0;

  const handleClearScores = () => {
    clearScores();
    if (onClearScores) {
      onClearScores();
    }
    setShowClearConfirmation(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-lg shadow-lg border border-border">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">🏆 Top 10 Scores</h2>
        {onClose && (
          <Button onClick={onClose} variant="ghost" size="sm">
            ✕
          </Button>
        )}
      </div>

      {/* Current Score Highlight (if provided) */}
      {currentScore && (
        <div className="p-4 bg-gradient-to-r from-accent/20 to-accent/30 border-l-4 border-accent">
          <div className="flex items-center space-x-2">
            <span className="text-accent-foreground font-semibold">🎉 Your Score:</span>
            <span className="font-mono font-bold text-foreground">{currentScore.score} points</span>
            <span className="text-muted-foreground">
              (Rank #{currentRank} in {currentScore.difficulty})
            </span>
          </div>
        </div>
      )}

      {/* Difficulty Tabs */}
      <div className="flex border-b border-border bg-muted/50">
        {difficulties.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelectedDifficulty(value)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              selectedDifficulty === value
                ? `text-white ${getDifficultyColor(value).replace('text-', 'bg-')}`
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scores List */}
      <div className="p-6">
        {currentScores.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-lg mb-2">🎯</div>
            <p className="text-muted-foreground">No scores yet for {selectedDifficulty} difficulty</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Complete a puzzle to see your score here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-6 gap-4 text-xs font-bold text-foreground uppercase tracking-wide pb-3 border-b border-border mb-2">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-2">Player Name</div>
              <div className="col-span-1 text-center">Time</div>
              <div className="col-span-1 text-center">Hints</div>
              <div className="col-span-1 text-center">Score</div>
            </div>

            {/* Scores */}
            {currentScores.map((score, index) => {
              const isCurrentScore = currentScore && score.id === currentScore.id;
              const isEvenRow = index % 2 === 0;
              
              return (
                <div
                  key={score.id}
                  className={`grid grid-cols-6 gap-4 py-3 px-2 transition-colors ${
                    isCurrentScore 
                      ? 'bg-primary/10 border-2 border-primary/20 rounded-lg' 
                      : isEvenRow 
                        ? 'bg-muted/20 hover:bg-muted/40' 
                        : 'bg-background hover:bg-muted/30'
                  }`}
                >
                  <div className="col-span-1 flex items-center justify-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-md' : 
                        index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md' :
                        'bg-muted text-muted-foreground'}
                    `}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex items-center">
                    <span className={`font-medium truncate ${isCurrentScore ? 'text-primary font-bold' : 'text-foreground'}`}>
                      {score.playerName}
                    </span>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="font-mono text-sm font-semibold text-foreground">{formatTime(score.timeElapsed)}</span>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <span className={`text-sm font-medium ${score.hintsUsed === 0 ? 'text-green-600 font-bold' : 'text-muted-foreground'}`}>
                      {score.hintsUsed === 0 ? '0 🎯' : score.hintsUsed}
                    </span>
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="font-bold text-base text-foreground">{score.score}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center p-6 border-t border-border bg-muted/30">
        <div className="text-sm text-muted-foreground">
          Scores are saved locally on your device
        </div>
        
        <div className="space-x-2">
          {!showClearConfirmation ? (
            <Button
              onClick={() => setShowClearConfirmation(true)}
              variant="outline"
              size="sm"
              disabled={Object.values(scores).every(arr => arr.length === 0)}
            >
              Clear All Scores
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-destructive">Are you sure?</span>
              <Button
                onClick={handleClearScores}
                variant="destructive"
                size="sm"
              >
                Yes, Clear
              </Button>
              <Button
                onClick={() => setShowClearConfirmation(false)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Top10Scores;