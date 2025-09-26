'use client';

import React from 'react';
import { TimerProps } from '@/types/sudoku';
import { formatTime } from '@/utils/gameHelpers';

/**
 * Timer component displays the elapsed time for the current game.
 * 
 * Features:
 * - Real-time display of elapsed time in MM:SS format
 * - Visual indicator (green dot) when timer is running
 * - Monospace font for consistent number alignment
 * - Pulse animation when active
 */
const Timer: React.FC<TimerProps> = ({ timeElapsed, isRunning }) => {
  return (
    <div className="flex items-center justify-center p-3 bg-card rounded-lg shadow-md border border-border">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
        <span className="text-2xl font-mono font-bold text-foreground">
          {formatTime(timeElapsed)}
        </span>
      </div>
    </div>
  );
};

export default Timer;