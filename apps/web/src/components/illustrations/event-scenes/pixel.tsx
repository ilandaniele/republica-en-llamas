import type React from 'react';
import type { GameState } from '@republica/game-engine';

export interface SceneProps {
  presidentId: string;
  gameState: GameState | null;
}

// ViewBox: 320×180. Each "pixel" = 8 SVG units → 40×22 grid.
export const P = 8;
// px(col, row, wCols, hRows, fill) → single rect on the 8px grid
export function px(col: number, row: number, wCols: number, hRows: number, fill: string): React.ReactElement {
  return <rect x={col * P} y={row * P} width={wCols * P} height={hRows * P} fill={fill} />;
}
// px2 P=4 fine-detail grid (80x45 canvas) for detail layers
export function px2(
  col: number,
  row: number,
  wCols: number,
  hRows: number,
  fill: string,
): React.ReactElement {
  return <rect x={col * 4} y={row * 4} width={wCols * 4} height={hRows * 4} fill={fill} />;
}
// Pixel-art label bar (y=160, height=20)
export function lbl(text: string, col = '#ECE8E0'): React.ReactElement {
  return (
    <>
      <rect x={0} y={160} width={320} height={20} fill="rgba(9,21,37,0.92)" />
      <text
        x={8}
        y={174}
        fill={col}
        fontSize={8}
        fontFamily="'Press Start 2P'"
        style={{ imageRendering: 'pixelated' as const }}
      >
        {text}
      </text>
    </>
  );
}

// ── Pixel palette (design-token aligned) ────────────────────────────────────
export const P_BG = '#0D1B2A'; // night-blue (background)
export const P_NAV = '#162032'; // deep navy
export const P_SLT = '#2A3D52'; // slate panel
export const P_GR = '#3D5468'; // medium gray-blue
export const P_CB = '#74ACDF'; // celeste (Argentine flag)
export const P_GD = '#F6B40E'; // gold-400
export const P_CR = '#CC2200'; // crisis crimson (only for crisis)
export const P_WH = '#ECE8E0'; // warm white
export const P_SK = '#D4956A'; // skin tone
export const P_YL = '#FFD84D'; // yellow
export const P_RD = '#EF3030'; // bright red
export const P_GN = '#3AA858'; // green
export const P_LB = '#B3D4F0'; // light blue sky
export const P_OR = '#FF7B2A'; // orange / fire
export const P_DG = '#1E3A1E'; // dark green
export const P_BR = '#7A5530'; // brown
export const P_GR2 = '#8A9BAA'; // light gray
export const P_BK = '#080C12'; // near black
