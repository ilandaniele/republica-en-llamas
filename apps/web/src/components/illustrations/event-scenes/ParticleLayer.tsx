import type React from 'react';

interface ParticleSpec {
  x: number;
  y: number;
  color: string;
  w: number;
  h: number;
  text?: string;
}

const PARTICLES: Partial<Record<string, ParticleSpec[]>> = {
  crisis: [
    { x: 14, y: 0, color: '#ff5722', w: 5, h: 8 },
    { x: 34, y: 0, color: '#ffcc02', w: 4, h: 6 },
    { x: 56, y: 0, color: '#ff7043', w: 6, h: 9 },
    { x: 78, y: 0, color: '#ff5722', w: 4, h: 7 },
    { x: 98, y: 0, color: '#ffcc02', w: 5, h: 8 },
    { x: 118, y: 0, color: '#ff7043', w: 4, h: 6 },
  ],
  economic: [
    { x: 8, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
    { x: 32, y: 0, color: '#f9a825', w: 10, h: 10, text: '$' },
    { x: 58, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
    { x: 82, y: 0, color: '#f9a825', w: 10, h: 10, text: '$' },
    { x: 106, y: 0, color: '#2e7d32', w: 10, h: 10, text: '$' },
  ],
  social: [
    { x: 20, y: 0, color: '#78909c', w: 14, h: 14 },
    { x: 60, y: 0, color: '#90a4ae', w: 10, h: 10 },
    { x: 100, y: 0, color: '#78909c', w: 12, h: 12 },
  ],
};

const ANCHOR_BASE: React.CSSProperties = { position: 'absolute', pointerEvents: 'none', zIndex: 3 };

const ANCHOR_BY_CATEGORY: Partial<Record<string, React.CSSProperties>> = {
  crisis: { ...ANCHOR_BASE, bottom: '5%', left: 0 },
  economic: { ...ANCHOR_BASE, top: 0, left: '10%' },
};

const DEFAULT_ANCHOR: React.CSSProperties = { ...ANCHOR_BASE, bottom: '20%', left: '5%' };

function particleStyle(p: ParticleSpec): React.CSSProperties {
  const textStyle: React.CSSProperties = p.text
    ? { fontSize: '11px', fontFamily: "'Press Start 2P', monospace", lineHeight: '1' }
    : {};
  return {
    position: 'absolute',
    left: p.x,
    top: p.y,
    width: p.w,
    height: p.h,
    background: p.text ? 'transparent' : p.color,
    color: p.color,
    imageRendering: 'pixelated',
    ...textStyle,
  };
}

export function ParticleLayer({ category }: { category: string }) {
  const particles = PARTICLES[category] ?? [];
  if (particles.length === 0) return null;

  return (
    <div style={ANCHOR_BY_CATEGORY[category] ?? DEFAULT_ANCHOR}>
      {particles.map((p, i) => (
        <div key={i} className="gsap-particle" style={particleStyle(p)}>
          {p.text ?? ''}
        </div>
      ))}
    </div>
  );
}
