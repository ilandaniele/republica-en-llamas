import React from 'react';

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'ingeniero' | 'populista' | 'tecnocrata';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

const OL = '#1a1a1a';

// ── Milei portrait (flat editorial cartoon) ───────────────────────────────────
function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      {/* Background */}
      <rect x={0} y={0} width={120} height={140} fill="#f0e8d0" />
      {/* Suit body */}
      <rect x={18} y={96} width={84} height={50} fill="#10101e" rx={4} stroke={OL} strokeWidth={2} />
      {/* Shirt */}
      <rect x={52} y={96} width={16} height={44} fill="#d8d8d8" />
      {/* Red tie */}
      <polygon points="58,98 62,98 60,130" fill="#cc1818" />
      {/* Lapels */}
      <polygon points="18,96 52,96 38,116" fill="#1a1a2e" stroke={OL} strokeWidth={1} />
      <polygon points="102,96 68,96 82,116" fill="#1a1a2e" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={50} y={82} width={20} height={18} fill="#f5c8a0" />
      {/* Head */}
      <rect x={28} y={34} width={64} height={56} fill="#f5c8a0" rx={10} stroke={OL} strokeWidth={2.5} />
      {/* Wild hair — large irregular dark mass */}
      <ellipse cx={60} cy={36} rx={38} ry={28} fill="#2c1208" stroke={OL} strokeWidth={2} />
      <ellipse cx={34} cy={42} rx={14} ry={22} fill="#2c1208" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={86} cy={42} rx={14} ry={22} fill="#2c1208" stroke={OL} strokeWidth={1.5} />
      {/* Sideburns */}
      <rect x={26} y={54} width={8} height={22} fill="#2c1208" rx={3} />
      <rect x={86} y={54} width={8} height={22} fill="#2c1208" rx={3} />
      {/* Heavy eyebrows */}
      <rect x={33} y={53} width={20} height={5} fill="#1a0a04" rx={2} />
      <rect x={67} y={53} width={20} height={5} fill="#1a0a04" rx={2} />
      {/* Eyes */}
      <ellipse cx={43} cy={65} rx={8} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={77} cy={65} rx={8} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={44} cy={65} r={4} fill="#2c1208" />
      <circle cx={78} cy={65} r={4} fill="#2c1208" />
      <circle cx={45} cy={63} r={1.5} fill="white" />
      <circle cx={79} cy={63} r={1.5} fill="white" />
      {/* Nose */}
      <ellipse cx={60} cy={75} rx={4} ry={3} fill="#d4966a" />
      {/* Mouth */}
      {smile
        ? <path d="M 46 84 Q 60 95 74 84" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 84 Q 60 88 74 84" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 46 84 Q 60 95 74 84 Q 60 82 46 84" fill="white" />}
      {/* Chainsaw */}
      <rect x={88} y={108} width={30} height={12} fill="#c07020" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={98} y={106} width={20} height={5} fill="#8888aa" rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={100} y={111} width={18} height={20} fill="#e8c020" rx={2} stroke={OL} strokeWidth={1.5} />
      {[0,4,8,12,16].map((dy) => (
        <line key={dy} x1={100} y1={113 + dy} x2={118} y2={113 + dy} stroke={OL} strokeWidth={0.5} />
      ))}
      {/* Sweat */}
      {sweat && <ellipse cx={92} cy={62} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
      {sweat && <ellipse cx={28} cy={70} rx={3} ry={5} fill="#88b8f0" opacity={0.7} />}
    </g>
  );
}

// ── Massa portrait ────────────────────────────────────────────────────────────
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8f0f8" />
      {/* Navy suit */}
      <rect x={18} y={96} width={84} height={50} fill="#1e2c7c" rx={4} stroke={OL} strokeWidth={2} />
      <rect x={52} y={96} width={16} height={44} fill="#e8e8e8" />
      <polygon points="58,98 62,98 60,128" fill="#cc1818" />
      <polygon points="18,96 52,96 38,114" fill="#162268" stroke={OL} strokeWidth={1} />
      <polygon points="102,96 68,96 82,114" fill="#162268" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={50} y={82} width={20} height={18} fill="#f5c8a0" />
      {/* Head */}
      <rect x={28} y={36} width={64} height={54} fill="#f5c8a0" rx={9} stroke={OL} strokeWidth={2.5} />
      {/* Flat black hair */}
      <rect x={28} y={34} width={64} height={20} fill="#0c0c0c" rx={8} stroke={OL} strokeWidth={1.5} />
      <rect x={28} y={46} width={64} height={8} fill="#0c0c0c" />
      {/* Ears */}
      <ellipse cx={27} cy={64} rx={6} ry={8} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={93} cy={64} rx={6} ry={8} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      {/* Eyebrows */}
      <rect x={35} y={55} width={18} height={4} fill="#0c0c0c" rx={2} />
      <rect x={67} y={55} width={18} height={4} fill="#0c0c0c" rx={2} />
      {/* Eyes */}
      <ellipse cx={42} cy={66} rx={7} ry={6} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={78} cy={66} rx={7} ry={6} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={43} cy={66} r={4} fill="#1a1a1a" />
      <circle cx={79} cy={66} r={4} fill="#1a1a1a" />
      <circle cx={44} cy={64} r={1.5} fill="white" />
      <circle cx={80} cy={64} r={1.5} fill="white" />
      {/* Nose */}
      <ellipse cx={60} cy={75} rx={4} ry={3} fill="#d4966a" />
      {/* Briefcase */}
      <rect x={82} y={108} width={34} height={24} fill="#5d4037" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={93} y={106} width={12} height={6} fill="#4e342e" rx={2} stroke={OL} strokeWidth={1.5} />
      <line x1={82} y1={120} x2={116} y2={120} stroke={OL} strokeWidth={1.5} />
      <rect x={97} y={116} width={6} height={8} fill="#8d6e63" rx={1} stroke={OL} strokeWidth={1} />
      {/* Mouth */}
      {smile
        ? <path d="M 48 84 Q 60 94 72 84" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <line x1={48} y1={85} x2={72} y2={85} stroke={OL} strokeWidth={2} strokeLinecap="round" />}
      {sweat && <ellipse cx={94} cy={62} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// ── Bullrich portrait ─────────────────────────────────────────────────────────
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8f0ec" />
      {/* Teal jacket */}
      <rect x={18} y={96} width={84} height={50} fill="#00695c" rx={4} stroke={OL} strokeWidth={2} />
      <rect x={52} y={96} width={16} height={44} fill="#f8f8f8" />
      <polygon points="18,96 52,96 36,116" fill="#00574b" stroke={OL} strokeWidth={1} />
      <polygon points="102,96 68,96 84,116" fill="#00574b" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={50} y={82} width={20} height={18} fill="#f5c8a0" />
      {/* Head */}
      <rect x={26} y={34} width={68} height={56} fill="#f5c8a0" rx={10} stroke={OL} strokeWidth={2.5} />
      {/* Wavy blonde hair */}
      <path d="M 22 54 Q 28 30 60 28 Q 92 30 98 54 Q 94 38 88 35 Q 70 26 60 28 Q 50 26 32 35 Q 26 38 22 54"
        fill="#d4a017" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={60} cy={30} rx={32} ry={14} fill="#d4a017" stroke={OL} strokeWidth={1.5} />
      {/* Wavy wave details */}
      <path d="M 24 48 Q 30 44 36 48 Q 42 52 48 48" stroke="#b8860b" strokeWidth={2} fill="none" />
      <path d="M 72 44 Q 78 40 84 44 Q 90 48 96 44" stroke="#b8860b" strokeWidth={2} fill="none" />
      {/* Ears */}
      <ellipse cx={25} cy={62} rx={6} ry={8} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={95} cy={62} rx={6} ry={8} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      {/* Eyebrows — arched */}
      <path d="M 34 55 Q 42 50 50 55" stroke="#8B6914" strokeWidth={3} fill="none" strokeLinecap="round" />
      <path d="M 70 55 Q 78 50 86 55" stroke="#8B6914" strokeWidth={3} fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx={42} cy={64} rx={8} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={78} cy={64} rx={8} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={43} cy={64} r={4} fill="#2c5e2c" />
      <circle cx={79} cy={64} r={4} fill="#2c5e2c" />
      <circle cx={44} cy={62} r={1.5} fill="white" />
      <circle cx={80} cy={62} r={1.5} fill="white" />
      {/* Nose */}
      <ellipse cx={60} cy={74} rx={4} ry={3} fill="#d4966a" />
      {/* Mouth — stern */}
      {smile
        ? <path d="M 46 84 Q 60 94 74 84" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 83 Q 60 80 74 83" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {sweat && <ellipse cx={93} cy={60} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
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
