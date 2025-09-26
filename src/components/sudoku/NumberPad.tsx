'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { CellValue } from '@/types/sudoku';

interface NumberPadProps {
  onNumberSelect: (number: CellValue) => void;
  onClear: () => void;
  disabled?: boolean;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  onClear,
  disabled = false
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">Number Pad</h3>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {numbers.map((number) => (
          <Button
            key={number}
            onClick={() => onNumberSelect(number)}
            disabled={disabled}
            variant="outline"
            className="aspect-square text-lg font-semibold hover:bg-blue-50 hover:border-blue-300"
          >
            {number}
          </Button>
        ))}
      </div>

      <Button
        onClick={onClear}
        disabled={disabled}
        variant="destructive"
        className="w-full"
        size="sm"
      >
        Clear
      </Button>
    </div>
  );
};

export default NumberPad;