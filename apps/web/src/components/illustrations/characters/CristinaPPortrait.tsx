import React from 'react';

interface Props { size?: number }

function pxCP(c: number, r: number, w: number, h: number, fill: string, op?: number): React.ReactElement {
  return op != null
    ? <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} opacity={op} />
    : <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} />;
}

export function CristinaPPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
      role="img" aria-label="Cristina Pérez"
    >
      {pxCP(0,  0, 20, 20, '#0d1b2a')}
      {pxCP(2, 13, 16,  7, '#1b1b3a')}
      {pxCP(2, 13,  5,  7, '#0d0d25')}
      {pxCP(13,13,  5,  7, '#0d0d25')}
      {pxCP(7, 13,  6,  5, '#fff8e1')}
      {pxCP(8, 11,  4,  3, '#ffcc88')}
      {pxCP(4,  3, 12, 10, '#ffcc88')}
      {pxCP(4,  3, 12,  3, '#3e1a00')}
      {pxCP(2,  6,  3,  5, '#3e1a00')}
      {pxCP(8,  1,  4,  3, '#3e1a00')}
      {pxCP(9,  0,  2,  2, '#3e1a00')}
      {pxCP(2,  6,  3,  4, '#ffcc88')}
      {pxCP(15, 6,  3,  4, '#ffcc88')}
      {pxCP(5,  6,  4,  1, '#3e1a00')}
      {pxCP(11, 6,  4,  1, '#3e1a00')}
      {pxCP(5,  7,  4,  3, '#ffffff')}
      {pxCP(11, 7,  4,  3, '#ffffff')}
      {pxCP(6,  8,  2,  2, '#2c1a0a')}
      {pxCP(12, 8,  2,  2, '#2c1a0a')}
      {pxCP(7,  8,  1,  1, '#ffffff', 0.7)}
      {pxCP(13, 8,  1,  1, '#ffffff', 0.7)}
      {pxCP(9, 10,  2,  2, '#dda060')}
      {pxCP(7, 12,  1,  1, '#c62828')}
      {pxCP(8, 11,  4,  1, '#c62828')}
      {pxCP(12,12,  1,  1, '#c62828')}
      {pxCP(15, 9,  3,  3, '#666')}
      {pxCP(16,12,  1,  4, '#888')}
      <text x="40" y="76" textAnchor="middle" fontSize="6"
        fill="#ffe082" fontFamily="'Press Start 2P', monospace">C. PEREZ</text>
    </svg>
  );
}
