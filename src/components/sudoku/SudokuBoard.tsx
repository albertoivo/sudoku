'use client';

import React from 'react';
import SudokuCell from './SudokuCell';
import { SudokuBoardProps } from '@/types/sudoku';

import { arePositionsEqual, createConflictKey } from '@/utils/gameHelpers';

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  grid,
  selectedCell,
  onCellSelect,
  onCellChange,
  conflicts,
  initialGrid
}) => {
  return (
    <div className="inline-block p-4 bg-white rounded-lg shadow-lg border-4 border-gray-800">
      <div className="grid grid-cols-9 gap-0">
        {grid.map((row, rowIndex) =>
          row.map((cellValue, colIndex) => {
            const position = { row: rowIndex, col: colIndex };
            const conflictKey = createConflictKey(rowIndex, colIndex);
            
            return (
              <SudokuCell
                key={`${rowIndex}-${colIndex}`}
                value={cellValue}
                isSelected={arePositionsEqual(selectedCell, position)}
                isPrefilled={initialGrid[rowIndex][colIndex] !== 0}
                hasConflict={conflicts.has(conflictKey)}
                position={position}
                onSelect={onCellSelect}
                onChange={onCellChange}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SudokuBoard;