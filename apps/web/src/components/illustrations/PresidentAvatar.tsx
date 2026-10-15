import type { GameState } from '@republica/game-engine';

interface Props {
  state: GameState;
  size?: number;
}

type Mood = 'happy' | 'tired' | 'panic';

// P=4: 30x30 tile grid in 120x120 viewBox
type PixelRect = [c: number, r: number, w: number, h: number, fill: string, opacity?: number];

interface Palette {
  suit: string;
  dark: string;
  skin: string;
  tie: string;
}

const HAIR = '#4a2c0a';
const PUPIL = '#1a0a00';
const LIP = '#a0522d';

const PALETTES: Record<Mood, Palette> = {
  happy: { suit: '#1a237e', dark: '#0d1545', skin: '#ffe0b2', tie: '#c62828' },
  tired: { suit: '#37474f', dark: '#263238', skin: '#ffe0b2', tie: '#c62828' },
  panic: { suit: '#4a0000', dark: '#2a0000', skin: '#ffccbc', tie: '#cc0000' },
};

const CRISIS_SMOKE: PixelRect[] = [
  [1, 1, 4, 3, '#444', 0.55],
  [4, 3, 3, 2, '#555', 0.4],
  [22, 1, 4, 3, '#444', 0.55],
  [25, 2, 3, 3, '#333', 0.35],
];

const HAIR_RECTS: Record<Mood, PixelRect[]> = {
  happy: [
    [9, 3, 12, 3, HAIR],
    [7, 5, 2, 2, HAIR],
    [21, 5, 2, 2, HAIR],
  ],
  tired: [
    [9, 3, 12, 2, HAIR],
    [18, 2, 4, 3, HAIR],
    [7, 5, 2, 2, HAIR],
    [21, 5, 2, 2, HAIR],
  ],
  panic: [
    [9, 2, 3, 4, HAIR],
    [12, 1, 3, 5, HAIR],
    [15, 2, 3, 4, HAIR],
    [18, 1, 3, 5, HAIR],
    [7, 3, 2, 4, HAIR],
    [21, 2, 2, 5, HAIR],
  ],
};

const CALM_EYEBROWS: PixelRect[] = [
  [10, 8, 4, 1, HAIR],
  [16, 8, 4, 1, HAIR],
];

const EYEBROW_RECTS: Record<Mood, PixelRect[]> = {
  happy: CALM_EYEBROWS,
  tired: CALM_EYEBROWS,
  panic: [
    [10, 7, 4, 1, HAIR],
    [16, 7, 4, 1, HAIR],
    [10, 8, 1, 1, HAIR],
    [19, 8, 1, 1, HAIR],
  ],
};

const EYE_WHITES: PixelRect[] = [
  [10, 9, 4, 3, '#ffffff'],
  [16, 9, 4, 3, '#ffffff'],
];

const EYELID_RECTS: Record<Mood, PixelRect[]> = {
  happy: [],
  tired: [
    [10, 9, 4, 1, PALETTES.tired.skin],
    [16, 9, 4, 1, PALETTES.tired.skin],
  ],
  panic: [],
};

const PUPIL_RECTS: Record<Mood, PixelRect[]> = {
  happy: [
    [11, 10, 2, 2, PUPIL],
    [17, 10, 2, 2, PUPIL],
    [12, 10, 1, 1, '#ffffff', 0.7],
    [18, 10, 1, 1, '#ffffff', 0.7],
  ],
  tired: [
    [11, 11, 2, 2, PUPIL],
    [17, 11, 2, 2, PUPIL],
  ],
  panic: [
    [10, 9, 2, 3, PUPIL],
    [17, 9, 2, 3, PUPIL],
    [12, 10, 1, 1, '#cc0000', 0.55],
    [18, 10, 1, 1, '#cc0000', 0.55],
  ],
};

const NOSE: PixelRect[] = [[14, 12, 2, 3, '#cc8855']];

const MOUTH_RECTS: Record<Mood, PixelRect[]> = {
  happy: [
    [11, 15, 1, 1, LIP],
    [12, 14, 5, 1, LIP],
    [17, 15, 1, 1, LIP],
  ],
  tired: [[11, 15, 8, 1, LIP]],
  panic: [
    [11, 14, 1, 1, LIP],
    [12, 15, 5, 1, LIP],
    [17, 14, 1, 1, LIP],
  ],
};

const FLOATING_MONEY: PixelRect[] = [
  [1, 7, 4, 2, '#4caf50'],
  [2, 8, 2, 1, '#1b5e20'],
  [24, 8, 4, 2, '#4caf50'],
  [25, 9, 2, 1, '#1b5e20'],
  [0, 12, 3, 2, '#81c784', 0.7],
  [26, 13, 3, 2, '#81c784', 0.7],
];

function bodyRects({ suit, dark, skin, tie }: Palette): PixelRect[] {
  return [
    // Suit
    [3, 17, 24, 13, suit],
    [3, 17, 8, 9, dark],
    [19, 17, 8, 9, dark],
    [11, 17, 8, 8, '#eceff1'],
    [13, 17, 4, 8, tie],
    [12, 17, 6, 2, tie],
    // Neck
    [12, 15, 6, 3, skin],
    // Head + ears
    [9, 3, 12, 13, skin],
    [7, 6, 3, 4, skin],
    [20, 6, 3, 4, skin],
  ];
}

function moodFor(popularity: number): Mood {
  if (popularity > 60) return 'happy';
  return popularity >= 30 ? 'tired' : 'panic';
}

function PixelRects({ rects }: { rects: PixelRect[] }) {
  return (
    <>
      {rects.map(([c, r, w, h, fill, opacity], i) => (
        <rect key={i} x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} opacity={opacity} />
      ))}
    </>
  );
}

export function PresidentAvatar({ state, size = 120 }: Props) {
  const mood = moodFor(state.political.popularity);
  const hasCrisis = state.activeCrises.length > 0;
  const background: PixelRect = [0, 0, 30, 30, hasCrisis ? '#7f0000' : '#0d1b2a'];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      <PixelRects rects={[background]} />
      {hasCrisis && <PixelRects rects={CRISIS_SMOKE} />}
      <PixelRects rects={bodyRects(PALETTES[mood])} />
      <PixelRects rects={HAIR_RECTS[mood]} />
      <PixelRects rects={EYEBROW_RECTS[mood]} />
      <PixelRects rects={EYE_WHITES} />
      <PixelRects rects={EYELID_RECTS[mood]} />
      <PixelRects rects={PUPIL_RECTS[mood]} />
      <PixelRects rects={NOSE} />
      <PixelRects rects={MOUTH_RECTS[mood]} />
      {state.economic.inflation > 50 && (
        <g className="gsap-primary">
          <PixelRects rects={FLOATING_MONEY} />
        </g>
      )}
    </svg>
  );
}
