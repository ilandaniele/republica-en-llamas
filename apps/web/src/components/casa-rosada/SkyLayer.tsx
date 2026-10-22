import type { Sky } from './getCasaRosadaMood.js';
import { px } from './px.js';

const SKY_BANDS: Record<Sky, string[]> = {
  day: ['#7FB8E0', '#93C6E8', '#A9D3EE', '#C2E0F2'],
  dusk: ['#2E2A55', '#5B3A66', '#B5584A', '#E3925A'],
  night: ['#081221', '#0D1B2A', '#14253B', '#1C3150'],
};

const STARS = [
  [12, 6],
  [30, 14],
  [47, 4],
  [63, 11],
  [101, 7],
  [118, 15],
  [134, 5],
  [150, 12],
];

function Clouds() {
  return (
    <g fill="#F4F8FB">
      <rect x={18} y={10} width={16} height={3} />
      <rect x={22} y={8} width={8} height={2} />
      <rect x={112} y={16} width={20} height={3} />
      <rect x={117} y={14} width={9} height={2} />
    </g>
  );
}

function Stars() {
  return (
    <g fill="#ECE8E0">
      {STARS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1}>
          <animate
            attributeName="opacity"
            values="0.2;1;0.2"
            dur={`${2 + (i % 3)}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </g>
  );
}

export function SkyLayer({ sky }: { sky: Sky }) {
  const bands = SKY_BANDS[sky];
  return (
    <g>
      {bands.map((color, i) => px(0, i * 18, 160, 18, color, i))}
      {sky === 'day' && <Clouds />}
      {sky === 'night' && <Stars />}
    </g>
  );
}
