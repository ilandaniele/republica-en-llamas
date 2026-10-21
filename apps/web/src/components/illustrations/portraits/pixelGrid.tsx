import type React from 'react';

export const GRID_COLS = 40;
export const GRID_ROWS = 48;
const CELL = 5;
const TRANSPARENT = '.';

export interface Layer {
  top: number;
  rows: string[];
  mirror?: boolean;
}

export type Palette = Record<string, string>;

function expandRow(row: string, mirror: boolean): string {
  return mirror ? row + [...row].reverse().join('') : row;
}

function composeGrid(layers: Layer[]): string[][] {
  const grid = Array.from({ length: GRID_ROWS }, () => Array<string>(GRID_COLS).fill(TRANSPARENT));
  for (const { top, rows, mirror = true } of layers) {
    rows.forEach((row, offset) => {
      const cells = expandRow(row, mirror);
      for (let col = 0; col < Math.min(cells.length, GRID_COLS); col++) {
        const cell = cells[col]!;
        if (cell !== TRANSPARENT && top + offset < GRID_ROWS) grid[top + offset]![col] = cell;
      }
    });
  }
  return grid;
}

export function PixelGrid({ layers, palette }: { layers: Layer[]; palette: Palette }): React.ReactElement {
  const rects: React.ReactElement[] = [];
  composeGrid(layers).forEach((cells, row) => {
    let start = 0;
    for (let col = 1; col <= cells.length; col++) {
      if (cells[col] === cells[start]) continue;
      const fill = palette[cells[start]!];
      if (fill) {
        rects.push(
          <rect
            key={`${row}-${start}`}
            x={start * CELL}
            y={row * CELL}
            width={(col - start) * CELL}
            height={CELL}
            fill={fill}
          />,
        );
      }
      start = col;
    }
  });
  return <g shapeRendering="crispEdges">{rects}</g>;
}
