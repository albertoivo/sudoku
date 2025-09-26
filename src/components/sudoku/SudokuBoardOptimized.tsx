'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import { SudokuBoardProps, CellPosition, CellValue } from '@/types/sudoku';
import { cn } from '@/lib/utils';
import { arePositionsEqual, createConflictKey, isValidSudokuNumber } from '@/utils/gameHelpers';

/**
 * Optimized Sudoku Board component using event delegation for better performance.
 * Uses a single event listener on the parent container instead of individual listeners on each cell.
 * This approach reduces memory usage and improves performance with 81 interactive cells.
 */
const SudokuBoardOptimized: React.FC<SudokuBoardProps> = ({
  grid,
  selectedCell,
  onCellSelect,
  onCellChange,
  conflicts,
  initialGrid
}) => {
  const boardRef = useRef<HTMLDivElement>(null);

  /**
   * Event delegation handler for all board interactions.
   * Captures events from child cells and routes them appropriately.
   * Reduces the number of event listeners from 81 to 1 for better performance.
   */
  const handleBoardInteraction = useCallback((event: React.MouseEvent | React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    
    // Find the cell element (could be the input or a parent)
    const cellElement = target.closest('[data-cell]') as HTMLElement;
    if (!cellElement) return;

    // Extract cell position from data attributes
    const row = parseInt(cellElement.dataset.row || '0', 10);
    const col = parseInt(cellElement.dataset.col || '0', 10);
    const position: CellPosition = { row, col };
    
    // Check if cell is prefilled (cannot be modified)
    const isPrefilled = initialGrid[row][col] !== 0;

    if (event.type === 'click') {
      // Handle cell selection via event delegation
      onCellSelect(position);
    } else if (event.type === 'keydown') {
      const keyEvent = event as React.KeyboardEvent;
      
      // Handle number input (1-9) via event delegation
      if (keyEvent.key >= '1' && keyEvent.key <= '9') {
        keyEvent.preventDefault();
        if (!isPrefilled) {
          const value = parseInt(keyEvent.key, 10) as CellValue;
          onCellChange(position, value);
        }
      }
      
      // Handle delete/backspace via event delegation  
      if (keyEvent.key === 'Delete' || keyEvent.key === 'Backspace') {
        keyEvent.preventDefault();
        if (!isPrefilled) {
          onCellChange(position, 0);
        }
      }

      // Handle arrow key navigation via event delegation
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(keyEvent.key)) {
        keyEvent.preventDefault();
        const newPosition = getNextPosition(position, keyEvent.key as any);
        onCellSelect(newPosition);
        
        // Focus the new cell
        const newCellElement = boardRef.current?.querySelector(`[data-row="${newPosition.row}"][data-col="${newPosition.col}"]`) as HTMLInputElement;
        newCellElement?.focus();
      }
    }
  }, [onCellSelect, onCellChange, initialGrid]);

  /**
   * Handles input changes via event delegation for number entry.
   * Processes direct text input in addition to keyboard events.
   */
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const cellElement = target.closest('[data-cell]') as HTMLElement;
    if (!cellElement) return;

    const row = parseInt(cellElement.dataset.row || '0', 10);
    const col = parseInt(cellElement.dataset.col || '0', 10);
    const position: CellPosition = { row, col };
    
    const newValue = target.value;
    
    if (newValue === '' || newValue === '0') {
      onCellChange(position, 0);
    } else if (isValidSudokuNumber(newValue)) {
      onCellChange(position, parseInt(newValue, 10) as CellValue);
    }
  }, [onCellChange]);

  /**
   * Gets the next cell position for keyboard navigation.
   * Used by the event delegation system for arrow key handling.
   */
  const getNextPosition = (current: CellPosition, direction: string): CellPosition => {
    const { row, col } = current;
    
    switch (direction) {
      case 'ArrowUp':
        return { row: Math.max(0, row - 1), col };
      case 'ArrowDown':
        return { row: Math.min(8, row + 1), col };
      case 'ArrowLeft':
        return { row, col: Math.max(0, col - 1) };
      case 'ArrowRight':
        return { row, col: Math.min(8, col + 1) };
      default:
        return current;
    }
  };

  // Focus the selected cell when selection changes
  useEffect(() => {
    if (selectedCell && boardRef.current) {
      const cellElement = boardRef.current.querySelector(
        `[data-row="${selectedCell.row}"][data-col="${selectedCell.col}"]`
      ) as HTMLInputElement;
      cellElement?.focus();
    }
  }, [selectedCell]);

  return (
    <div className="inline-block p-4 bg-white rounded-lg shadow-lg border-4 border-gray-800">
      <div 
        ref={boardRef}
        className="grid grid-cols-9 gap-0"
        onClick={handleBoardInteraction}
        onKeyDown={handleBoardInteraction}
      >
        {grid.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const conflictKey = createConflictKey(rowIndex, colIndex);
            const isSelected = arePositionsEqual(selectedCell, position);
            const isPrefilled = initialGrid[rowIndex][colIndex] !== 0;
            const hasConflict = conflicts.has(conflictKey);
            
            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cellValue === 0 ? '' : cellValue.toString()}
                onChange={handleInputChange}
                maxLength={1}
                disabled={isPrefilled}
                data-cell="true"
                data-row={rowIndex}
                data-col={colIndex}
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
                  (colIndex + 1) % 3 === 0 && colIndex !== 8 && 'border-r-2 border-r-gray-800',
                  (rowIndex + 1) % 3 === 0 && rowIndex !== 8 && 'border-b-2 border-b-gray-800'
                )}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SudokuBoardOptimized;