import type { Layer } from './pixelGrid.js';
import type { PortraitMood } from './types.js';

export const BACKGROUND: Layer = {
  top: 0,
  rows: [
    ...Array<string>(16).fill('x'.repeat(20)),
    ...Array<string>(16).fill('y'.repeat(20)),
    ...Array<string>(16).fill('x'.repeat(20)),
  ],
};

export const BODY: Layer = {
  top: 27,
  rows: [
    '................kKKK',
    '................kKKK',
    '................kKKK',
    '..............WWkKKK',
    '.........SSSSSWWWkKK',
    '.......SSSSSSLSWWWKT',
    '.....sSSSSSSSLSSWWWT',
    '....sSSSSSSSSSLSSWWT',
    '...sSSSSSSSSSSLSSWWT',
    '..sSSSSSSSSSSSSLSSWT',
    '..sSSSSSSSSSSSSLSSWT',
    '.sSSSSSSSSSSSSSSLSWT',
    '.sSSSSSSSSSSSSSSLSWT',
    'ssSSSSSSSSSSSSSSSLWT',
    'ssSSSSSSSSSSSSSSSLWT',
    'ssSSSSSSSSSSSSSSSSLT',
    'ssSSSSSSSSSSSSSSSSLT',
    'ssSSSSSSSSSSSSSSSSLT',
    'ssSSSSSSSSSSSSSSSSLT',
    'ssSSSSSSSSSSSSSSSSLT',
    'ssSSSSSSSSSSSSSSSSLT',
  ],
};

export const HEAD: Layer = {
  top: 8,
  rows: [
    '................KKKK',
    '..............KKKKKK',
    '.............KKKKKhh',
    '.............KKKKKKh',
    '............KKKKKKKK',
    '............KKKKKKKK',
    '............KKKKKKKK',
    '............KKKKKKKK',
    '...........kKKKKKKKK',
    '...........kkKKKKKKK',
    '...........kKKKKKKKK',
    '............KKKKKKKK',
    '............kKKKKKKK',
    '............kKKKKKKK',
    '.............kKKKKKK',
    '.............kKKKKKK',
    '..............kKKKKK',
    '...............kKKKK',
    '................kkkk',
  ],
};

export const NOSE: Layer = {
  top: 18,
  rows: ['...................h', '...................h', '..................kK', '.................kkk'],
};

export const BROWS: Layer = { top: 14, rows: ['.............bbbb...'] };

const EYES: Record<PortraitMood, Layer> = {
  neutral: { top: 16, rows: ['..............wpw...', '..............kpk...'] },
  victory: { top: 16, rows: ['..............kkk...', '.............k...k..'] },
  panic: { top: 15, rows: ['..............www...', '..............wpw...', '..............www...'] },
};

const MOUTHS: Record<PortraitMood, Layer> = {
  neutral: { top: 23, rows: ['.................mmm'] },
  victory: { top: 22, rows: ['................m...', '.................ttt', '.................mmm'] },
  panic: {
    top: 22,
    rows: ['..................mm', '.................mOO', '.................mOO', '..................mm'],
  },
};

const PANIC_EXTRAS: Layer[] = [
  { top: 12, rows: ['.............bbbb...'] },
  { top: 18, rows: ['..............q.....', '..............q.....', '...............q....'] },
];

export function moodLayers(mood: PortraitMood): Layer[] {
  return [EYES[mood], MOUTHS[mood], ...(mood === 'panic' ? PANIC_EXTRAS : [])];
}

export const SHARED_PALETTE = {
  w: '#F2EEE6',
  m: '#8A3B2E',
  t: '#FFFFFF',
  O: '#3A1410',
  q: '#88C8F0',
};
