import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ScenarioId } from '@republica/game-engine';

gsap.registerPlugin(useGSAP);

interface Props {
  id: ScenarioId;
}

// ── Primitives ────────────────────────────────────────────────────────────────
function R(x: number, y: number, w: number, h: number, fill: string, rx = 0, stroke?: string, sw = 1.5) {
  return stroke
    ? <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} stroke={stroke} strokeWidth={sw} />
    : <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} />;
}

// ── Scene: Hiperinflación 1989 ────────────────────────────────────────────────
function SceneHiperinflacion() {
  return (
    <>
      {R(0, 0, 200, 96, '#1f0800')}
      {R(0, 68, 200, 28, '#3e2000')}
      {/* Falling peso bills – GSAP primary (floats upward in loop) */}
      <g className="gsap-primary">
        {R(60, 44, 20, 11, '#a5d6a7', 1, '#2e7d32', 1)}
        {R(70, 38, 20, 11, '#c8e6c9', 1, '#1b5e20', 1)}
        {R(64, 32, 20, 11, '#a5d6a7', 1, '#2e7d32', 1)}
        {R(74, 26, 20, 11, '#c8e6c9', 1, '#1b5e20', 1)}
        {R(58, 20, 20, 11, '#a5d6a7', 1, '#2e7d32', 1)}
      </g>
      {/* Wheelbarrow body */}
      {R(50, 56, 52, 16, '#5d4037', 3, '#2c1a00', 1.5)}
      {R(50, 56, 52, 6, '#795548', 3)}
      <circle cx={68} cy={74} r={8} fill="#3e2000" stroke="#5d4037" strokeWidth={2} />
      <circle cx={68} cy={74} r={3} fill="#1a0800" />
      <line x1={102} y1={60} x2={128} y2={54} stroke="#5d4037" strokeWidth={2.5} />
      <line x1={102} y1={68} x2={128} y2={68} stroke="#5d4037" strokeWidth={2.5} />
      {/* Prices board */}
      {R(132, 18, 60, 48, '#f5e6c8', 2, '#5d4037', 1.5)}
      {R(132, 18, 60, 10, '#c62828', 2)}
      <text x={135} y={26} fill="#fff" fontSize={5} fontFamily="monospace" fontWeight="bold">PRECIOS</text>
      <text x={135} y={37} fill="#c62828" fontSize={6} fontFamily="monospace" fontWeight="bold">$82.500</text>
      <text x={135} y={47} fill="#c62828" fontSize={6} fontFamily="monospace" fontWeight="bold">$210.000</text>
      <text x={135} y={57} fill="#c62828" fontSize={6} fontFamily="monospace" fontWeight="bold">$1.200.000</text>
      {/* Screaming person */}
      <circle cx={22} cy={40} r={8} fill="#f4c08a" stroke="#2c1a08" strokeWidth={1} />
      {R(14, 48, 16, 20, '#1a237e', 2, '#0d1527', 1)}
      <ellipse cx={22} cy={44} rx={3} ry={2} fill="#8b0000" />
      <line x1={14} y1={54} x2={5} y2={42} stroke="#f4c08a" strokeWidth={2.5} />
      <line x1={30} y1={54} x2={40} y2={42} stroke="#f4c08a" strokeWidth={2.5} />
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.7)')}
      <text x={6} y={91} fill="#ef5350" fontSize={6} fontFamily="monospace" letterSpacing={1}>💸 HIPERINFLACIÓN 1989</text>
    </>
  );
}

// ── Scene: Corralito 2001 ─────────────────────────────────────────────────────
function SceneCorralito() {
  return (
    <>
      {R(0, 0, 200, 96, '#78909c')}
      {R(0, 64, 200, 32, '#5d4037')}
      {/* Bank facade */}
      {R(44, 14, 112, 58, '#e8e0d0', 0, '#b0a890', 1.5)}
      {R(44, 14, 112, 10, '#9e9e9e', 0)}
      {/* Columns */}
      {[52, 70, 88, 106, 124, 140].map((x, i) => (
        <rect key={i} x={x} y={14} width={5} height={58} fill="#d5cdc0" />
      ))}
      {/* ATM machine */}
      {R(80, 26, 40, 38, '#455a64', 2, '#263238', 1.5)}
      {R(84, 30, 32, 18, '#102030', 1)}
      {R(87, 33, 10, 5, '#1a5276', 1)}
      {/* Iron bars – GSAP primary (tremble on mount) */}
      <g className="gsap-primary">
        {[82, 91, 100, 109, 118].map((x, i) => (
          <rect key={i} x={x} y={24} width={4} height={42} fill="#546e7a" stroke="#37474f" strokeWidth={1} />
        ))}
        {R(80, 24, 40, 4, '#37474f', 0, '#263238', 1.5)}
        {R(80, 62, 40, 4, '#37474f', 0, '#263238', 1.5)}
      </g>
      {/* Queue of people */}
      {[162, 148, 134].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={52} r={5} fill="#f4c08a" stroke="#2c1a08" strokeWidth={0.8} />
          {R(x - 5, 57, 10, 14, ['#1a237e', '#546e7a', '#c62828'][i]!, 1)}
        </g>
      ))}
      {/* Queue line */}
      <line x1={80} y1={64} x2={168} y2={64} stroke="#90a4ae" strokeWidth={1} strokeDasharray="3,2" />
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.65)')}
      <text x={6} y={91} fill="#90caf9" fontSize={6} fontFamily="monospace" letterSpacing={1}>🏧 CORRALITO 2001</text>
    </>
  );
}

// ── Scene: Convertibilidad ────────────────────────────────────────────────────
function SceneConvertibilidad() {
  return (
    <>
      {R(0, 0, 200, 96, '#b8d4f0')}
      {R(0, 68, 200, 28, '#66bb6a')}
      {/* Balance scale */}
      <line x1={100} y1={20} x2={100} y2={58} stroke="#78909c" strokeWidth={3} />
      <line x1={58} y1={30} x2={142} y2={30} stroke="#78909c" strokeWidth={2.5} />
      {/* Left pan */}
      <line x1={66} y1={30} x2={58} y2={46} stroke="#78909c" strokeWidth={1.5} />
      <line x1={60} y1={30} x2={58} y2={46} stroke="#78909c" strokeWidth={1.5} />
      {R(46, 46, 26, 5, '#b0bec5', 1, '#78909c', 1)}
      <text x={53} y={42} fill="#1b5e20" fontSize={10} fontFamily="monospace" fontWeight="bold">$</text>
      {/* Right pan */}
      <line x1={134} y1={30} x2={142} y2={46} stroke="#78909c" strokeWidth={1.5} />
      <line x1={140} y1={30} x2={142} y2={46} stroke="#78909c" strokeWidth={1.5} />
      {R(130, 46, 26, 5, '#b0bec5', 1, '#78909c', 1)}
      <text x={124} y={42} fill="#37474f" fontSize={7} fontFamily="monospace">US</text>
      <text x={133} y={42} fill="#1b5e20" fontSize={10} fontFamily="monospace" fontWeight="bold">$</text>
      {/* = sign */}
      <text x={92} y={25} fill="#1a237e" fontSize={11} fontFamily="monospace" fontWeight="bold">=</text>
      {/* Growing bar chart – GSAP primary (count-up on mount) */}
      <g className="gsap-primary">
        <rect x={8} y={52} width={12} height={16} fill="#42a5f5" stroke="#1565c0" strokeWidth={1} />
        <rect x={23} y={44} width={12} height={24} fill="#1e88e5" stroke="#1565c0" strokeWidth={1} />
        <rect x={38} y={34} width={12} height={34} fill="#1565c0" stroke="#0d47a1" strokeWidth={1} />
      </g>
      <line x1={4} y1={68} x2={56} y2={68} stroke="#546e7a" strokeWidth={1.5} />
      <line x1={4} y1={28} x2={4} y2={68} stroke="#546e7a" strokeWidth={1.5} />
      {/* Up arrow */}
      <polygon points="52,30 46,38 49,38 49,50 55,50 55,38 58,38" fill="#1b5e20" />
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.55)')}
      <text x={6} y={91} fill="#81d4fa" fontSize={6} fontFamily="monospace" letterSpacing={1}>💱 CONVERTIBILIDAD</text>
    </>
  );
}

// ── Scene: Rodrigazo 1975 ─────────────────────────────────────────────────────
function SceneRodrigazo() {
  return (
    <>
      {R(0, 0, 200, 96, '#1a0800')}
      {R(0, 0, 200, 46, '#0a0000')}
      {R(0, 58, 200, 38, '#2c1800')}
      {/* Building silhouettes */}
      {R(0, 28, 38, 44, '#0d0a06')}
      {R(162, 22, 38, 50, '#0d0a06')}
      {R(126, 34, 36, 38, '#0d0a06')}
      {/* Fire group – GSAP primary (flicker loop) */}
      <g className="gsap-primary">
        {/* Torches */}
        <polygon points="52,50 56,32 60,32 62,50" fill="#ff5722" />
        <polygon points="54,50 58,36 61,36 63,50" fill="#ffcc00" />
        <polygon points="90,46 94,28 98,28 100,46" fill="#ff5722" />
        <polygon points="92,46 96,32 99,32 101,46" fill="#ffd740" />
        <polygon points="120,48 124,30 128,30 130,48" fill="#ef5350" />
        <polygon points="122,48 126,34 129,34 131,48" fill="#ffcc00" />
        {/* Ground fire */}
        <polygon points="70,64 80,48 88,60 96,44 104,60 112,46 118,64" fill="#ff5722" opacity={0.85} />
        <polygon points="74,64 82,52 90,62 98,50 106,62 114,52 116,64" fill="#ffcc00" opacity={0.7} />
      </g>
      {/* Crowd silhouettes */}
      {[22, 38, 54, 136, 152, 168, 184].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={60} r={4} fill="#111" />
          {R(x - 3, 64, 6, 10, '#0d0d0d')}
        </g>
      ))}
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.72)')}
      <text x={6} y={91} fill="#ff7043" fontSize={6} fontFamily="monospace" letterSpacing={1}>✊ RODRIGAZO 1975</text>
    </>
  );
}

// ── Scene: Malvinas 1982 ──────────────────────────────────────────────────────
function SceneMalvinas() {
  return (
    <>
      {R(0, 0, 200, 96, '#0d2a4a')}
      {R(0, 52, 200, 44, '#0277bd')}
      {/* Ocean waves */}
      {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((x, i) => (
        <path key={i} d={`M ${x} ${58 + (i % 2) * 3} Q ${x + 10} ${55 + (i % 2) * 3} ${x + 20} ${58 + (i % 2) * 3}`}
          stroke="#01579b" strokeWidth={1.5} fill="none" />
      ))}
      {/* Island */}
      <ellipse cx={160} cy={58} rx={24} ry={10} fill="#4a6741" stroke="#2e4a28" strokeWidth={1.5} />
      {/* ARG flag on island */}
      <line x1={152} y1={58} x2={152} y2={36} stroke="#b0bec5" strokeWidth={2} />
      {R(152, 36, 22, 6, '#74acdf')}
      {R(152, 42, 22, 3, '#f4f4f0')}
      {R(152, 45, 22, 6, '#74acdf')}
      {/* Ship – GSAP primary (slow horizontal drift) */}
      <g className="gsap-primary">
        <polygon points="20,60 32,44 74,44 82,60" fill="#263238" stroke="#37474f" strokeWidth={1.5} />
        {R(36, 34, 24, 12, '#37474f', 1, '#455a64', 1)}
        {R(47, 22, 8, 14, '#455a64', 1)}
        <circle cx={51} cy={18} r={3} fill="#78909c" opacity={0.7} />
        <circle cx={54} cy={13} r={4} fill="#607d8b" opacity={0.45} />
        <circle cx={51} cy={8} r={5} fill="#546e7a" opacity={0.3} />
        <line x1={47} y1={36} x2={74} y2={36} stroke="#455a64" strokeWidth={1} />
      </g>
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.65)')}
      <text x={6} y={91} fill="#81d4fa" fontSize={6} fontFamily="monospace" letterSpacing={1}>⚓ MALVINAS 1982</text>
    </>
  );
}

// ── Scene: Kirchnerismo boom ──────────────────────────────────────────────────
function SceneKirchnerismo() {
  return (
    <>
      {R(0, 0, 200, 96, '#e8f5e9')}
      {R(0, 68, 200, 28, '#388e3c')}
      {/* Factory */}
      {R(8, 28, 72, 44, '#78909c', 2, '#546e7a', 1.5)}
      {R(8, 28, 72, 6, '#546e7a', 2)}
      {[14, 30, 48, 62].map((x) => R(x, 38, 10, 8, '#b3e5fc', 1, '#546e7a', 1))}
      {/* Factory chimneys + smoke */}
      {[16, 38, 58].map((x, i) => (
        <g key={i}>
          {R(x, 14, 8, 16, '#546e7a', 1, '#455a64', 1)}
          <ellipse cx={x + 4} cy={12} rx={5} ry={3} fill="#b0bec5" opacity={0.55} />
          <ellipse cx={x + 4} cy={7} rx={7} ry={4} fill="#90a4ae" opacity={0.38} />
          <ellipse cx={x + 4} cy={2} rx={6} ry={3} fill="#78909c" opacity={0.25} />
        </g>
      ))}
      {/* Bar chart – GSAP primary (count-up on mount, stagger) */}
      <g className="gsap-primary">
        <rect x={106} y={54} width={14} height={14} fill="#81c784" stroke="#388e3c" strokeWidth={1} />
        <rect x={124} y={44} width={14} height={24} fill="#66bb6a" stroke="#388e3c" strokeWidth={1} />
        <rect x={142} y={32} width={14} height={36} fill="#4caf50" stroke="#2e7d32" strokeWidth={1} />
        <rect x={160} y={18} width={14} height={50} fill="#388e3c" stroke="#1b5e20" strokeWidth={1} />
      </g>
      {/* Chart axes */}
      <line x1={102} y1={68} x2={180} y2={68} stroke="#1b5e20" strokeWidth={1.5} />
      <line x1={102} y1={14} x2={102} y2={68} stroke="#1b5e20" strokeWidth={1.5} />
      {/* Arrow */}
      <polygon points="178,12 172,20 175,20 175,32 181,32 181,20 184,20" fill="#1b5e20" />
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.5)')}
      <text x={6} y={91} fill="#a5d6a7" fontSize={6} fontFamily="monospace" letterSpacing={1}>📈 KIRCHNERISMO BOOM</text>
    </>
  );
}

// ── Scene: Libertad Avanza 2023 ───────────────────────────────────────────────
function SceneLla() {
  return (
    <>
      {R(0, 0, 200, 96, '#1a0800')}
      {/* Fire backdrop */}
      <polygon points="0,64 22,42 36,56 54,30 72,52 92,24 112,52 132,28 150,52 170,36 188,52 200,44 200,96 0,96"
        fill="#c62828" opacity={0.65} />
      <polygon points="0,68 26,48 42,62 62,38 84,58 102,32 120,58 140,36 160,58 180,44 200,58 200,96 0,96"
        fill="#ff5722" opacity={0.55} />
      {/* Chainsaw – GSAP primary (oscillating rotation on mount) */}
      <g className="gsap-primary">
        {/* Handle */}
        {R(10, 38, 12, 12, '#37474f', 2, '#263238', 1.5)}
        {/* Body */}
        {R(22, 34, 46, 20, '#455a64', 3, '#263238', 1.5)}
        {R(22, 34, 46, 7, '#546e7a', 2)}
        {/* Engine */}
        <circle cx={48} cy={44} r={5} fill="#546e7a" stroke="#37474f" strokeWidth={1} />
        <circle cx={48} cy={44} r={2} fill="#78909c" />
        {/* Guide bar */}
        {R(68, 40, 60, 8, '#78909c', 1, '#546e7a', 1.5)}
        {/* Chain teeth */}
        {[70, 78, 86, 94, 102, 110, 118].map((x, i) => (
          <rect key={i} x={x} y={i % 2 === 0 ? 38 : 48} width={4} height={4} fill="#90a4ae" />
        ))}
        {/* Blade tip */}
        <polygon points="128,40 138,44 128,48" fill="#b0bec5" />
      </g>
      {/* Falling peso symbols – GSAP secondary */}
      <g className="gsap-secondary">
        <text x={148} y={22} fill="#ffcc00" fontSize={14} fontFamily="monospace" fontWeight="bold" opacity={0.9}>$</text>
        <text x={168} y={40} fill="#ffa726" fontSize={11} fontFamily="monospace" fontWeight="bold" opacity={0.75}>$</text>
        <text x={140} y={52} fill="#ff8f00" fontSize={9} fontFamily="monospace" fontWeight="bold" opacity={0.6}>$</text>
        <text x={162} y={60} fill="#e65100" fontSize={13} fontFamily="monospace" fontWeight="bold" opacity={0.5}>$</text>
      </g>
      {R(0, 80, 200, 16, 'rgba(0,0,0,0.75)')}
      <text x={6} y={91} fill="#ff7043" fontSize={6} fontFamily="monospace" letterSpacing={1}>⚡ LIBERTAD AVANZA 2023</text>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function ScenarioIllustration({ id }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    if (id === 'hiperinflacion_1989') {
      // Peso bills float upward in a gentle loop
      gsap.to('.gsap-primary', {
        y: -8,
        duration: 0.9,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: { each: 0.18, from: 'random' },
      });

    } else if (id === 'corralito_2001') {
      // Bars tremble once on mount (bank closed feel)
      gsap.fromTo('.gsap-primary',
        { x: 0 },
        { x: 2.5, duration: 0.06, yoyo: true, repeat: 9, ease: 'none' },
      );

    } else if (id === 'convertibilidad') {
      // Bars grow up from baseline (chart reveal)
      gsap.fromTo('.gsap-primary > rect',
        { scaleY: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.7, ease: 'power2.out', stagger: 0.14, delay: 0.2 },
      );

    } else if (id === 'rodrigazo_1975') {
      // Fire flickers
      gsap.to('.gsap-primary', {
        scaleY: 1.14,
        transformOrigin: '50% 100%',
        duration: 0.22,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

    } else if (id === 'malvinas_1982') {
      // Ship drifts slowly across the sea
      gsap.to('.gsap-primary', {
        x: 14,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });

    } else if (id === 'kirchnerismo_boom') {
      // Bars count up (grow from bottom)
      gsap.fromTo('.gsap-primary > rect',
        { scaleY: 0, transformOrigin: '50% 100%' },
        { scaleY: 1, duration: 0.8, ease: 'power2.out', stagger: 0.12, delay: 0.3 },
      );

    } else if (id === 'libertad_avanza_2023') {
      // Chainsaw oscillates (running motor feel)
      gsap.to('.gsap-primary', {
        rotation: 5,
        transformOrigin: '20px 44px',
        duration: 0.18,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut',
      });
      // Peso symbols fall and fade
      gsap.to('.gsap-secondary > text', {
        y: 18,
        autoAlpha: 0,
        duration: 1.3,
        ease: 'power1.in',
        stagger: { each: 0.32, repeat: -1, from: 'start' },
        delay: 0.5,
      });
    }
  }, { scope: containerRef, dependencies: [id] });

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 200 96"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`Escenario: ${id}`}
      >
        {id === 'hiperinflacion_1989'  && <SceneHiperinflacion />}
        {id === 'corralito_2001'       && <SceneCorralito />}
        {id === 'convertibilidad'      && <SceneConvertibilidad />}
        {id === 'rodrigazo_1975'       && <SceneRodrigazo />}
        {id === 'malvinas_1982'        && <SceneMalvinas />}
        {id === 'kirchnerismo_boom'    && <SceneKirchnerismo />}
        {id === 'libertad_avanza_2023' && <SceneLla />}
      </svg>
    </div>
  );
}
