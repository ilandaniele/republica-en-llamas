import React from 'react';
import { useGameImage } from '../../hooks/useGameImage.js';

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'ingeniero' | 'populista' | 'tecnocrata';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

const OL = '#1a1a1a';

// ── Milei portrait — wild anarcho-capitalist energy ──────────────────────────
function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#f0e8d0" />
      {/* Suit */}
      <rect x={18} y={96} width={84} height={48} fill="#10101e" rx={2} stroke={OL} strokeWidth={2} />
      <rect x={50} y={96} width={20} height={46} fill="#d8d8d8" />
      <polygon points="57,99 63,99 60,128" fill="#cc1818" />
      <polygon points="18,96 50,96 36,118" fill="#1a1a2e" stroke={OL} strokeWidth={1} />
      <polygon points="102,96 70,96 84,118" fill="#1a1a2e" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={48} y={80} width={24} height={20} fill="#f5c8a0" />
      {/* Head — long narrow face */}
      <rect x={30} y={36} width={60} height={60} fill="#f5c8a0" rx={10} stroke={OL} strokeWidth={2.5} />
      {/* ══ MASSIVE WILD HAIR ══ */}
      <ellipse cx={60} cy={26} rx={40} ry={24} fill="#2c1208" />
      {/* Upward spikes */}
      <polygon points="14,42 10,8 32,36" fill="#2c1208" />
      <polygon points="34,26 38,2 50,28" fill="#2c1208" />
      <polygon points="52,18 56,0 64,20" fill="#2c1208" />
      <polygon points="68,18 76,2 84,24" fill="#2c1208" />
      <polygon points="88,26 100,6 104,38" fill="#2c1208" />
      {/* Side volume */}
      <ellipse cx={16} cy={52} rx={14} ry={20} fill="#2c1208" />
      <ellipse cx={104} cy={52} rx={14} ry={20} fill="#2c1208" />
      {/* Hair base */}
      <path d="M 30 42 Q 60 35 90 42" fill="#2c1208" />
      {/* LONG MUTTON-CHOP SIDEBURNS */}
      <rect x={22} y={54} width={12} height={34} fill="#2c1208" rx={4} />
      <rect x={86} y={54} width={12} height={34} fill="#2c1208" rx={4} />
      {/* Ears */}
      <ellipse cx={30} cy={66} rx={5} ry={7} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={90} cy={66} rx={5} ry={7} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      {/* Heavy angled eyebrows */}
      <path d="M 33 57 Q 43 51 52 57" stroke="#1a0a04" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 68 57 Q 77 51 87 57" stroke="#1a0a04" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* Wide STARING eyes */}
      <ellipse cx={43} cy={68} rx={9} ry={9} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={77} cy={68} rx={9} ry={9} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={44} cy={68} r={5.5} fill="#2c1208" />
      <circle cx={78} cy={68} r={5.5} fill="#2c1208" />
      <circle cx={45} cy={65} r={2} fill="white" />
      <circle cx={79} cy={65} r={2} fill="white" />
      {/* Nose — bulbous with nostrils */}
      <ellipse cx={60} cy={79} rx={5} ry={4} fill="#d4966a" />
      <circle cx={56} cy={81} r={2.5} fill="#c07850" />
      <circle cx={64} cy={81} r={2.5} fill="#c07850" />
      {/* Mouth */}
      {smile
        ? <path d="M 44 90 Q 60 102 76 90" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 44 90 Q 60 93 76 90" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 44 90 Q 60 102 76 90 Q 60 88 44 90" fill="white" />}
      {/* CHAINSAW */}
      <rect x={84} y={107} width={34} height={12} fill="#c07020" rx={2} stroke={OL} strokeWidth={2} />
      <rect x={93} y={104} width={23} height={6} fill="#9090aa" rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={94} y={110} width={22} height={22} fill="#e8c020" rx={2} stroke={OL} strokeWidth={1.5} />
      {[0, 4, 8, 12, 16].map((dy) => (
        <line key={dy} x1={94} y1={112 + dy} x2={116} y2={112 + dy} stroke={OL} strokeWidth={0.6} />
      ))}
      {sweat && <ellipse cx={96} cy={62} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
      {sweat && <ellipse cx={24} cy={72} rx={3} ry={5} fill="#88b8f0" opacity={0.7} />}
    </g>
  );
}

// ── Massa portrait — neat comb + round full face + briefcase ──────────────────
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8f4" />
      {/* Broader navy suit — fuller build */}
      <rect x={14} y={94} width={92} height={50} fill="#1c2878" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={49} y={94} width={22} height={48} fill="#e8e8e8" />
      <polygon points="57,97 63,97 60,126" fill="#cc1818" />
      <polygon points="14,94 49,94 34,116" fill="#162060" stroke={OL} strokeWidth={1} />
      <polygon points="106,94 71,94 86,116" fill="#162060" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={47} y={80} width={26} height={18} fill="#f5c8a0" />
      {/* HEAD — round, full face */}
      <ellipse cx={60} cy={65} rx={34} ry={37} fill="#f5c8a0" stroke={OL} strokeWidth={2.5} />
      {/* NEAT COMBED DARK HAIR with side part */}
      <path d="M 26 52 Q 32 34 60 32 Q 88 34 94 52 Q 90 40 78 36 Q 68 30 60 32 Q 52 30 42 36 Q 30 40 26 52"
        fill="#0c0c10" stroke={OL} strokeWidth={1.5} />
      {/* Side part line */}
      <line x1={54} y1={33} x2={50} y2={48} stroke="#2a2a2a" strokeWidth={1.5} />
      {/* Hair on sides */}
      <path d="M 26 52 Q 25 62 27 72 Q 27 60 30 50" fill="#0c0c10" />
      <path d="M 94 52 Q 95 62 93 72 Q 93 60 90 50" fill="#0c0c10" />
      {/* Ears */}
      <ellipse cx={25} cy={67} rx={7} ry={10} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={95} cy={67} rx={7} ry={10} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      {/* Straight groomed eyebrows */}
      <rect x={33} y={54} width={20} height={4} fill="#0c0c10" rx={2} />
      <rect x={67} y={54} width={20} height={4} fill="#0c0c10" rx={2} />
      {/* Eyes */}
      <ellipse cx={43} cy={65} rx={8} ry={6.5} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={77} cy={65} rx={8} ry={6.5} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={44} cy={65} r={4.5} fill="#1a1a1a" />
      <circle cx={78} cy={65} r={4.5} fill="#1a1a1a" />
      <circle cx={45} cy={63} r={1.5} fill="white" />
      <circle cx={79} cy={63} r={1.5} fill="white" />
      {/* Fleshy cheeks */}
      <ellipse cx={28} cy={74} rx={9} ry={7} fill="#f0a888" opacity={0.25} />
      <ellipse cx={92} cy={74} rx={9} ry={7} fill="#f0a888" opacity={0.25} />
      {/* Nose */}
      <ellipse cx={60} cy={77} rx={5} ry={4} fill="#d4966a" />
      {/* Politician grin */}
      {smile
        ? <path d="M 46 88 Q 60 98 74 88" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 88 Q 60 90 74 88" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 46 88 Q 60 98 74 88 Q 60 86 46 88" fill="white" />}
      {/* Briefcase */}
      <rect x={78} y={108} width={38} height={26} fill="#5d4037" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={90} y={105} width={14} height={7} fill="#4e342e" rx={2} stroke={OL} strokeWidth={1.5} />
      <line x1={78} y1={121} x2={116} y2={121} stroke={OL} strokeWidth={1.5} />
      <rect x={95} y={117} width={8} height={8} fill="#8d6e63" rx={1} stroke={OL} strokeWidth={1} />
      {sweat && <ellipse cx={96} cy={62} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// ── Bullrich portrait — clearly female, security minister ────────────────────
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8eef0" />
      {/* Dark teal security jacket */}
      <rect x={18} y={96} width={84} height={48} fill="#1a3a4c" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={50} y={96} width={20} height={46} fill="#f0f0f0" />
      <polygon points="18,96 50,96 34,118" fill="#12303e" stroke={OL} strokeWidth={1} />
      <polygon points="102,96 70,96 86,118" fill="#12303e" stroke={OL} strokeWidth={1} />
      {/* Security badge */}
      <rect x={22} y={100} width={14} height={10} fill="#c8a020" rx={1} stroke={OL} strokeWidth={1} />
      <circle cx={29} cy={105} r={3} fill="#f0d060" />
      {/* Neck */}
      <rect x={48} y={80} width={24} height={20} fill="#f0c4a8" />
      {/* HEAD — oval, feminine */}
      <ellipse cx={60} cy={64} rx={30} ry={34} fill="#f0c4a8" stroke={OL} strokeWidth={2.5} />
      {/* WAVY BLONDE HAIR */}
      <ellipse cx={60} cy={40} rx={34} ry={20} fill="#d4a017" />
      {/* Wavy side falls */}
      <path d="M 26 50 Q 20 64 22 78 Q 18 64 24 52 Q 26 46 30 44" fill="#d4a017" />
      <path d="M 94 50 Q 100 64 98 78 Q 102 64 96 52 Q 94 46 90 44" fill="#d4a017" />
      {/* Wave texture */}
      <path d="M 26 52 Q 32 47 36 52 Q 40 57 44 52" stroke="#b8860b" strokeWidth={2.5} fill="none" />
      <path d="M 76 48 Q 80 43 84 48 Q 88 53 92 48" stroke="#b8860b" strokeWidth={2.5} fill="none" />
      <path d="M 24 66 Q 28 62 30 66 Q 32 70 36 66" stroke="#b8860b" strokeWidth={2} fill="none" />
      <path d="M 84 64 Q 88 60 90 64 Q 92 68 96 64" stroke="#b8860b" strokeWidth={2} fill="none" />
      {/* Hair highlight */}
      <path d="M 34 36 Q 48 28 60 30 Q 72 28 86 36" stroke="#e8c030" strokeWidth={2} fill="none" strokeLinecap="round" />
      {/* Ears */}
      <ellipse cx={29} cy={64} rx={6} ry={8} fill="#f0c4a8" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={91} cy={64} rx={6} ry={8} fill="#f0c4a8" stroke={OL} strokeWidth={1.5} />
      {/* Gold earrings */}
      <circle cx={29} cy={74} r={3.5} fill="#d4a017" stroke={OL} strokeWidth={1} />
      <circle cx={91} cy={74} r={3.5} fill="#d4a017" stroke={OL} strokeWidth={1} />
      {/* Arched eyebrows */}
      <path d="M 33 52 Q 42 46 50 52" stroke="#8B6914" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 70 52 Q 78 46 87 52" stroke="#8B6914" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx={42} cy={62} rx={8.5} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={78} cy={62} rx={8.5} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      {/* Eyelashes */}
      {[35, 38, 42, 46, 49].map((x) => (
        <line key={x} x1={x} y1={57} x2={x - 1} y2={53} stroke={OL} strokeWidth={1.2} />
      ))}
      {[71, 74, 78, 82, 85].map((x) => (
        <line key={x} x1={x} y1={57} x2={x - 1} y2={53} stroke={OL} strokeWidth={1.2} />
      ))}
      <circle cx={43} cy={62} r={4.5} fill="#2c5e2c" />
      <circle cx={79} cy={62} r={4.5} fill="#2c5e2c" />
      <circle cx={44} cy={60} r={1.5} fill="white" />
      <circle cx={80} cy={60} r={1.5} fill="white" />
      {/* Nose — smaller, feminine */}
      <ellipse cx={60} cy={73} rx={3.5} ry={2.5} fill="#d4966a" />
      {/* RED LIPSTICK */}
      <path d="M 46 82 Q 53 86 60 83 Q 67 80 74 82 Q 67 87 60 88 Q 53 87 46 82" fill="#c01830" />
      {smile
        ? <path d="M 46 82 Q 60 93 74 82" stroke="#900018" strokeWidth={1.5} fill="none" strokeLinecap="round" />
        : <path d="M 47 83 Q 60 80 73 83" stroke="#900018" strokeWidth={1} fill="none" strokeLinecap="round" />}
      {sweat && <ellipse cx={93} cy={58} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function PixelPortrait({ id, mood = 'neutral', px = 96 }: Props) {
  // Map aliases to base character
  const base: PortraitId =
    id === 'ingeniero' ? 'milei' :
    id === 'populista' ? 'massa' :
    id === 'tecnocrata' ? 'bullrich' : id;

  const imageUrl = useGameImage(`char_${base}`);

  // AI-generated portrait if available
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Retrato de ${id}`}
        width={px}
        height={px}
        style={{ display: 'block', objectFit: 'cover', borderRadius: 4 }}
        loading="lazy"
      />
    );
  }

  // Fallback: inline SVG cartoon
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 120 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'auto', display: 'block' }}
      role="img"
      aria-label={`Retrato de ${id}`}
    >
      {base === 'milei'    && <MileiPortrait mood={mood} />}
      {base === 'massa'    && <MassaPortrait mood={mood} />}
      {base === 'bullrich' && <BullrichPortrait mood={mood} />}
    </svg>
  );
}
