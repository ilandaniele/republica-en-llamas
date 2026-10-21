import type React from 'react';
import { px } from './px.js';

function Flicker({ dur, children }: { dur: string; children: React.ReactNode }) {
  return (
    <g>
      <animate attributeName="opacity" values="1;0.55;1" dur={dur} repeatCount="indefinite" />
      {children}
    </g>
  );
}

function Barricade({ x }: { x: number }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x + i * 2} y={66} width={3} height={3} fill="#6B6B6B">
          <animate attributeName="y" values="66;46" dur="3s" begin={`${i * 1}s`} repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0.8;0"
            dur="3s"
            begin={`${i * 1}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
      {px(x, 82, 8, 3, '#1B1B1B')}
      <Flicker dur="0.4s">
        {px(x + 1, 76, 6, 6, '#E25822')}
        {px(x + 2, 73, 4, 4, '#F39C12')}
        {px(x + 3, 71, 2, 3, '#F6D36B')}
      </Flicker>
    </g>
  );
}

export function FireLayer() {
  return (
    <g>
      <Barricade x={20} />
      <Barricade x={118} />
    </g>
  );
}

export function Helicopter() {
  return (
    <g>
      <Flicker dur="0.15s">{px(98, 28, 26, 1, '#2B2B2B')}</Flicker>
      {px(110, 29, 1, 2, '#2B2B2B')}
      {px(106, 31, 13, 4, '#3D4A3A')}
      {px(115, 32, 3, 2, '#8FB8D8')}
      {px(98, 32, 8, 1, '#3D4A3A')}
      {px(97, 30, 1, 4, '#2B2B2B')}
      {px(107, 35, 11, 1, '#8A9BAA')}
    </g>
  );
}

const BILLS = [8, 22, 37, 51, 66, 95, 108, 121, 137, 149];

export function DollarRain() {
  return (
    <g>
      {BILLS.map((x, i) => (
        <g key={x}>
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 -10;2 40;0 85"
            dur={`${3 + (i % 3)}s`}
            begin={`${(i * 0.37).toFixed(2)}s`}
            repeatCount="indefinite"
          />
          {px(x, 0, 4, 2, '#3F8F4E')}
          {px(x + 1, 0, 2, 1, '#8BC48A')}
        </g>
      ))}
    </g>
  );
}

const BURSTS = [
  { x: 30, y: 14, color: '#74ACDF' },
  { x: 128, y: 10, color: '#F6B40E' },
  { x: 54, y: 22, color: '#ECE8E0' },
  { x: 108, y: 20, color: '#74ACDF' },
];

export function Fireworks() {
  return (
    <g>
      {BURSTS.map(({ x, y, color }, i) => (
        <g key={i} fill={color} opacity={0}>
          <animate
            attributeName="opacity"
            values="0;1;0"
            dur="1.6s"
            begin={`${i * 0.4}s`}
            repeatCount="indefinite"
          />
          <rect x={x} y={y} width={1} height={1} />
          {[-1, 1].flatMap((d) => [
            <rect key={`h${d}`} x={x + d * 3} y={y} width={2} height={1} />,
            <rect key={`v${d}`} x={x} y={y + d * 3} width={1} height={2} />,
            <rect key={`d${d}`} x={x + d * 2} y={y + d * 2} width={1} height={1} />,
            <rect key={`a${d}`} x={x - d * 2} y={y + d * 2} width={1} height={1} />,
          ])}
        </g>
      ))}
    </g>
  );
}
