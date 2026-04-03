import React from 'react';
import { useGameImage } from '../../hooks/useGameImage.js';

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'bregman' | 'schiaretti' | 'larreta' | 'ingeniero' | 'populista' | 'tecnocrata' | 'izquierda' | 'federal' | 'corporativo';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

// ── Milei ──────────────────────────────────────────────────────────────────────
// Ref: long voluminous dark-brown chaotic hair, narrow elongated face, blue eyes
function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c8845a';
  const hair  = '#2c1a08';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8e4d8" />
      {/* dark navy suit */}
      <rect x={12} y={96} width={96} height={48} fill="#141428" />
      <rect x={12} y={96} width={30} height={44} fill="#1a1a38" />
      <rect x={78} y={96} width={30} height={44} fill="#1a1a38" />
      {/* light blue shirt */}
      <rect x={42} y={96} width={36} height={44} fill="#4a6fa5" />
      {/* dark tie */}
      <rect x={52} y={98} width={16} height={40} fill="#1a2060" />
      <rect x={54} y={98} width={12} height={8}  fill="#0e1440" />
      {/* neck */}
      <rect x={44} y={80} width={32} height={20} fill={skin} />
      {/* HAIR: voluminous dark brown, very wide and tall */}
      <rect x={16} y={10} width={88} height={44} fill={hair} />
      {/* top irregular height spikes */}
      <rect x={18} y={4}  width={12} height={14} fill={hair} />
      <rect x={30} y={0}  width={10} height={12} fill={hair} />
      <rect x={40} y={-2} width={12} height={14} fill={hair} />
      <rect x={52} y={2}  width={14} height={12} fill={hair} />
      <rect x={66} y={-2} width={12} height={14} fill={hair} />
      <rect x={78} y={2}  width={10} height={12} fill={hair} />
      {/* side volume – wide, extends to shoulder height */}
      <rect x={10} y={28} width={20} height={62} fill={hair} />
      <rect x={90} y={28} width={20} height={62} fill={hair} />
      <rect x={8}  y={46} width={12} height={40} fill={hair} />
      <rect x={100} y={46} width={12} height={40} fill={hair} />
      {/* HEAD – narrow long */}
      <rect x={30} y={28} width={60} height={66} fill={skin} />
      <rect x={32} y={80} width={56} height={18} fill={skin} />
      {/* ears */}
      <rect x={26} y={56} width={8}  height={14} fill={skin} />
      <rect x={86} y={56} width={8}  height={14} fill={skin} />
      {/* heavy dark brows */}
      <rect x={32} y={46} width={22} height={5}  fill={hair} />
      <rect x={66} y={46} width={22} height={5}  fill={hair} />
      {/* CELESTE / blue eyes – key distinguishing feature */}
      <rect x={33} y={53} width={20} height={14} fill="white" />
      <rect x={67} y={53} width={20} height={14} fill="white" />
      <rect x={38} y={54} width={10} height={12} fill="#74ACDF" />
      <rect x={72} y={54} width={10} height={12} fill="#74ACDF" />
      <rect x={41} y={56} width={5}  height={7}  fill="#1a1a38" />
      <rect x={75} y={56} width={5}  height={7}  fill="#1a1a38" />
      <rect x={41} y={56} width={2}  height={2}  fill="white" />
      <rect x={75} y={56} width={2}  height={2}  fill="white" />
      {/* lower lid shadow */}
      <rect x={33} y={67} width={20} height={3}  fill="#b07040" />
      <rect x={67} y={67} width={20} height={3}  fill="#b07040" />
      {/* nose – long narrow */}
      <rect x={56} y={68} width={8}  height={14} fill="#a86838" />
      <rect x={52} y={78} width={7}  height={5}  fill="#906030" />
      <rect x={61} y={78} width={7}  height={5}  fill="#906030" />
      {/* mouth */}
      {win
        ? <rect x={40} y={89} width={40} height={5} fill="#cc3020" />
        : <rect x={42} y={89} width={36} height={4} fill="#7a3020" />}
      {win && <rect x={42} y={89} width={36} height={3} fill="white" />}
      {panic && <rect x={86} y={50} width={4} height={8} fill="#88c8f0" />}
      {panic && <rect x={24} y={62} width={4} height={8} fill="#88c8f0" />}
    </g>
  );
}

// ── Massa ──────────────────────────────────────────────────────────────────────
// Ref: short grey-brown hair, wide square face, DROOPING outer brow corners, dark suit, blue tie
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#b07848';
  const hair  = '#5a4a38';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8f4" />
      {/* dark suit */}
      <rect x={10} y={94} width={100} height={50} fill="#242438" />
      <rect x={10} y={94} width={32} height={46} fill="#1a1a2e" />
      <rect x={78} y={94} width={32} height={46} fill="#1a1a2e" />
      {/* white shirt */}
      <rect x={42} y={94} width={36} height={46} fill="#e8e8e8" />
      {/* blue tie */}
      <rect x={50} y={96} width={20} height={42} fill="#3a5a8a" />
      <rect x={52} y={96} width={16} height={10} fill="#2a4070" />
      {/* thick neck */}
      <rect x={40} y={78} width={40} height={20} fill={skin} />
      {/* SHORT flat grey-brown hair */}
      <rect x={20} y={20} width={80} height={14} fill={hair} />
      <rect x={20} y={28} width={8}  height={16} fill={hair} />
      <rect x={92} y={28} width={8}  height={16} fill={hair} />
      {/* HEAD – wide square */}
      <rect x={20} y={28} width={80} height={56} fill={skin} />
      <rect x={18} y={74} width={84} height={22} fill={skin} />
      <rect x={34} y={92} width={52} height={6}  fill="#9a6838" />
      {/* ears */}
      <rect x={14} y={52} width={10} height={18} fill={skin} />
      <rect x={96} y={52} width={10} height={18} fill={skin} />
      {/* DROOPING outer brow – inner end higher, outer end lower */}
      <rect x={26} y={46} width={14} height={5}  fill="#2c1e10" />
      <rect x={40} y={48} width={10} height={5}  fill="#2c1e10" />
      <rect x={70} y={46} width={14} height={5}  fill="#2c1e10" />
      <rect x={84} y={48} width={10} height={5}  fill="#2c1e10" />
      {/* eyes – dark brown, hooded */}
      <rect x={26} y={54} width={24} height={14} fill="white" />
      <rect x={70} y={54} width={24} height={14} fill="white" />
      <rect x={26} y={54} width={24} height={4}  fill={skin} />
      <rect x={70} y={54} width={24} height={4}  fill={skin} />
      <rect x={31} y={57} width={12} height={10} fill="#3a2410" />
      <rect x={77} y={57} width={12} height={10} fill="#3a2410" />
      <rect x={32} y={58} width={3}  height={3}  fill="white" />
      <rect x={78} y={58} width={3}  height={3}  fill="white" />
      {/* nose – wide */}
      <rect x={52} y={66} width={16} height={14} fill="#9a6030" />
      <rect x={48} y={76} width={10} height={5}  fill="#885028" />
      <rect x={62} y={76} width={10} height={5}  fill="#885028" />
      {/* mouth */}
      {win
        ? <rect x={36} y={88} width={48} height={5} fill="#cc3020" />
        : <rect x={38} y={88} width={44} height={4} fill="#6a2810" />}
      {win && <rect x={38} y={88} width={46} height={3} fill="white" />}
      {panic && <rect x={94} y={50} width={4} height={8} fill="#88c8f0" />}
    </g>
  );
}

// ── Bullrich ───────────────────────────────────────────────────────────────────
// Ref: medium-brown hair with STRAIGHT FRINGE/BANGS, oval face, grey blazer, pink blouse
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c07848';
  const hair  = '#7a4a28';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8eef0" />
      {/* grey blazer */}
      <rect x={14} y={94} width={92} height={50} fill="#787878" />
      <rect x={14} y={94} width={30} height={46} fill="#646464" />
      <rect x={76} y={94} width={30} height={46} fill="#646464" />
      {/* pink/rose blouse */}
      <rect x={44} y={94} width={32} height={46} fill="#e8b8a8" />
      {/* necklace hint */}
      <rect x={48} y={98} width={24} height={2}  fill="#c89060" />
      {/* neck */}
      <rect x={46} y={78} width={28} height={20} fill={skin} />
      {/* HAIR – medium brown, shoulder length */}
      <rect x={24} y={14} width={72} height={22} fill={hair} />
      <rect x={18} y={28} width={18} height={58} fill={hair} />
      <rect x={84} y={28} width={18} height={58} fill={hair} />
      {/* STRAIGHT FRINGE – flat horizontal rect across forehead, key feature */}
      <rect x={28} y={26} width={64} height={14} fill={hair} />
      <rect x={28} y={38} width={64} height={3}  fill="#5a3218" />
      {/* HEAD */}
      <rect x={30} y={28} width={60} height={66} fill={skin} />
      <rect x={32} y={82} width={56} height={16} fill={skin} />
      {/* ears */}
      <rect x={26} y={54} width={8}  height={14} fill={skin} />
      <rect x={86} y={54} width={8}  height={14} fill={skin} />
      {/* stud earrings */}
      <rect x={26} y={60} width={6}  height={6}  fill="#e0d0b0" />
      <rect x={88} y={60} width={6}  height={6}  fill="#e0d0b0" />
      {/* brows – under fringe, medium */}
      <rect x={34} y={46} width={20} height={4}  fill="#3a1e0a" />
      <rect x={66} y={46} width={20} height={4}  fill="#3a1e0a" />
      {/* eyes */}
      <rect x={34} y={52} width={20} height={14} fill="white" />
      <rect x={66} y={52} width={20} height={14} fill="white" />
      <rect x={38} y={54} width={12} height={10} fill="#4a2810" />
      <rect x={70} y={54} width={12} height={10} fill="#4a2810" />
      <rect x={39} y={55} width={3}  height={3}  fill="white" />
      <rect x={71} y={55} width={3}  height={3}  fill="white" />
      {/* nose */}
      <rect x={55} y={64} width={10} height={12} fill="#a86030" />
      <rect x={52} y={72} width={7}  height={5}  fill="#905028" />
      <rect x={61} y={72} width={7}  height={5}  fill="#905028" />
      {/* mouth – slightly open, speaking */}
      {win
        ? <rect x={40} y={82} width={40} height={6} fill="#cc3020" />
        : <rect x={42} y={82} width={36} height={5} fill="#9a4838" />}
      <rect x={44} y={82} width={32} height={3} fill="#e89088" />
      {win && <rect x={42} y={83} width={36} height={4} fill="white" />}
      {panic && <rect x={88} y={48} width={4} height={8} fill="#88c8f0" />}
    </g>
  );
}

// ── Bregman ────────────────────────────────────────────────────────────────────
// Ref: blonde straight hair, slim face, dark leather jacket, friendly smile, green eyes
function BregmanPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#d8a870';
  const hair  = '#c8a030';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#f0e8d8" />
      {/* dark leather jacket */}
      <rect x={14} y={94} width={92} height={50} fill="#181818" />
      <rect x={14} y={94} width={32} height={46} fill="#0e0e0e" />
      <rect x={74} y={94} width={32} height={46} fill="#0e0e0e" />
      {/* white inner shirt */}
      <rect x={46} y={94} width={28} height={46} fill="#e8e8e8" />
      {/* jacket centre line */}
      <rect x={58} y={94} width={4}  height={46} fill="#2a2a2a" />
      {/* neck */}
      <rect x={46} y={78} width={28} height={20} fill={skin} />
      {/* BLONDE HAIR – straight, layered highlights */}
      <rect x={22} y={14} width={76} height={22} fill={hair} />
      <rect x={28} y={14} width={8}  height={22} fill="#e0c040" />
      <rect x={48} y={14} width={6}  height={22} fill="#e0c040" />
      <rect x={70} y={14} width={8}  height={22} fill="#e0c040" />
      {/* side panels – shoulder length */}
      <rect x={16} y={26} width={18} height={58} fill={hair} />
      <rect x={86} y={26} width={18} height={58} fill={hair} />
      {/* hair over forehead */}
      <rect x={26} y={28} width={68} height={10} fill={hair} />
      {/* HEAD – slim oval */}
      <rect x={28} y={28} width={64} height={62} fill={skin} />
      <rect x={30} y={80} width={60} height={16} fill={skin} />
      <rect x={42} y={92} width={36} height={4}  fill="#c09060" />
      {/* ears */}
      <rect x={24} y={54} width={8}  height={14} fill={skin} />
      <rect x={88} y={54} width={8}  height={14} fill={skin} />
      {/* natural brows */}
      <rect x={32} y={46} width={20} height={4}  fill="#6a3a18" />
      <rect x={68} y={46} width={20} height={4}  fill="#6a3a18" />
      {/* eyes – green */}
      <rect x={32} y={52} width={22} height={14} fill="white" />
      <rect x={66} y={52} width={22} height={14} fill="white" />
      <rect x={36} y={54} width={14} height={10} fill="#5a8860" />
      <rect x={70} y={54} width={14} height={10} fill="#5a8860" />
      <rect x={39} y={55} width={8}  height={7}  fill="#1a3020" />
      <rect x={73} y={55} width={8}  height={7}  fill="#1a3020" />
      <rect x={40} y={55} width={2}  height={2}  fill="white" />
      <rect x={74} y={55} width={2}  height={2}  fill="white" />
      {/* nose */}
      <rect x={55} y={64} width={10} height={12} fill="#b87848" />
      <rect x={52} y={72} width={7}  height={5}  fill="#a06030" />
      <rect x={61} y={72} width={7}  height={5}  fill="#a06030" />
      {/* friendly smile – upturned corners */}
      {win
        ? <rect x={38} y={82} width={44} height={6} fill="#cc4020" />
        : <rect x={40} y={82} width={40} height={4} fill="#8a4028" />}
      <rect x={38} y={80} width={4}  height={4}  fill="#c87868" />
      <rect x={78} y={80} width={4}  height={4}  fill="#c87868" />
      {win && <rect x={40} y={83} width={40} height={4} fill="white" />}
      {panic && <rect x={90} y={50} width={4} height={8} fill="#88c8f0" />}
    </g>
  );
}

// ── Schiaretti ─────────────────────────────────────────────────────────────────
// Ref: short white-grey hair WITH coverage, very wide round face, FRIENDLY SMILE, blue suit
function SchiarettiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#b87848';
  const hair  = '#c0b8a8';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#e8f0f4" />
      {/* blue suit */}
      <rect x={8}  y={92} width={104} height={52} fill="#3a5a8a" />
      <rect x={8}  y={92} width={34} height={48} fill="#2c4870" />
      <rect x={78} y={92} width={34} height={48} fill="#2c4870" />
      <rect x={42} y={92} width={36} height={48} fill="#f0f0f0" />
      {/* dark blue tie */}
      <rect x={50} y={94} width={20} height={44} fill="#1a3060" />
      <rect x={52} y={94} width={16} height={12} fill="#0e1e40" />
      {/* HEAVY neck */}
      <rect x={36} y={76} width={48} height={20} fill={skin} />
      {/* SHORT WHITE-GREY HAIR – has real coverage, not bald */}
      <rect x={16} y={20} width={88} height={16} fill={hair} />
      <rect x={16} y={20} width={88} height={4}  fill="#9a9080" />
      <rect x={16} y={28} width={10} height={18} fill={hair} />
      <rect x={94} y={28} width={10} height={18} fill={hair} />
      {/* HEAD – VERY WIDE */}
      <rect x={12} y={28} width={96} height={56} fill={skin} />
      {/* JOWLS */}
      <rect x={10} y={74} width={100} height={22} fill={skin} />
      <rect x={10} y={88} width={20} height={8}  fill="#9a6030" />
      <rect x={90} y={88} width={20} height={8}  fill="#9a6030" />
      {/* big ears */}
      <rect x={6}  y={50} width={12} height={22} fill={skin} />
      <rect x={102} y={50} width={12} height={22} fill={skin} />
      {/* brows */}
      <rect x={22} y={44} width={28} height={5}  fill="#2c1e10" />
      <rect x={70} y={44} width={28} height={5}  fill="#2c1e10" />
      {/* eyes – warm brown */}
      <rect x={22} y={52} width={26} height={14} fill="white" />
      <rect x={72} y={52} width={26} height={14} fill="white" />
      <rect x={27} y={54} width={16} height={10} fill="#4a2c10" />
      <rect x={77} y={54} width={16} height={10} fill="#4a2c10" />
      <rect x={28} y={55} width={4}  height={3}  fill="white" />
      <rect x={78} y={55} width={4}  height={3}  fill="white" />
      {/* wide nose */}
      <rect x={50} y={64} width={20} height={14} fill="#9a6030" />
      <rect x={44} y={74} width={12} height={5}  fill="#885028" />
      <rect x={64} y={74} width={12} height={5}  fill="#885028" />
      {/* FRIENDLY SMILE – wide, upturned corners */}
      {win
        ? <rect x={32} y={86} width={56} height={6} fill="#cc3020" />
        : <rect x={34} y={86} width={52} height={5} fill="#8a4028" />}
      <rect x={32} y={84} width={4}  height={4}  fill="#b06040" />
      <rect x={84} y={84} width={4}  height={4}  fill="#b06040" />
      {win && <rect x={34} y={87} width={50} height={4} fill="white" />}
      {panic && <rect x={104} y={50} width={4} height={8} fill="#88c8f0" />}
    </g>
  );
}

// ── Larreta ────────────────────────────────────────────────────────────────────
// Ref: NEARLY BALD (buzz-cut shadow), VERY THICK DARK BROWS (key feature), round face, white shirt no tie
function LarretaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c8845a';
  return (
    <g>
      <rect x={0} y={0} width={120} height={140} fill="#dce8dc" />
      {/* charcoal suit */}
      <rect x={14} y={94} width={92} height={50} fill="#282830" />
      <rect x={14} y={94} width={30} height={46} fill="#1e1e28" />
      <rect x={76} y={94} width={30} height={46} fill="#1e1e28" />
      {/* WHITE SHIRT – no tie */}
      <rect x={44} y={94} width={32} height={46} fill="#f0f0f0" />
      <rect x={52} y={94} width={16} height={10} fill="#e8e8e8" />
      {/* neck */}
      <rect x={46} y={78} width={28} height={20} fill={skin} />
      {/* HEAD – round */}
      <rect x={24} y={20} width={72} height={70} fill={skin} />
      <rect x={26} y={78} width={68} height={18} fill={skin} />
      {/* BUZZ-CUT SHADOW – very short dark stubble, bald-like */}
      <rect x={24} y={20} width={72} height={10} fill="#9a6030" />
      <rect x={26} y={20} width={68} height={8}  fill="#3a2818" />
      <rect x={28} y={20} width={64} height={5}  fill={skin} />
      {/* ears */}
      <rect x={20} y={52} width={8}  height={16} fill={skin} />
      <rect x={92} y={52} width={8}  height={16} fill={skin} />
      {/* ── VERY THICK PROMINENT EYEBROWS – h=9, KEY feature ── */}
      <rect x={26} y={44} width={30} height={9}  fill="#1a1008" />
      <rect x={64} y={44} width={30} height={9}  fill="#1a1008" />
      {/* inner arch bump */}
      <rect x={26} y={42} width={8}  height={5}  fill="#1a1008" />
      <rect x={86} y={42} width={8}  height={5}  fill="#1a1008" />
      {/* eyes – brown */}
      <rect x={28} y={54} width={26} height={14} fill="white" />
      <rect x={66} y={54} width={26} height={14} fill="white" />
      <rect x={32} y={56} width={18} height={10} fill="#5a3218" />
      <rect x={70} y={56} width={18} height={10} fill="#5a3218" />
      <rect x={33} y={57} width={4}  height={4}  fill="white" />
      <rect x={71} y={57} width={4}  height={4}  fill="white" />
      {/* bags under eyes */}
      <rect x={28} y={68} width={26} height={4}  fill="#b07040" />
      <rect x={66} y={68} width={26} height={4}  fill="#b07040" />
      {/* nose */}
      <rect x={52} y={68} width={16} height={12} fill="#a86030" />
      <rect x={48} y={76} width={10} height={5}  fill="#906028" />
      <rect x={62} y={76} width={10} height={5}  fill="#906028" />
      {/* mouth */}
      {win
        ? <rect x={40} y={86} width={40} height={5} fill="#cc3020" />
        : <rect x={42} y={86} width={36} height={4} fill="#6a3020" />}
      {win && <rect x={42} y={87} width={36} height={3} fill="white" />}
      {panic && <rect x={92} y={50} width={4} height={8} fill="#88c8f0" />}
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

  const imageUrl = useGameImage('char_' + base);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={'Retrato de ' + id}
        width={px}
        height={px}
        style={{ display: 'block', objectFit: 'cover' }}
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
      aria-label={'Retrato de ' + id}
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
