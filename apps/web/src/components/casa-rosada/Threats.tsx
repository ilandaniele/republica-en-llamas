import { px } from './px.js';

const JETS = [
  { x: 40, y: 10 },
  { x: 30, y: 14 },
  { x: 50, y: 14 },
];

function Jet({ x, y }: { x: number; y: number }) {
  return (
    <g>
      {px(x, y, 9, 2, '#5B6670')}
      {px(x + 8, y, 2, 1, '#8A9BAA')}
      {px(x + 3, y - 2, 3, 2, '#3E4852')}
      {px(x + 3, y + 2, 3, 2, '#3E4852')}
      {px(x - 3, y, 3, 1, '#F39C12')}
    </g>
  );
}

export function JetsFallback() {
  return (
    <g>
      {JETS.map((jet, i) => (
        <Jet key={i} {...jet} />
      ))}
    </g>
  );
}

export function MushroomFallback() {
  return (
    <g>
      {px(74, 30, 12, 40, '#B3542A')}
      {px(76, 30, 8, 40, '#E2833A')}
      {px(60, 14, 40, 16, '#8C3B1F')}
      {px(62, 12, 36, 14, '#D9632C')}
      {px(66, 10, 28, 8, '#F6B04A')}
      {px(70, 8, 20, 4, '#FBE08A')}
      {px(56, 40, 48, 4, '#8C3B1F')}
    </g>
  );
}

const GRAVES = [36, 50, 64, 92, 106, 120];

export function GravesFallback() {
  return (
    <g>
      {GRAVES.map((x) => (
        <g key={x}>
          {px(x, 74, 4, 8, '#9AA3AD')}
          {px(x - 1, 76, 6, 2, '#9AA3AD')}
          {px(x - 2, 82, 8, 2, '#4A3B2A')}
        </g>
      ))}
    </g>
  );
}

const RUBBLE = [24, 44, 66, 90, 112, 128];

export function RuinsOverlay() {
  return (
    <g>
      <rect x={0} y={0} width={160} height={90} fill="#120A06" opacity={0.55} />
      {RUBBLE.map((x, i) => (
        <g key={x}>
          {px(x, 62 + (i % 2) * 3, 10, 6, '#3A2E26')}
          {px(x + 2, 60 + (i % 2) * 3, 5, 2, '#5C4A3C')}
        </g>
      ))}
    </g>
  );
}
