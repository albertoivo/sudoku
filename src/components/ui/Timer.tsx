'use client';

import React from 'react';
import { TimerProps } from '@/types/sudoku';
import { formatTime } from '@/utils/gameHelpers';

const Timer: React.FC<TimerProps> = ({ timeElapsed, isRunning }) => {
  return (
    <div className="flex items-center justify-center p-3 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        <span className="text-2xl font-mono font-bold text-gray-800">
          {formatTime(timeElapsed)}
        </span>
      </div>
    </div>
  );
};

export default Timer;