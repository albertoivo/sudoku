'use client';

import React from 'react';
import { SudokuCellProps } from '@/types/sudoku';
import { cn } from '@/lib/utils';
import { isValidSudokuNumber } from '@/utils/gameHelpers';

const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  isSelected,
  isPrefilled,
  hasConflict,
  position,
  onSelect,
  onChange
}) => {
  const handleClick = () => {
    onSelect(position);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle number input
    if (e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      if (!isPrefilled) {
        onChange(position, parseInt(e.key, 10) as any);
      }
    }
    
    // Handle delete/backspace
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (!isPrefilled) {
        onChange(position, 0);
      }
    }

    // Handle arrow keys for navigation
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      // Navigation will be handled by the parent component
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (newValue === '' || newValue === '0') {
      onChange(position, 0);
    } else if (isValidSudokuNumber(newValue)) {
      onChange(position, parseInt(newValue, 10) as any);
    }
  };

  return (
    <input
      type="text"
      value={value === 0 ? '' : value.toString()}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      maxLength={1}
      disabled={isPrefilled}
      className={cn(
        // Base styles
        'w-12 h-12 text-center text-lg font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        
        // Default state
        'bg-white border-gray-300',
        
        // Hover state (for non-prefilled cells)
        !isPrefilled && 'hover:bg-gray-50',
        
        // Prefilled cells
        isPrefilled && 'bg-gray-200 text-gray-800 cursor-not-allowed font-bold',
        
        // Selected cell
        isSelected && 'bg-blue-100 border-blue-500 ring-2 ring-blue-500',
        
        // Conflict state
        hasConflict && 'bg-red-100 text-red-600 border-red-400',
        
        // Box borders (thick borders for 3x3 sections)
        (position.col + 1) % 3 === 0 && position.col !== 8 && 'border-r-2 border-r-gray-800',
        (position.row + 1) % 3 === 0 && position.row !== 8 && 'border-b-2 border-b-gray-800'
      )}
    />
  );
};

export default SudokuCell;