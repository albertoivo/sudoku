import { useCallback } from 'react';
import { ScoreEntry, Leaderboard, UseScoresReturn } from '@/types/scores';
import { Difficulty } from '@/types/sudoku';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing game scores and leaderboard functionality.
 * 
 * Features:
 * - Persistent storage of scores in localStorage
 * - Score calculation based on time and hints used
 * - Top 10 leaderboard per difficulty level
 * - Ranking system for current player
 * - Clear scores functionality
 */
export const useScores = (): UseScoresReturn => {
  const defaultLeaderboard: Leaderboard = {
    easy: [],
    medium: [],
    hard: [],
    expert: []
  };

  const { value: scores, setValue: setScores } = useLocalStorage<Leaderboard>('sudoku-scores', defaultLeaderboard);

  /**
   * Calculates score based on completion time and hints used.
   * Lower time and fewer hints result in higher scores.
   * 
   * @param timeElapsed - Time taken to complete the puzzle (seconds)
   * @param hintsUsed - Number of hints used
   * @param difficulty - Puzzle difficulty level
   */
  const calculateScore = useCallback((timeElapsed: number, hintsUsed: number, difficulty: Difficulty): number => {
    // Base score multipliers by difficulty
    const difficultyMultipliers = {
      easy: 100,
      medium: 200,
      hard: 400,
      expert: 800
    };

    const baseScore = difficultyMultipliers[difficulty];
    
    // Time penalty: lose points for every minute over ideal time
    const idealTimes = { easy: 300, medium: 600, hard: 1200, expert: 2400 }; // in seconds
    const timePenalty = Math.max(0, (timeElapsed - idealTimes[difficulty]) / 60) * 10;
    
    // Hint penalty: lose 20% of base score per hint
    const hintPenalty = hintsUsed * (baseScore * 0.2);
    
    // Calculate final score (minimum 10 points)
    const finalScore = Math.max(10, Math.round(baseScore - timePenalty - hintPenalty));
    
    return finalScore;
  }, []);

  /**
   * Adds a new score entry to the leaderboard
   */
  const addScore = useCallback((newScore: Omit<ScoreEntry, 'id' | 'completedAt' | 'score'>) => {
    const scoreEntry: ScoreEntry = {
      ...newScore,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completedAt: new Date(),
      score: calculateScore(newScore.timeElapsed, newScore.hintsUsed, newScore.difficulty)
    };

    setScores(prevScores => {
      const newScores = { ...prevScores };
      newScores[newScore.difficulty] = [...newScores[newScore.difficulty], scoreEntry]
        .sort((a, b) => a.timeElapsed - b.timeElapsed) // Sort by time ascending (fastest first)
        .slice(0, 10); // Keep only top 10
      
      return newScores;
    });
  }, [calculateScore, setScores]);

  /**
   * Gets top scores for a specific difficulty
   */
  const getTopScores = useCallback((difficulty: Difficulty, limit: number = 10): ScoreEntry[] => {
    return scores[difficulty].slice(0, limit);
  }, [scores]);

  /**
   * Gets the current rank of a score within its difficulty category
   */
  const getCurrentRank = useCallback((score: ScoreEntry): number => {
    const difficultyScores = scores[score.difficulty];
    const sortedScores = [...difficultyScores].sort((a, b) => a.timeElapsed - b.timeElapsed);
    return sortedScores.findIndex(s => s.id === score.id) + 1;
  }, [scores]);

  /**
   * Checks if a time qualifies for the top 10 leaderboard
   */
  const qualifiesForTop10 = useCallback((difficulty: Difficulty, timeElapsed: number): boolean => {
    const currentScores = scores[difficulty];
    
    // If fewer than 10 scores, automatically qualifies
    if (currentScores.length < 10) {
      return true;
    }
    
    // Sort by time (fastest first) and check if new time is better than the worst
    const sortedByTime = [...currentScores].sort((a, b) => a.timeElapsed - b.timeElapsed);
    const worstTime = sortedByTime[9]?.timeElapsed || Infinity;
    
    return timeElapsed < worstTime;
  }, [scores]);

  /**
   * Clears all scores from the leaderboard
   */
  const clearScores = useCallback(() => {
    const emptyLeaderboard: Leaderboard = {
      easy: [],
      medium: [],
      hard: [],
      expert: []
    };
    setScores(emptyLeaderboard);
  }, [setScores]);

  return {
    scores,
    addScore,
    clearScores,
    getTopScores,
    getCurrentRank,
    qualifiesForTop10
  };
};