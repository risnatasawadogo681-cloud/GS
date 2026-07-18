import React from 'react';

export default function QRCodeSimulator({ value = "verification-url", size = 120 }) {
  // Generate a deterministic 21x21 grid based on the string hash
  const getGrid = (seed) => {
    const grid = Array(21).fill(null).map(() => Array(21).fill(false));
    
    // Hash helper
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Pseudo-random based on hash
    const random = (idx) => {
      const x = Math.sin(hash + idx) * 10000;
      return x - Math.floor(x) > 0.5;
    };

    // Draw Finder Patterns (7x7 blocks at corners)
    const drawFinder = (startX, startY) => {
      for (let x = 0; x < 7; x++) {
        for (let y = 0; y < 7; y++) {
          const isBorder = x === 0 || x === 6 || y === 0 || y === 6;
          const isCenter = x >= 2 && x <= 4 && y >= 2 && y <= 4;
          grid[startX + x][startY + y] = isBorder || isCenter;
        }
      }
    };

    // Top Left
    drawFinder(0, 0);
    // Top Right
    drawFinder(14, 0);
    // Bottom Left
    drawFinder(0, 14);

    // Add alignment pattern near bottom right (5x5)
    for (let x = 12; x < 17; x++) {
      for (let y = 12; y < 17; y++) {
        const isBorder = x === 12 || x === 16 || y === 12 || y === 16;
        const isCenter = x === 14 && y === 14;
        grid[x][y] = isBorder || isCenter;
      }
    }

    // Fill rest of the grid deterministically
    let count = 0;
    for (let x = 0; x < 21; x++) {
      for (let y = 0; y < 21; y++) {
        // Skip finder areas
        const inTopLeft = x < 8 && y < 8;
        const inTopRight = x >= 13 && y < 8;
        const inBottomLeft = x < 8 && y >= 13;
        
        if (!inTopLeft && !inTopRight && !inBottomLeft) {
          grid[x][y] = random(count++);
        }
      }
    }

    return grid;
  };

  const grid = getGrid(value);
  const cellSize = size / 21;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#fff', padding: '6px', borderRadius: '8px' }}>
      {grid.map((row, rIdx) => 
        row.map((cell, cIdx) => {
          if (!cell) return null;
          
          // Use colors that match the QR code styling
          let fill = '#11131c';
          
          // Let's paint the corner finder patterns with a sleek purple/indigo to make it feel premium
          const isFinderTopLeft = rIdx < 7 && cIdx < 7;
          const isFinderTopRight = rIdx >= 14 && cIdx < 7;
          const isFinderBottomLeft = rIdx < 7 && cIdx >= 14;
          
          if (isFinderTopLeft || isFinderTopRight || isFinderBottomLeft) {
            fill = '#6d28d9'; // Purple finder accent
          }

          return (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={rIdx * cellSize}
              y={cIdx * cellSize}
              width={cellSize + 0.2} // slight overlap to prevent gaps
              height={cellSize + 0.2}
              fill={fill}
            />
          );
        })
      )}
      {/* Brand accent in the center (3x3 cell size) */}
      <rect 
        x={9 * cellSize} 
        y={9 * cellSize} 
        width={3 * cellSize} 
        height={3 * cellSize} 
        fill="#db2777" // Neon pink brand dot
        rx={cellSize / 2}
      />
    </svg>
  );
}
