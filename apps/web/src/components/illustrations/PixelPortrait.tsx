import React from 'react';
import { useGameImage } from '../../hooks/useGameImage.js';

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'bregman' | 'schiaretti' | 'larreta' | 'ingeniero' | 'populista' | 'tecnocrata' | 'izquierda' | 'federal' | 'corporativo';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

const OL = '#1a1a1a';

// â”€â”€ Milei portrait â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      {/* Head */}
      <rect x={30} y={36} width={60} height={60} fill="#f5c8a0" rx={10} stroke={OL} strokeWidth={2.5} />
      {/* Wild hair */}
      <ellipse cx={60} cy={26} rx={40} ry={24} fill="#2c1208" />
      <polygon points="14,42 10,8 32,36" fill="#2c1208" />
      <polygon points="34,26 38,2 50,28" fill="#2c1208" />
      <polygon points="52,18 56,0 64,20" fill="#2c1208" />
      <polygon points="68,18 76,2 84,24" fill="#2c1208" />
      <polygon points="88,26 100,6 104,38" fill="#2c1208" />
      <ellipse cx={16} cy={52} rx={14} ry={20} fill="#2c1208" />
      <ellipse cx={104} cy={52} rx={14} ry={20} fill="#2c1208" />
      {/* Mutton-chop sideburns */}
      <rect x={22} y={54} width={12} height={34} fill="#2c1208" rx={4} />
      <rect x={86} y={54} width={12} height={34} fill="#2c1208" rx={4} />
      {/* Ears */}
      <ellipse cx={30} cy={66} rx={5} ry={7} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={90} cy={66} rx={5} ry={7} fill="#f5c8a0" stroke={OL} strokeWidth={1.5} />
      {/* Eyebrows */}
      <path d="M 33 57 Q 43 51 52 57" stroke="#1a0a04" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 68 57 Q 77 51 87 57" stroke="#1a0a04" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* Staring eyes */}
      <ellipse cx={43} cy={68} rx={9} ry={9} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={77} cy={68} rx={9} ry={9} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={44} cy={68} r={5.5} fill="#2c1208" />
      <circle cx={78} cy={68} r={5.5} fill="#2c1208" />
      <circle cx={45} cy={65} r={2} fill="white" />
      <circle cx={79} cy={65} r={2} fill="white" />
      <ellipse cx={60} cy={79} rx={5} ry={4} fill="#d4966a" />
      <circle cx={56} cy={81} r={2.5} fill="#c07850" />
      <circle cx={64} cy={81} r={2.5} fill="#c07850" />
      {smile
        ? <path d="M 44 90 Q 60 102 76 90" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 44 90 Q 60 93 76 90" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 44 90 Q 60 102 76 90 Q 60 88 44 90" fill="white" />}
      {/* Chainsaw */}
      <rect x={84} y={107} width={34} height={12} fill="#c07020" rx={2} stroke={OL} strokeWidth={2} />
      <rect x={93} y={104} width={23} height={6} fill="#9090aa" rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={94} y={110} width={22} height={22} fill="#e8c020" rx={2} stroke={OL} strokeWidth={1.5} />
      {[0, 4, 8, 12, 16].map((dy) => (
        <line key={dy} x1={94} y1={112 + dy} x2={116} y2={112 + dy} stroke={OL} strokeWidth={0.6} />
      ))}
      {sweat && <ellipse cx={96} cy={62} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Massa portrait â€” square jaw, slicked-back dark hair, politician smirk â”€â”€â”€â”€â”€
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8f4" />
      {/* Navy suit */}
      <rect x={12} y={92} width={96} height={52} fill="#1c2060" stroke={OL} strokeWidth={2} />
      <rect x={48} y={92} width={24} height={50} fill="#e8e8e8" />
      {/* Wide lapels â€” broad shoulders signal power */}
      <polygon points="12,92 48,92 28,120" fill="#141848" stroke={OL} strokeWidth={1} />
      <polygon points="108,92 72,92 92,120" fill="#141848" stroke={OL} strokeWidth={1} />
      {/* Red tie */}
      <polygon points="56,95 64,95 62,130 58,130" fill="#cc1010" />
      <polygon points="56,95 64,95 60,105" fill="#aa0808" />
      {/* Thick neck */}
      <rect x={46} y={78} width={28} height={18} fill="#e8b888" />
      {/* HEAD â€” wide, square jaw â€” the key Massa shape */}
      <path d="M 24 44 Q 24 30 60 28 Q 96 30 96 44 L 98 82 Q 98 96 82 98 L 38 98 Q 22 96 22 82 Z"
        fill="#e8b888" stroke={OL} strokeWidth={2.5} />
      {/* Strong square jaw detail */}
      <path d="M 28 86 Q 38 96 60 97 Q 82 96 92 86" stroke="#c8926a" strokeWidth={1.5} fill="none" />
      {/* SLICKED-BACK dark hair â€” swept back, very neat */}
      <path d="M 24 44 Q 28 24 60 22 Q 92 24 96 44 Q 88 30 72 28 Q 60 26 48 28 Q 34 30 24 44" fill="#0a0a10" />
      {/* Hair line across forehead â€” clear recession */}
      <path d="M 30 46 Q 60 38 90 46" stroke="#0a0a10" strokeWidth={3} fill="none" />
      {/* Side hair detail */}
      <rect x={24} y={44} width={6} height={20} fill="#0a0a10" rx={2} />
      <rect x={90} y={44} width={6} height={20} fill="#0a0a10" rx={2} />
      {/* Ears */}
      <ellipse cx={22} cy={66} rx={7} ry={9} fill="#e8b888" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={98} cy={66} rx={7} ry={9} fill="#e8b888" stroke={OL} strokeWidth={1.5} />
      {/* Heavy straight dark eyebrows */}
      <rect x={32} y={52} width={22} height={5} fill="#0a0a10" rx={1} />
      <rect x={66} y={52} width={22} height={5} fill="#0a0a10" rx={1} />
      {/* Eyes â€” slightly hooded */}
      <ellipse cx={43} cy={64} rx={9} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={77} cy={64} rx={9} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      {/* Hooded eyelid line */}
      <path d="M 34 60 Q 43 57 52 60" stroke={OL} strokeWidth={2} fill="none" />
      <path d="M 68 60 Q 77 57 86 60" stroke={OL} strokeWidth={2} fill="none" />
      <circle cx={44} cy={64} r={5} fill="#1a1010" />
      <circle cx={78} cy={64} r={5} fill="#1a1010" />
      <circle cx={45} cy={62} r={1.5} fill="white" />
      <circle cx={79} cy={62} r={1.5} fill="white" />
      {/* Wide fleshy nose */}
      <ellipse cx={60} cy={76} rx={7} ry={5} fill="#d09070" />
      <circle cx={55} cy={79} r={3} fill="#c07858" />
      <circle cx={65} cy={79} r={3} fill="#c07858" />
      {/* Politician smirk â€” asymmetric */}
      {smile
        ? <path d="M 42 89 Q 60 100 78 89" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 44 89 Q 60 93 76 87" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 42 89 Q 60 100 78 89 Q 60 87 42 89" fill="white" />}
      {/* Chin cleft */}
      <path d="M 57 95 Q 60 98 63 95" stroke="#c07858" strokeWidth={1.5} fill="none" />
      {sweat && <ellipse cx={98} cy={60} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Bullrich portrait â€” short grey hair, angular bony face, stern â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e4ecf0" />
      {/* Dark navy/charcoal blazer */}
      <rect x={16} y={94} width={88} height={50} fill="#2a3040" stroke={OL} strokeWidth={2} />
      <rect x={49} y={94} width={22} height={48} fill="#eaeaea" />
      <polygon points="16,94 49,94 32,118" fill="#1e2430" stroke={OL} strokeWidth={1} />
      <polygon points="104,94 71,94 88,118" fill="#1e2430" stroke={OL} strokeWidth={1} />
      {/* Security badge on lapel */}
      <rect x={20} y={100} width={14} height={10} fill="#b8902a" rx={1} stroke={OL} strokeWidth={1} />
      <rect x={22} y={102} width={10} height={6} fill="#d4a840" rx={1} />
      {/* Scarf/blouse detail â€” teal */}
      <path d="M 49 94 Q 60 106 71 94" fill="#2a8a80" stroke={OL} strokeWidth={1} />
      {/* Thin neck */}
      <rect x={50} y={80} width={20} height={18} fill="#ddb898" />
      {/* HEAD â€” narrower angular face, higher cheekbones */}
      <path d="M 32 42 Q 32 26 60 24 Q 88 26 88 42 L 86 80 Q 84 94 72 96 L 48 96 Q 36 94 34 80 Z"
        fill="#ddb898" stroke={OL} strokeWidth={2.5} />
      {/* Cheekbone definition */}
      <path d="M 34 70 Q 40 76 46 72" stroke="#c09070" strokeWidth={1.5} fill="none" />
      <path d="M 86 70 Q 80 76 74 72" stroke="#c09070" strokeWidth={1.5} fill="none" />
      {/* SHORT GREY HAIR â€” practical cut, not styled */}
      <path d="M 32 44 Q 34 22 60 20 Q 86 22 88 44 Q 82 28 66 26 Q 60 24 54 26 Q 38 28 32 44" fill="#9a9aa0" />
      {/* Hair flat on top â€” not wavy, close-cropped feel */}
      <path d="M 36 36 Q 60 30 84 36" stroke="#9a9aa0" strokeWidth={4} fill="none" />
      <path d="M 34 44 Q 60 38 86 44" stroke="#808088" strokeWidth={2} fill="none" />
      {/* Side hair close to head */}
      <rect x={32} y={42} width={5} height={24} fill="#9a9aa0" rx={2} />
      <rect x={83} y={42} width={5} height={24} fill="#9a9aa0" rx={2} />
      {/* Ears â€” visible through short hair */}
      <ellipse cx={30} cy={62} rx={6} ry={8} fill="#ddb898" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={90} cy={62} rx={6} ry={8} fill="#ddb898" stroke={OL} strokeWidth={1.5} />
      {/* Small pearl earrings */}
      <circle cx={30} cy={70} r={3} fill="#f0f0e8" stroke={OL} strokeWidth={0.8} />
      <circle cx={90} cy={70} r={3} fill="#f0f0e8" stroke={OL} strokeWidth={0.8} />
      {/* STERN angular eyebrows â€” nearly straight, pushed down */}
      <path d="M 35 50 L 54 48" stroke="#5a4a30" strokeWidth={4} fill="none" strokeLinecap="square" />
      <path d="M 66 48 L 85 50" stroke="#5a4a30" strokeWidth={4} fill="none" strokeLinecap="square" />
      {/* Eyes â€” narrowed, stern */}
      <ellipse cx={44} cy={60} rx={9} ry={6} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={76} cy={60} rx={9} ry={6} fill="white" stroke={OL} strokeWidth={1.5} />
      {/* Stern eyelid */}
      <path d="M 35 58 Q 44 55 53 58" stroke={OL} strokeWidth={2} fill="none" />
      <path d="M 67 58 Q 76 55 85 58" stroke={OL} strokeWidth={2} fill="none" />
      <circle cx={44} cy={60} r={4.5} fill="#385028" />
      <circle cx={76} cy={60} r={4.5} fill="#385028" />
      <circle cx={45} cy={58} r={1.5} fill="white" />
      <circle cx={77} cy={58} r={1.5} fill="white" />
      {/* Thin nose â€” pointed */}
      <path d="M 58 68 L 56 78 M 62 68 L 64 78" stroke="#b87858" strokeWidth={1.5} fill="none" />
      <ellipse cx={60} cy={78} rx={4} ry={3} fill="#ddb898" stroke="#b87858" strokeWidth={1} />
      {/* Thin pressed lips */}
      {smile
        ? <path d="M 46 86 Q 60 94 74 86" stroke="#803030" strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 86 Q 60 88 74 86" stroke="#803030" strokeWidth={2.5} fill="none" strokeLinecap="round" />}
      <path d="M 46 86 Q 60 83 74 86" stroke="#d07070" strokeWidth={1.5} fill="none" />
      {sweat && <ellipse cx={90} cy={56} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Bregman portrait â€” curly dark hair, round glasses, determined â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BregmanPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#f0e4dc" />
      {/* Red blazer â€” FIT-Unidad signature */}
      <rect x={14} y={92} width={92} height={52} fill="#8b1a1a" stroke={OL} strokeWidth={2} />
      <rect x={48} y={92} width={24} height={50} fill="#f0e8e8" />
      <polygon points="14,92 48,92 30,118" fill="#6e1212" stroke={OL} strokeWidth={1} />
      <polygon points="106,92 72,92 90,118" fill="#6e1212" stroke={OL} strokeWidth={1} />
      {/* Neck */}
      <rect x={48} y={78} width={24} height={18} fill="#e8c0a0" />
      {/* HEAD â€” round, approachable */}
      <ellipse cx={60} cy={62} rx={30} ry={32} fill="#e8c0a0" stroke={OL} strokeWidth={2.5} />
      {/* CURLY dark hair â€” bushy, voluminous */}
      <ellipse cx={60} cy={36} rx={34} ry={22} fill="#1a0808" />
      {/* Curly texture bumps on top */}
      {[28,36,44,52,60,68,76,84].map((x) => (
        <ellipse key={x} cx={x} cy={28} rx={6} ry={5} fill="#1a0808" />
      ))}
      {/* Side curls */}
      <ellipse cx={26} cy={50} rx={10} ry={16} fill="#1a0808" />
      <ellipse cx={94} cy={50} rx={10} ry={16} fill="#1a0808" />
      {[22,28].map((y) => (
        <ellipse key={y} cx={24} cy={y + 42} rx={6} ry={5} fill="#1a0808" />
      ))}
      {[22,28].map((y) => (
        <ellipse key={y} cx={96} cy={y + 42} rx={6} ry={5} fill="#1a0808" />
      ))}
      {/* Ears */}
      <ellipse cx={28} cy={64} rx={6} ry={8} fill="#e8c0a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={92} cy={64} rx={6} ry={8} fill="#e8c0a0" stroke={OL} strokeWidth={1.5} />
      {/* Small hoop earrings */}
      <circle cx={28} cy={72} r={4} fill="none" stroke="#c8901a" strokeWidth={2} />
      <circle cx={92} cy={72} r={4} fill="none" stroke="#c8901a" strokeWidth={2} />
      {/* Dark eyebrows */}
      <path d="M 34 52 Q 43 48 52 52" stroke="#1a0808" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 68 52 Q 77 48 86 52" stroke="#1a0808" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* ROUND GLASSES â€” THE defining feature */}
      <circle cx={43} cy={62} r={11} fill="none" stroke="#2a1a08" strokeWidth={3} />
      <circle cx={77} cy={62} r={11} fill="none" stroke="#2a1a08" strokeWidth={3} />
      {/* Glass lens fill */}
      <circle cx={43} cy={62} r={10} fill="white" opacity={0.15} />
      <circle cx={77} cy={62} r={10} fill="white" opacity={0.15} />
      {/* Bridge of glasses */}
      <line x1={54} y1={62} x2={66} y2={62} stroke="#2a1a08" strokeWidth={2.5} />
      {/* Temple arms */}
      <line x1={32} y1={58} x2={26} y2={56} stroke="#2a1a08" strokeWidth={2} />
      <line x1={88} y1={58} x2={94} y2={56} stroke="#2a1a08" strokeWidth={2} />
      {/* Eyes behind glasses */}
      <circle cx={43} cy={62} r={5} fill="#2c1808" />
      <circle cx={77} cy={62} r={5} fill="#2c1808" />
      <circle cx={44} cy={60} r={1.5} fill="white" />
      <circle cx={78} cy={60} r={1.5} fill="white" />
      {/* Nose */}
      <ellipse cx={60} cy={74} rx={4} ry={3} fill="#c89070" />
      {/* Determined smile */}
      {smile
        ? <path d="M 44 84 Q 60 94 76 84" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 84 Q 60 88 74 84" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 44 84 Q 60 94 76 84 Q 60 82 44 84" fill="white" />}
      {sweat && <ellipse cx={94} cy={58} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Schiaretti portrait â€” bald, heavy jowls, wide face, provincial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SchiarettiPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8e4d8" />
      {/* Conservative grey suit */}
      <rect x={12} y={92} width={96} height={52} fill="#5a5a68" stroke={OL} strokeWidth={2} />
      <rect x={48} y={92} width={24} height={50} fill="#e8e8e8" />
      <polygon points="12,92 48,92 28,118" fill="#484858" stroke={OL} strokeWidth={1} />
      <polygon points="108,92 72,92 92,118" fill="#484858" stroke={OL} strokeWidth={1} />
      {/* Provincial flag pin */}
      <rect x={92} y={98} width={12} height={8} fill="#2060a8" rx={1} stroke={OL} strokeWidth={1} />
      <rect x={92} y={98} width={12} height={4} fill="#2060a8" />
      <rect x={92} y={102} width={12} height={4} fill="#e8e820" />
      {/* Blue tie */}
      <polygon points="56,95 64,95 62,126 58,126" fill="#1840a0" />
      {/* Heavy neck */}
      <rect x={44} y={78} width={32} height={18} fill="#d4b090" />
      {/* HEAD â€” WIDE and heavy, jowly */}
      <path d="M 18 52 Q 20 30 60 28 Q 100 30 102 52 L 104 80 Q 104 98 82 100 L 38 100 Q 16 98 16 80 Z"
        fill="#d4b090" stroke={OL} strokeWidth={2.5} />
      {/* Jowls */}
      <ellipse cx={28} cy={86} rx={14} ry={10} fill="#c8a07a" opacity={0.6} />
      <ellipse cx={92} cy={86} rx={14} ry={10} fill="#c8a07a" opacity={0.6} />
      {/* BALD HEAD â€” just a thin rim of grey at sides */}
      <path d="M 20 52 Q 22 30 60 28 Q 98 30 100 52 Q 90 36 74 32 Q 60 30 46 32 Q 30 36 20 52" fill="#d4b090" />
      {/* Thin grey hair on sides â€” classic balder look */}
      <path d="M 18 52 Q 18 46 22 42 Q 26 38 30 40" stroke="#aaaaaa" strokeWidth={3} fill="none" />
      <path d="M 102 52 Q 102 46 98 42 Q 94 38 90 40" stroke="#aaaaaa" strokeWidth={3} fill="none" />
      <rect x={18} y={50} width={6} height={22} fill="#aaaaaa" rx={2} />
      <rect x={96} y={50} width={6} height={22} fill="#aaaaaa" rx={2} />
      {/* Ears â€” large, pushed out */}
      <ellipse cx={16} cy={68} rx={9} ry={12} fill="#d4b090" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={104} cy={68} rx={9} ry={12} fill="#d4b090" stroke={OL} strokeWidth={1.5} />
      {/* Heavy dark eyebrows */}
      <path d="M 30 52 L 52 50" stroke="#2a2010" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 68 50 L 90 52" stroke="#2a2010" strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* Eyes â€” small under heavy brows */}
      <ellipse cx={41} cy={62} rx={10} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={79} cy={62} rx={10} ry={7} fill="white" stroke={OL} strokeWidth={1.5} />
      <circle cx={41} cy={62} r={5} fill="#1a1018" />
      <circle cx={79} cy={62} r={5} fill="#1a1018" />
      <circle cx={42} cy={60} r={1.5} fill="white" />
      <circle cx={80} cy={60} r={1.5} fill="white" />
      {/* Wide nose */}
      <ellipse cx={60} cy={74} rx={8} ry={6} fill="#b89060" />
      <circle cx={54} cy={77} r={3.5} fill="#a07848" />
      <circle cx={66} cy={77} r={3.5} fill="#a07848" />
      {/* Calm expression */}
      {smile
        ? <path d="M 38 88 Q 60 100 82 88" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 38 88 Q 60 92 82 88" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 38 88 Q 60 100 82 88 Q 60 86 38 88" fill="white" />}
      {sweat && <ellipse cx={102} cy={58} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Larreta portrait â€” salt-and-pepper hair, slim face, corporate â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LarretaPortrait({ mood }: { mood: PortraitMood }) {
  const sweat = mood === 'panic';
  const smile = mood === 'victory';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8dc" />
      {/* Charcoal slim-fit suit */}
      <rect x={16} y={94} width={88} height={50} fill="#2c2c3c" stroke={OL} strokeWidth={2} />
      <rect x={49} y={94} width={22} height={48} fill="#eeeeee" />
      <polygon points="16,94 49,94 32,116" fill="#20202e" stroke={OL} strokeWidth={1} />
      <polygon points="104,94 71,94 88,116" fill="#20202e" stroke={OL} strokeWidth={1} />
      {/* Light blue tie â€” PRO party color */}
      <polygon points="56,96 64,96 62,128 58,128" fill="#2878c8" />
      <polygon points="56,96 64,96 60,108" fill="#1858a0" />
      {/* Neck */}
      <rect x={50} y={80} width={20} height={18} fill="#e8c4a0" />
      {/* HEAD â€” slim, longer face, slightly pointed chin */}
      <path d="M 34 46 Q 34 28 60 26 Q 86 28 86 46 L 84 82 Q 82 96 68 98 L 52 98 Q 38 96 36 82 Z"
        fill="#e8c4a0" stroke={OL} strokeWidth={2.5} />
      {/* SALT-AND-PEPPER hair â€” styled, side part */}
      <path d="M 34 46 Q 36 26 60 24 Q 84 26 86 46 Q 80 30 66 28 Q 60 26 54 28 Q 40 30 34 46" fill="#6a6a78" />
      {/* Grey highlights */}
      <path d="M 40 32 Q 52 26 68 28" stroke="#a0a0b0" strokeWidth={2.5} fill="none" />
      <path d="M 36 40 Q 60 34 84 40" stroke="#888898" strokeWidth={2} fill="none" />
      {/* Side part */}
      <line x1={54} y1={26} x2={50} y2={42} stroke="#505060" strokeWidth={1.5} />
      {/* Temples â€” grey sides */}
      <rect x={34} y={44} width={5} height={22} fill="#6a6a78" rx={2} />
      <rect x={81} y={44} width={5} height={22} fill="#6a6a78" rx={2} />
      {/* Ears */}
      <ellipse cx={32} cy={64} rx={6} ry={8} fill="#e8c4a0" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={88} cy={64} rx={6} ry={8} fill="#e8c4a0" stroke={OL} strokeWidth={1.5} />
      {/* Neat groomed eyebrows â€” slightly greying */}
      <path d="M 37 52 Q 47 48 56 52" stroke="#4a4a56" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <path d="M 64 52 Q 73 48 83 52" stroke="#4a4a56" strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {/* Eyes â€” alert, slightly tired */}
      <ellipse cx={46} cy={63} rx={9} ry={6.5} fill="white" stroke={OL} strokeWidth={1.5} />
      <ellipse cx={74} cy={63} rx={9} ry={6.5} fill="white" stroke={OL} strokeWidth={1.5} />
      {/* Bags under eyes â€” long hours in office */}
      <path d="M 37 67 Q 46 70 55 67" stroke="#c09878" strokeWidth={1.2} fill="none" />
      <path d="M 65 67 Q 74 70 83 67" stroke="#c09878" strokeWidth={1.2} fill="none" />
      <circle cx={46} cy={63} r={5} fill="#303848" />
      <circle cx={74} cy={63} r={5} fill="#303848" />
      <circle cx={47} cy={61} r={1.5} fill="white" />
      <circle cx={75} cy={61} r={1.5} fill="white" />
      {/* Slim nose */}
      <path d="M 59 70 L 57 79 M 61 70 L 63 79" stroke="#c08858" strokeWidth={1.5} fill="none" />
      <ellipse cx={60} cy={79} rx={5} ry={3} fill="#e0c090" stroke="#c08858" strokeWidth={1} />
      {/* Neutral professional smile */}
      {smile
        ? <path d="M 45 88 Q 60 98 75 88" stroke={OL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        : <path d="M 46 88 Q 60 91 74 88" stroke={OL} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {smile && <path d="M 45 88 Q 60 98 75 88 Q 60 86 45 88" fill="white" />}
      {sweat && <ellipse cx={86} cy={60} rx={4} ry={6} fill="#88b8f0" opacity={0.8} />}
    </g>
  );
}

// â”€â”€ Export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function PixelPortrait({ id, mood = 'neutral', px = 96 }: Props) {
  // Map archetype aliases to base character
  const base: PortraitId =
    id === 'ingeniero'  ? 'milei'       :
    id === 'populista'  ? 'massa'       :
    id === 'tecnocrata' ? 'bullrich'    :
    id === 'izquierda'  ? 'bregman'     :
    id === 'federal'    ? 'schiaretti'  :
    id === 'corporativo'? 'larreta'     : id;

  const imageUrl = useGameImage(`char_${base}`);

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
      {base === 'milei'       && <MileiPortrait mood={mood} />}
      {base === 'massa'       && <MassaPortrait mood={mood} />}
      {base === 'bullrich'    && <BullrichPortrait mood={mood} />}
      {base === 'bregman'     && <BregmanPortrait mood={mood} />}
      {base === 'schiaretti'  && <SchiarettiPortrait mood={mood} />}
      {base === 'larreta'     && <LarretaPortrait mood={mood} />}
    </svg>
  );
}

