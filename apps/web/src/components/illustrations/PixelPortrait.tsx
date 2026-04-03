import React from 'react';
import { useGameImage } from '../../hooks/useGameImage.js';

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'bregman' | 'schiaretti' | 'larreta' | 'ingeniero' | 'populista' | 'tecnocrata' | 'izquierda' | 'federal' | 'corporativo';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

// ── Milei ─────────────────────────────────────────────────────────────────────
// Wild hair spikes, staring eyes, mutton-chops, chainsaw
function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#d4956a';
  const hair  = '#1e0c04';
  return (
    <g>
      {/* sky background */}
      <rect x={0} y={0} width={120} height={140} fill="#e8e0cc" />
      {/* suit body */}
      <rect x={14} y={94} width={92} height={50} fill="#0c0c20" />
      {/* lapels */}
      <rect x={14} y={94} width={32} height={46} fill="#181828" />
      <rect x={74} y={94} width={32} height={46} fill="#181828" />
      {/* shirt */}
      <rect x={46} y={94} width={28} height={46} fill="#d8d8d8" />
      {/* red tie */}
      <rect x={54} y={96} width={12} height={38} fill="#c01010" />
      <rect x={56} y={96} width={8}  height={8}  fill="#a00808" />
      {/* neck */}
      <rect x={46} y={78} width={28} height={20} fill={skin} />
      {/* HEAD – narrow long */}
      <rect x={30} y={32} width={60} height={64} fill={skin} rx={6} />
      {/* ── HAIR: 7 upward spikes ── */}
      <rect x={28} y={8}  width={10} height={34} fill={hair} />
      <rect x={38} y={2}  width={9}  height={36} fill={hair} />
      <rect x={47} y={-4} width={8}  height={38} fill={hair} />
      <rect x={55} y={-6} width={10} height={40} fill={hair} />
      <rect x={65} y={-2} width={9}  height={36} fill={hair} />
      <rect x={74} y={4}  width={8}  height={34} fill={hair} />
      <rect x={82} y={10} width={10} height={32} fill={hair} />
      {/* hair base block */}
      <rect x={28} y={30} width={64} height={12} fill={hair} />
      {/* side volume */}
      <rect x={14} y={36} width={18} height={36} fill={hair} />
      <rect x={88} y={36} width={18} height={36} fill={hair} />
      {/* MUTTON-CHOP sideburns – tall rects */}
      <rect x={18} y={52} width={14} height={36} fill={hair} />
      <rect x={88} y={52} width={14} height={36} fill={hair} />
      {/* ears */}
      <rect x={26} y={58} width={8}  height={14} fill={skin} />
      <rect x={86} y={58} width={8}  height={14} fill={skin} />
      {/* heavy brow rects */}
      <rect x={33} y={50} width={20} height={5}  fill={hair} />
      <rect x={67} y={50} width={20} height={5}  fill={hair} />
      {/* STARING eyes – white squares + dark iris + highlight */}
      <rect x={34} y={57} width={18} height={14} fill="white" />
      <rect x={68} y={57} width={18} height={14} fill="white" />
      <rect x={39} y={59} width={8}  height={10} fill={hair} />
      <rect x={73} y={59} width={8}  height={10} fill={hair} />
      <rect x={40} y={59} width={3}  height={3}  fill="white" />
      <rect x={74} y={59} width={3}  height={3}  fill="white" />
      {/* nose bridge + nostrils */}
      <rect x={56} y={68} width={8}  height={12} fill="#b87040" />
      <rect x={50} y={76} width={8}  height={6}  fill="#a05c30" />
      <rect x={62} y={76} width={8}  height={6}  fill="#a05c30" />
      {/* mouth */}
      {win
        ? <rect x={40} y={87} width={40} height={5} fill="#cc2020" rx={2} />
        : <rect x={42} y={87} width={36} height={4} fill="#8a3a20" rx={1} />}
      {win && <rect x={42} y={87} width={36} height={3} fill="white" />}
      {/* CHAINSAW – bottom right */}
      <rect x={80} y={108} width={36} height={10} fill="#c07020" />
      <rect x={88} y={104} width={24} height={6}  fill="#808090" />
      <rect x={90} y={110} width={24} height={20} fill="#e0be10" />
      {[0,4,8,12,16].map(dy => <rect key={dy} x={90} y={112+dy} width={24} height={2} fill="#1a1a1a" opacity={0.3} />)}
      {/* panic sweat drops */}
      {panic && <rect x={92} y={54} width={5} height={8} fill="#88c8f0" rx={2} />}
      {panic && <rect x={22} y={66} width={4} height={7} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Massa ─────────────────────────────────────────────────────────────────────
// Wide square jaw, slicked dark hair, hooded eyes, politician smirk
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#d4906a';
  const hair  = '#080810';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8f4" />
      {/* navy suit – wide shoulders */}
      <rect x={8}  y={90} width={104} height={54} fill="#1a1e6a" />
      {/* lapels */}
      <rect x={8}  y={90} width={36} height={50} fill="#12164e" />
      <rect x={76} y={90} width={36} height={50} fill="#12164e" />
      {/* shirt */}
      <rect x={44} y={90} width={32} height={52} fill="#eeeeee" />
      {/* red tie */}
      <rect x={52} y={92} width={16} height={42} fill="#cc1010" />
      <rect x={54} y={92} width={12} height={10} fill="#aa0808" />
      {/* thick neck */}
      <rect x={42} y={76} width={36} height={18} fill={skin} />
      {/* HEAD – wide rect, square jaw */}
      <rect x={20} y={28} width={80} height={52} fill={skin} />
      {/* jaw – slightly wider */}
      <rect x={22} y={70} width={76} height={20} fill={skin} />
      {/* jaw corners rounded feel */}
      <rect x={20} y={72} width={6}  height={14} fill={skin} />
      <rect x={94} y={72} width={6}  height={14} fill={skin} />
      {/* chin */}
      <rect x={38} y={88} width={44} height={8}  fill="#c07858" />
      {/* chin cleft */}
      <rect x={57} y={90} width={6}  height={6}  fill="#b07048" />
      {/* SLICKED hair – flat top, combed back */}
      <rect x={20} y={18} width={80} height={16} fill={hair} />
      {/* comb lines */}
      <rect x={22} y={20} width={76} height={2} fill="#1a1a30" opacity={0.4} />
      <rect x={22} y={24} width={76} height={2} fill="#1a1a30" opacity={0.3} />
      {/* side hair strips */}
      <rect x={20} y={28} width={8}  height={28} fill={hair} />
      <rect x={92} y={28} width={8}  height={28} fill={hair} />
      {/* ears */}
      <rect x={14} y={54} width={10} height={18} fill={skin} />
      <rect x={96} y={54} width={10} height={18} fill={skin} />
      {/* HEAVY straight brows */}
      <rect x={28} y={46} width={26} height={6}  fill={hair} />
      <rect x={66} y={46} width={26} height={6}  fill={hair} />
      {/* hooded eyelid rects */}
      <rect x={28} y={53} width={26} height={4}  fill={skin} />
      <rect x={66} y={53} width={26} height={4}  fill={skin} />
      {/* eyes white */}
      <rect x={30} y={55} width={22} height={12} fill="white" />
      <rect x={68} y={55} width={22} height={12} fill="white" />
      {/* iris */}
      <rect x={36} y={56} width={10} height={10} fill="#0a0808" />
      <rect x={74} y={56} width={10} height={10} fill="#0a0808" />
      {/* highlight */}
      <rect x={37} y={57} width={3}  height={3}  fill="white" />
      <rect x={75} y={57} width={3}  height={3}  fill="white" />
      {/* lower eyelid shadow */}
      <rect x={30} y={67} width={22} height={3}  fill="#b07850" opacity={0.5} />
      <rect x={68} y={67} width={22} height={3}  fill="#b07850" opacity={0.5} />
      {/* wide nose */}
      <rect x={52} y={68} width={16} height={14} fill="#b87848" />
      <rect x={46} y={78} width={10} height={5}  fill="#a06030" />
      <rect x={64} y={78} width={10} height={5}  fill="#a06030" />
      {/* politician smirk – asymmetric */}
      {win
        ? <rect x={36} y={86} width={48} height={5} fill="#cc2020" rx={2} />
        : <rect x={38} y={86} width={40} height={4} fill="#8a3a20" rx={1} />}
      {win && <rect x={38} y={86} width={46} height={3} fill="white" />}
      {/* NEWSPAPER prop – bottom left */}
      <rect x={2}  y={104} width={30} height={22} fill="#f0e8c8" />
      <rect x={4}  y={106} width={26} height={3}  fill="#c0b890" />
      <rect x={4}  y={112} width={26} height={2}  fill="#c0b890" />
      <rect x={4}  y={116} width={18} height={2}  fill="#c0b890" />
      <rect x={4}  y={120} width={22} height={2}  fill="#c0b890" />
      {panic && <rect x={96} y={52} width={5} height={8} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Bullrich ──────────────────────────────────────────────────────────────────
// Short grey hair, angular bony face, stern brows, thin lips, security badge
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#ddb090';
  const hair  = '#8a8898';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e4ecf0" />
      {/* charcoal blazer */}
      <rect x={14} y={92} width={92} height={52} fill="#28303c" />
      {/* lapels */}
      <rect x={14} y={92} width={30} height={48} fill="#1e2430" />
      <rect x={76} y={92} width={30} height={48} fill="#1e2430" />
      {/* teal blouse */}
      <rect x={44} y={92} width={32} height={48} fill="#2a7a72" />
      {/* security badge on lapel */}
      <rect x={18} y={98} width={18} height={12} fill="#c89020" />
      <rect x={20} y={100} width={14} height={8}  fill="#e0b030" />
      <rect x={24} y={102} width={6}  height={4}  fill="#c89020" />
      {/* thin neck */}
      <rect x={48} y={78} width={24} height={18} fill={skin} />
      {/* HEAD – narrower angular */}
      <rect x={32} y={28} width={56} height={54} fill={skin} />
      {/* jaw – same width, no taper for angular look */}
      <rect x={34} y={74} width={52} height={16} fill={skin} />
      {/* cheekbone highlight */}
      <rect x={32} y={64} width={10} height={6}  fill="#c89070" opacity={0.5} />
      <rect x={78} y={64} width={10} height={6}  fill="#c89070" opacity={0.5} />
      {/* SHORT GREY HAIR – flat cap */}
      <rect x={32} y={18} width={56} height={16} fill={hair} />
      {/* side sweep left only */}
      <rect x={26} y={24} width={12} height={14} fill={hair} />
      {/* side hair strips */}
      <rect x={32} y={28} width={6}  height={20} fill={hair} />
      <rect x={82} y={28} width={6}  height={18} fill={hair} />
      {/* ears */}
      <rect x={28} y={56} width={8}  height={14} fill={skin} />
      <rect x={84} y={56} width={8}  height={14} fill={skin} />
      {/* pearl earring – white rect at ear */}
      <rect x={28} y={68} width={8}  height={6}  fill="#f8f8f0" />
      <rect x={84} y={68} width={8}  height={6}  fill="#f8f8f0" />
      {/* STERN brows – thin angled down toward center */}
      <rect x={34} y={44} width={22} height={4}  fill="#4a3818" transform="rotate(-2,45,46)" />
      <rect x={64} y={42} width={22} height={4}  fill="#4a3818" transform="rotate(2,75,44)" />
      {/* eye whites */}
      <rect x={36} y={50} width={20} height={12} fill="white" />
      <rect x={64} y={50} width={20} height={12} fill="white" />
      {/* stern eyelid overlay */}
      <rect x={36} y={50} width={20} height={4}  fill={skin} />
      <rect x={64} y={50} width={20} height={4}  fill={skin} />
      {/* iris – greenish */}
      <rect x={41} y={53} width={10} height={8}  fill="#30501c" />
      <rect x={69} y={53} width={10} height={8}  fill="#30501c" />
      {/* highlight */}
      <rect x={42} y={54} width={3}  height={3}  fill="white" />
      <rect x={70} y={54} width={3}  height={3}  fill="white" />
      {/* slim nose */}
      <rect x={55} y={63} width={10} height={12} fill="#c08860" />
      <rect x={52} y={72} width={7}  height={4}  fill="#a87048" />
      <rect x={61} y={72} width={7}  height={4}  fill="#a87048" />
      {/* THIN pressed lips */}
      {win
        ? <rect x={42} y={82} width={36} height={5} fill="#903040" rx={1} />
        : <rect x={44} y={82} width={32} height={3} fill="#903040" />}
      <rect x={44} y={79} width={32} height={3} fill="#cc7080" />
      {panic && <rect x={88} y={48} width={5} height={8} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Bregman ───────────────────────────────────────────────────────────────────
// Curly voluminous dark hair, round glasses, hoop earrings, red blazer
function BregmanPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#cc8860';
  const hair  = '#140808';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#f0e4dc" />
      {/* red blazer */}
      <rect x={12} y={90} width={96} height={54} fill="#8a1010" />
      <rect x={12} y={90} width={32} height={50} fill="#6e0c0c" />
      <rect x={76} y={90} width={32} height={50} fill="#6e0c0c" />
      <rect x={44} y={90} width={32} height={50} fill="#e8e0e0" />
      {/* neck */}
      <rect x={46} y={76} width={28} height={18} fill={skin} />
      {/* HEAD – round face */}
      <rect x={26} y={28} width={68} height={54} fill={skin} />
      <rect x={28} y={74} width={64} height={16} fill={skin} />
      {/* ── CURLY HAIR – base block + rect clusters ── */}
      <rect x={22} y={10} width={76} height={24} fill={hair} />
      {/* top curls – scattered rects */}
      <rect x={24} y={4}  width={10} height={12} fill={hair} />
      <rect x={34} y={0}  width={8}  height={10} fill={hair} />
      <rect x={42} y={-2} width={10} height={12} fill={hair} />
      <rect x={52} y={-4} width={10} height={14} fill={hair} />
      <rect x={62} y={-2} width={10} height={12} fill={hair} />
      <rect x={72} y={2}  width={8}  height={10} fill={hair} />
      <rect x={80} y={6}  width={10} height={10} fill={hair} />
      {/* side volume – big rects */}
      <rect x={10} y={22} width={18} height={40} fill={hair} />
      <rect x={92} y={22} width={18} height={40} fill={hair} />
      {/* side curl bumps */}
      <rect x={8}  y={26} width={10} height={8}  fill={hair} />
      <rect x={8}  y={36} width={10} height={8}  fill={hair} />
      <rect x={8}  y={46} width={10} height={8}  fill={hair} />
      <rect x={102} y={26} width={10} height={8}  fill={hair} />
      <rect x={102} y={36} width={10} height={8}  fill={hair} />
      <rect x={102} y={46} width={10} height={8}  fill={hair} />
      {/* ears */}
      <rect x={24} y={52} width={8}  height={14} fill={skin} />
      <rect x={88} y={52} width={8}  height={14} fill={skin} />
      {/* HOOP earrings */}
      <rect x={22} y={64} width={10} height={2}  fill="#c89018" />
      <rect x={22} y={66} width={2}  height={6}  fill="#c89018" />
      <rect x={30} y={66} width={2}  height={6}  fill="#c89018" />
      <rect x={86} y={64} width={10} height={2}  fill="#c89018" />
      <rect x={86} y={66} width={2}  height={6}  fill="#c89018" />
      <rect x={94} y={66} width={2}  height={6}  fill="#c89018" />
      {/* brows */}
      <rect x={30} y={44} width={20} height={4}  fill={hair} />
      <rect x={70} y={44} width={20} height={4}  fill={hair} />
      {/* ROUND GLASSES – outer border rects + lens area */}
      <rect x={28} y={50} width={28} height={20} fill="#1e0e04" />
      <rect x={64} y={50} width={28} height={20} fill="#1e0e04" />
      {/* lens interior */}
      <rect x={30} y={52} width={24} height={16} fill="white" opacity={0.18} />
      <rect x={66} y={52} width={24} height={16} fill="white" opacity={0.18} />
      {/* nose bridge */}
      <rect x={56} y={56} width={8}  height={4}  fill="#1e0e04" />
      {/* glasses temples */}
      <rect x={18} y={52} width={10} height={3}  fill="#1e0e04" />
      <rect x={92} y={52} width={10} height={3}  fill="#1e0e04" />
      {/* EYES behind glasses */}
      <rect x={34} y={54} width={12} height={10} fill="#200c08" />
      <rect x={70} y={54} width={12} height={10} fill="#200c08" />
      <rect x={35} y={55} width={4}  height={4}  fill="white" />
      <rect x={71} y={55} width={4}  height={4}  fill="white" />
      {/* nose */}
      <rect x={54} y={68} width={12} height={10} fill="#b87848" />
      <rect x={50} y={75} width={8}  height={4}  fill="#a06030" />
      <rect x={62} y={75} width={8}  height={4}  fill="#a06030" />
      {/* determined smile */}
      {win
        ? <rect x={38} y={84} width={44} height={5} fill="#cc4020" rx={2} />
        : <rect x={40} y={84} width={40} height={4} fill="#883020" rx={1} />}
      {win && <rect x={40} y={84} width={42} height={3} fill="white" />}
      {panic && <rect x={96} y={50} width={5} height={8} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Schiaretti ────────────────────────────────────────────────────────────────
// Bald (no top hair), heavy jowls, wide face, grey fringe on sides
function SchiarettiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c89060';
  const fringe = '#9a9898';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8e4d8" />
      {/* conservative grey suit */}
      <rect x={8}  y={90} width={104} height={54} fill="#52525e" />
      <rect x={8}  y={90} width={34} height={50} fill="#40404c" />
      <rect x={78} y={90} width={34} height={50} fill="#40404c" />
      <rect x={42} y={90} width={36} height={50} fill="#e8e8e8" />
      {/* blue tie */}
      <rect x={50} y={92} width={20} height={42} fill="#1840a0" />
      <rect x={52} y={92} width={16} height={10} fill="#102880" />
      {/* provincial flag pin */}
      <rect x={80} y={96} width={16} height={10} fill="#1850a8" />
      <rect x={80} y={96} width={16} height={5}  fill="#1850a8" />
      <rect x={80} y={101} width={16} height={5} fill="#e8e018" />
      {/* HEAVY neck */}
      <rect x={38} y={76} width={44} height={18} fill={skin} />
      {/* HEAD – very wide rect */}
      <rect x={14} y={30} width={92} height={52} fill={skin} />
      {/* JOWL rects – extra-wide below main face */}
      <rect x={10} y={72} width={100} height={20} fill={skin} />
      {/* jowl definition */}
      <rect x={10} y={82} width={20} height={10} fill="#b07848" opacity={0.4} />
      <rect x={90} y={82} width={20} height={10} fill="#b07848" opacity={0.4} />
      {/* BALD HEAD – just skin color on top, no hair rect */}
      {/* thin grey fringe – low on sides only */}
      <rect x={14} y={48} width={10} height={6}  fill={fringe} />
      <rect x={96} y={48} width={10} height={6}  fill={fringe} />
      <rect x={14} y={40} width={8}  height={10} fill={fringe} />
      <rect x={98} y={40} width={8}  height={10} fill={fringe} />
      {/* ears – large and prominent */}
      <rect x={8}  y={52} width={12} height={22} fill={skin} />
      <rect x={100} y={52} width={12} height={22} fill={skin} />
      {/* HEAVY dark brow line */}
      <rect x={22} y={46} width={30} height={6}  fill="#1c1410" />
      <rect x={68} y={46} width={30} height={6}  fill="#1c1410" />
      {/* small eyes under heavy brows */}
      <rect x={24} y={54} width={24} height={12} fill="white" />
      <rect x={72} y={54} width={24} height={12} fill="white" />
      <rect x={30} y={56} width={12} height={8}  fill="#100c08" />
      <rect x={78} y={56} width={12} height={8}  fill="#100c08" />
      <rect x={31} y={57} width={4}  height={3}  fill="white" />
      <rect x={79} y={57} width={4}  height={3}  fill="white" />
      {/* wide nose */}
      <rect x={50} y={66} width={20} height={14} fill="#a87040" />
      <rect x={44} y={76} width={12} height={5}  fill="#906030" />
      <rect x={64} y={76} width={12} height={5}  fill="#906030" />
      {/* calm expression */}
      {win
        ? <rect x={32} y={86} width={56} height={5} fill="#cc4020" rx={2} />
        : <rect x={34} y={86} width={52} height={4} fill="#6a2818" rx={1} />}
      {win && <rect x={34} y={86} width={52} height={3} fill="white" />}
      {panic && <rect x={104} y={52} width={5} height={8} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Larreta ───────────────────────────────────────────────────────────────────
// Slim narrow face, salt-and-pepper hair (alternating rects), bags under eyes
function LarretaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#d8aa80';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8dc" />
      {/* charcoal slim suit */}
      <rect x={16} y={92} width={88} height={52} fill="#282830" />
      <rect x={16} y={92} width={28} height={48} fill="#1e1e28" />
      <rect x={76} y={92} width={28} height={48} fill="#1e1e28" />
      <rect x={44} y={92} width={32} height={48} fill="#eeeeee" />
      {/* LIGHT BLUE PRO tie */}
      <rect x={52} y={94} width={16} height={40} fill="#2878c8" />
      <rect x={54} y={94} width={12} height={10} fill="#1858a0" />
      {/* thin neck */}
      <rect x={48} y={78} width={24} height={18} fill={skin} />
      {/* HEAD – slim narrow face */}
      <rect x={34} y={28} width={52} height={56} fill={skin} />
      {/* jaw – same width */}
      <rect x={36} y={76} width={48} height={14} fill={skin} />
      {/* ── SALT-AND-PEPPER HAIR – alternating grey/dark rects ── */}
      {/* base layer */}
      <rect x={34} y={16} width={52} height={16} fill="#585860" />
      {/* alternating lighter stripes */}
      {[34,40,46,52,58,64,70,76].map((x, i) =>
        <rect key={x} x={x} y={16} width={5} height={16} fill={i % 2 === 0 ? '#a0a0a8' : '#484850'} />
      )}
      {/* side part indent */}
      <rect x={50} y={16} width={2} height={16} fill="#c8c8c8" />
      {/* side strips */}
      <rect x={34} y={28} width={6}  height={20} fill="#585860" />
      <rect x={80} y={28} width={6}  height={20} fill="#585860" />
      {/* ears */}
      <rect x={30} y={54} width={8}  height={14} fill={skin} />
      <rect x={82} y={54} width={8}  height={14} fill={skin} />
      {/* neat greying brows */}
      <rect x={36} y={46} width={20} height={4}  fill="#484848" />
      <rect x={64} y={46} width={20} height={4}  fill="#484848" />
      {/* eyes */}
      <rect x={38} y={52} width={18} height={12} fill="white" />
      <rect x={64} y={52} width={18} height={12} fill="white" />
      {/* BAGS under eyes – tired look */}
      <rect x={38} y={64} width={18} height={4}  fill="#b88858" opacity={0.5} />
      <rect x={64} y={64} width={18} height={4}  fill="#b88858" opacity={0.5} />
      {/* iris – blue-grey */}
      <rect x={43} y={54} width={8}  height={8}  fill="#303848" />
      <rect x={69} y={54} width={8}  height={8}  fill="#303848" />
      <rect x={44} y={55} width={3}  height={3}  fill="white" />
      <rect x={70} y={55} width={3}  height={3}  fill="white" />
      {/* slim nose */}
      <rect x={56} y={66} width={8}  height={12} fill="#c09058" />
      <rect x={53} y={75} width={6}  height={4}  fill="#a87040" />
      <rect x={61} y={75} width={6}  height={4}  fill="#a87040" />
      {/* neutral professional expression */}
      {win
        ? <rect x={42} y={84} width={36} height={5} fill="#cc4020" rx={2} />
        : <rect x={44} y={84} width={32} height={4} fill="#6a2818" rx={1} />}
      {win && <rect x={42} y={84} width={36} height={3} fill="white" />}
      {panic && <rect x={84} y={50} width={5} height={8} fill="#88c8f0" rx={2} />}
    </g>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function PixelPortrait({ id, mood = 'neutral', px = 96 }: Props) {
  const base: PortraitId =
    id === 'ingeniero'   ? 'milei'       :
    id === 'populista'   ? 'massa'       :
    id === 'tecnocrata'  ? 'bullrich'    :
    id === 'izquierda'   ? 'bregman'     :
    id === 'federal'     ? 'schiaretti'  :
    id === 'corporativo' ? 'larreta'     : id;

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
      {base === 'milei'      && <MileiPortrait      mood={mood} />}
      {base === 'massa'      && <MassaPortrait      mood={mood} />}
      {base === 'bullrich'   && <BullrichPortrait   mood={mood} />}
      {base === 'bregman'    && <BregmanPortrait    mood={mood} />}
      {base === 'schiaretti' && <SchiarettiPortrait mood={mood} />}
      {base === 'larreta'    && <LarretaPortrait    mood={mood} />}
    </svg>
  );
}
