import { Difficulty } from './sudoku';

/**
 * Represents a single score entry in the leaderboard
 */
export interface ScoreEntry {
  id: string;
  playerName: string;
  difficulty: Difficulty;
  timeElapsed: number; // in seconds
  hintsUsed: number;
  score: number; // calculated score
  completedAt: Date;
}

/**
 * Leaderboard data structure organized by difficulty
 */
export interface Leaderboard {
  easy: ScoreEntry[];
  medium: ScoreEntry[];
  hard: ScoreEntry[];
  expert: ScoreEntry[];
}

/**
 * Props for the Top10Scores component
 */
export interface Top10ScoresProps {
  currentScore?: ScoreEntry;
  onClose?: () => void;
  onClearScores?: () => void;
}

/**
 * Hook return type for score management
 */
export interface UseScoresReturn {
  scores: Leaderboard;
  addScore: (score: Omit<ScoreEntry, 'id' | 'completedAt' | 'score'>) => void;
  clearScores: () => void;
  getTopScores: (difficulty: Difficulty, limit?: number) => ScoreEntry[];
  getCurrentRank: (score: ScoreEntry) => number;
  qualifiesForTop10: (difficulty: Difficulty, timeElapsed: number) => boolean;
}