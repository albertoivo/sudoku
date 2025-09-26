'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { CellValue } from '@/types/sudoku';

interface NumberPadProps {
  onNumberSelect: (number: CellValue) => void;
  onClear: () => void;
  disabled?: boolean;
}

/**
 * Number Pad component provides a visual interface for number input.
 * 
 * Features:
 * - 3x3 grid layout for numbers 1-9
 * - Clear button to remove numbers
 * - Disabled state support
 * - Hover effects and visual feedback
 * - Mobile-friendly touch targets
 */
const NumberPad: React.FC<NumberPadProps> = ({
  onNumberSelect,
  onClear,
  disabled = false
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

  return (
    <div className="p-4 bg-card rounded-lg shadow-md border border-border">
      <h3 className="text-sm font-medium text-foreground mb-3 text-center">Number Pad</h3>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {numbers.map((num) => (
          <Button
            key={num}
            onClick={() => onNumberSelect(num)}
            disabled={disabled}
            variant="outline"
            className="aspect-square text-lg font-semibold hover:bg-primary/10 hover:border-primary"
          >
            {num}
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