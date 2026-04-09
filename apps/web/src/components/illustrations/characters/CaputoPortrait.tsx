import React from 'react';

interface Props { size?: number }

function px(c: number, r: number, w: number, h: number, fill: string, op?: number): React.ReactElement {
  return op != null
    ? <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} opacity={op} />
    : <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} />;
}

export function CaputoPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
      role="img" aria-label="Luis Caputo"
    >
      {px(0,  0, 20, 20, '#0d1b2a')}
      {px(2, 13, 16,  7, '#1a237e')}
      {px(2, 13,  5,  7, '#0d1545')}
      {px(13,13,  5,  7, '#0d1545')}
      {px(7, 13,  6,  5, '#eceff1')}
      {px(9, 13,  2,  5, '#c62828')}
      {px(8, 11,  4,  3, '#ffcc88')}
      {px(4,  2, 12, 11, '#ffcc88')}
      {px(4,  2, 12,  1, '#e8b888')}
      {px(2,  5,  3,  4, '#ffcc88')}
      {px(15, 5,  3,  4, '#ffcc88')}
      {px(5,  6,  4,  1, '#666')}
      {px(11, 6,  4,  1, '#666')}
      {px(5,  7,  4,  3, '#ffffff')}
      {px(11, 7,  4,  3, '#ffffff')}
      {px(6,  8,  2,  2, '#1a1a1a')}
      {px(12, 8,  2,  2, '#1a1a1a')}
      {px(7,  8,  1,  1, '#ffffff', 0.8)}
      {px(13, 8,  1,  1, '#ffffff', 0.8)}
      {px(9, 10,  2,  2, '#dda060')}
      {px(7, 12,  1,  1, '#a0522d')}
      {px(8, 11,  4,  1, '#a0522d')}
      {px(12,12,  1,  1, '#a0522d')}
      <text x="40" y="76" textAnchor="middle" fontSize="6"
        fill="#ffe082" fontFamily="'Press Start 2P', monospace">CAPUTO</text>
    </svg>
  );
}
