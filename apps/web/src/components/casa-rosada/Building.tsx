import type { Sky } from './getCasaRosadaMood.js';
import { px } from './px.js';

const PINK = '#E3A1A4';
const PINK_SHADOW = '#C4878B';
const PINK_LIGHT = '#EFBDBF';
const TRIM = '#F2EADC';
const TRIM_SHADOW = '#CFC3AE';
const DARK = '#2A1F2A';

const WING_WINDOWS = [28, 34, 40, 46, 52, 58, 97, 103, 109, 115, 121, 127];
const CORNER_WINDOWS = [18, 138];
const FLOORS = [
  { y: 43, h: 5 },
  { y: 53, h: 6 },
  { y: 63, h: 7 },
];

const TINT_AREAS = [
  [14, 30, 12, 40],
  [134, 30, 12, 40],
  [26, 36, 108, 34],
  [66, 27, 28, 9],
  [70, 26, 20, 1],
  [72, 25, 16, 1],
  [74, 24, 12, 1],
  [77, 23, 6, 1],
];

const NIGHT_TINT: Record<Exclude<Sky, 'day'>, number> = { dusk: 0.18, night: 0.42 };

function Cornice({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      {px(x, y, w, 1, TRIM)}
      {px(x, y + 1, w, 1, PINK_SHADOW)}
    </g>
  );
}

function Balustrade({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g>
      {px(x, y, w, 1, TRIM)}
      {Array.from({ length: Math.floor(w / 2) }, (_, i) => px(x + i * 2, y + 1, 1, 2, TRIM_SHADOW, i))}
      {px(x, y + 3, w, 1, TRIM)}
    </g>
  );
}

function Facade() {
  return (
    <g>
      {px(14, 40, 132, 30, PINK)}
      {px(14, 33, 12, 7, PINK)}
      {px(134, 33, 12, 7, PINK)}
      {px(66, 28, 28, 12, PINK)}
      {px(14, 40, 132, 2, PINK_LIGHT)}
      <Balustrade x={26} y={36} w={40} />
      <Balustrade x={94} y={36} w={40} />
      <Balustrade x={14} y={30} w={12} />
      <Balustrade x={134} y={30} w={12} />
      <Cornice x={14} y={50} w={132} />
      <Cornice x={14} y={60} w={132} />
      {[14, 25, 66, 70, 89, 93, 134, 145].map((x, i) => px(x, 33, 1, 37, TRIM_SHADOW, i))}
    </g>
  );
}

function Pediment() {
  return (
    <g>
      {px(66, 27, 28, 1, TRIM)}
      {px(70, 26, 20, 1, TRIM)}
      {px(72, 25, 16, 1, PINK)}
      {px(74, 24, 12, 1, TRIM)}
      {px(77, 23, 6, 1, TRIM)}
      {px(80, 8, 1, 15, '#8A9BAA')}
      {px(81, 8, 11, 2, '#74ACDF')}
      {px(81, 10, 11, 2, '#FFFFFF')}
      {px(81, 12, 11, 2, '#74ACDF')}
      {px(86, 10, 1, 2, '#F6B40E')}
    </g>
  );
}

function MainArch() {
  return (
    <g>
      {px(76, 51, 8, 1, TRIM)}
      {px(74, 52, 12, 1, TRIM)}
      {px(72, 54, 16, 16, TRIM)}
      {px(73, 53, 14, 1, TRIM)}
      {px(77, 52, 6, 1, DARK)}
      {px(75, 53, 10, 1, DARK)}
      {px(74, 54, 12, 1, DARK)}
      {px(73, 55, 14, 15, DARK)}
      {px(76, 60, 8, 10, '#4A3B3F')}
    </g>
  );
}

function Balcony() {
  return (
    <g>
      {px(77, 42, 6, 7, DARK)}
      {px(76, 41, 8, 1, TRIM)}
      {px(74, 48, 12, 1, TRIM)}
      {[74, 76, 78, 80, 82, 84].map((x, i) => px(x, 49, 1, 1, TRIM_SHADOW, i))}
      {px(74, 50, 12, 1, TRIM)}
    </g>
  );
}

function Windows({ sky }: { sky: Sky }) {
  const columns = [...WING_WINDOWS, ...CORNER_WINDOWS];
  return (
    <g>
      {FLOORS.flatMap(({ y, h }, floor) =>
        columns.map((x, i) => {
          const lit = sky !== 'day' && (i + floor) % 3 !== 0;
          const width = CORNER_WINDOWS.includes(x) ? 4 : 3;
          return (
            <g key={`${floor}-${x}`}>
              {px(x - 1, y - 1, width + 2, 1, TRIM)}
              {px(x, y, width, h, lit ? '#F6D36B' : '#34405E')}
              {!lit && px(x, y, width, 1, '#6F86A8')}
            </g>
          );
        }),
      )}
    </g>
  );
}

export function Building({ sky }: { sky: Sky }) {
  return (
    <g>
      <Facade />
      <Pediment />
      <MainArch />
      <Balcony />
      {sky !== 'day' && (
        <g fill="#0D1B2A" opacity={NIGHT_TINT[sky]}>
          {TINT_AREAS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} />
          ))}
        </g>
      )}
      <Windows sky={sky} />
    </g>
  );
}
