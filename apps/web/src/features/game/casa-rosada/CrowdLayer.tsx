import type React from 'react';
import type { CrowdLevel } from './getCasaRosadaMood.js';
import { px } from './px.js';

const CROWD_SIZE: Record<CrowdLevel, number> = { 0: 0, 1: 18, 2: 40, 3: 64 };
const SHIRTS = ['#74ACDF', '#ECE8E0', '#C0392B', '#2E4A7A', '#6B8E23', '#8E44AD', '#D35400'];
const SKINS = ['#E8C39E', '#C99A6E', '#A0714F'];
const ROWS = 5;

function Bob({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;0 -1;0 0"
        dur="0.7s"
        begin={`${(index % 5) * 0.13}s`}
        repeatCount="indefinite"
      />
      {children}
    </g>
  );
}

function Protester({ index, level }: { index: number; level: CrowdLevel }) {
  const row = index % ROWS;
  const x = ((index * 29 + row * 7) % 152) + 4;
  const y = 74 + row * 3;
  const shirt = level === 3 && index % 4 === 0 ? '#1B1B1B' : SHIRTS[index % SHIRTS.length]!;
  const holdsSign = index % 7 === 0;
  const holdsPot = level >= 2 && index % 3 === 1;
  return (
    <Bob index={index}>
      {holdsSign && (
        <g>
          {px(x, y - 4, 1, 4, '#7A5530')}
          {px(x - 2, y - 7, 5, 3, '#ECE8E0')}
          {px(x - 1, y - 6, 3, 1, index % 2 ? '#C0392B' : '#74ACDF')}
        </g>
      )}
      {holdsPot && px(x + 2, y - 2, 2, 1, '#9AA3AD')}
      {px(x, y, 2, 1, '#2B2118')}
      {px(x, y + 1, 2, 1, SKINS[index % SKINS.length]!)}
      {px(x, y + 2, 2, 5, shirt)}
    </Bob>
  );
}

function PoliceLine() {
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const x = 55 + i * 4;
        return (
          <g key={i}>
            {px(x, 70, 2, 1, '#1B2A44')}
            {px(x, 71, 2, 1, '#E8C39E')}
            {px(x, 72, 2, 4, '#22345A')}
            {px(x + 2, 71, 1, 4, '#9FB3C8')}
          </g>
        );
      })}
    </g>
  );
}

export function CrowdLayer({ level, police }: { level: CrowdLevel; police: boolean }) {
  const people = Array.from({ length: CROWD_SIZE[level] }, (_, i) => i).sort(
    (a, b) => (a % ROWS) - (b % ROWS),
  );
  return (
    <g>
      {police && <PoliceLine />}
      {people.map((index) => (
        <Protester key={index} index={index} level={level} />
      ))}
    </g>
  );
}
