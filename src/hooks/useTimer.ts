import { useState, useEffect, useCallback } from 'react';
import { UseTimerReturn } from '@/types/sudoku';
import { formatTime } from '@/utils/gameHelpers';

/**
 * Custom hook for managing game timer
 */
export const useTimer = (autoStart = false): UseTimerReturn => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev: number) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setTimeElapsed(0);
    setIsRunning(false);
  }, []);

  return {
    timeElapsed,
    isRunning,
    start,
    stop,
    reset,
    formatTime
  };
};