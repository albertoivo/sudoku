'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

interface GameStatsProps {
  gamesPlayed: number;
  gamesWon: number;
  bestTime: number;
  currentStreak: number;
}

const GameStats: React.FC<GameStatsProps> = ({
  gamesPlayed,
  gamesWon,
  bestTime,
  currentStreak
}) => {
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
  
  const formatTime = (seconds: number): string => {
    if (seconds === 0) return '--:--';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Your Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{gamesPlayed}</div>
          <div className="text-sm text-gray-600">Games Played</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{winRate}%</div>
          <div className="text-sm text-gray-600">Win Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{formatTime(bestTime)}</div>
          <div className="text-sm text-gray-600">Best Time</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
      </div>
    </div>
  );
};

export default GameStats;