import type { PortraitMood } from './types.js';

// ── Bullrich ───────────────────────────────────────────────────────────────────
// 200×240 canvas. Flequillo recto, blazer gris, blusa rosa, badge/escudo en solapa.
export default function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#c07848';
  const hair = '#7a4a28';
  const hairD = '#4e2e14';
  return (
    <g>
      {/* ── FONDO: gris-azul gobierno ── */}
      <rect x={0} y={0} width={200} height={240} fill="#2a3040" />
      <rect x={0} y={0} width={200} height={240} fill="#303848" />
      <rect x={0} y={0} width={200} height={4} fill="#383e50" />
      <rect x={0} y={8} width={200} height={2} fill="#383e50" />
      <rect x={0} y={16} width={200} height={2} fill="#383e50" />
      <rect x={0} y={24} width={200} height={2} fill="#383e50" />
      {/* ── CUERPO / BLAZER GRIS ── */}
      <rect x={12} y={168} width={176} height={76} fill="#787878" />
      <rect x={12} y={168} width={56} height={72} fill="#646464" />
      <rect x={132} y={168} width={56} height={72} fill="#646464" />
      <rect x={62} y={168} width={12} height={56} fill="#6e6e6e" />
      <rect x={66} y={168} width={6} height={36} fill="#7a7a7a" />
      <rect x={126} y={168} width={12} height={56} fill="#6e6e6e" />
      <rect x={126} y={168} width={6} height={36} fill="#7a7a7a" />
      {/* blusa rosa */}
      <rect x={74} y={168} width={52} height={76} fill="#e8b8a8" />
      <rect x={82} y={168} width={36} height={16} fill="#f0c8b8" />
      <rect x={88} y={168} width={24} height={10} fill="#f8d8c8" />
      {/* collar de perlas */}
      <rect x={78} y={174} width={4} height={4} fill="#f0ece0" />
      <rect x={84} y={172} width={4} height={4} fill="#f0ece0" />
      <rect x={90} y={170} width={4} height={4} fill="#f0ece0" />
      <rect x={96} y={170} width={4} height={4} fill="#f0ece0" />
      <rect x={102} y={170} width={4} height={4} fill="#f0ece0" />
      <rect x={108} y={170} width={4} height={4} fill="#f0ece0" />
      <rect x={114} y={172} width={4} height={4} fill="#f0ece0" />
      <rect x={120} y={174} width={4} height={4} fill="#f0ece0" />
      {/* ── BADGE / ESCUDO en solapa izquierda ── */}
      <rect x={20} y={180} width={20} height={24} fill="#c89060" />
      <rect x={22} y={182} width={16} height={20} fill="#d8a070" />
      <rect x={24} y={184} width={12} height={6} fill="#74ACDF" />
      <rect x={24} y={192} width={6} height={8} fill="#3060a0" />
      <rect x={30} y={192} width={6} height={8} fill="#e8e8e8" />
      {/* botones blazer */}
      <rect x={58} y={200} width={6} height={6} fill="#505050" />
      <rect x={58} y={214} width={6} height={6} fill="#505050" />
      <rect x={12} y={168} width={6} height={50} fill="#585858" />
      <rect x={182} y={168} width={6} height={50} fill="#585858" />
      {/* ── CUELLO ── */}
      <rect x={78} y={140} width={44} height={32} fill={skin} />
      <rect x={78} y={148} width={8} height={24} fill="#a06030" />
      <rect x={114} y={148} width={8} height={24} fill="#a06030" />
      {/* ── PELO: castaño, flequillo + largo a los lados ── */}
      <rect x={30} y={20} width={140} height={36} fill={hair} />
      <rect x={44} y={22} width={14} height={28} fill="#9a6038" />
      <rect x={88} y={18} width={10} height={30} fill="#9a6038" />
      <rect x={126} y={22} width={12} height={26} fill="#9a6038" />
      {/* FLEQUILLO – recto, cubre frente */}
      <rect x={28} y={44} width={144} height={22} fill={hair} />
      <rect x={30} y={62} width={140} height={6} fill={hairD} />
      <rect x={22} y={46} width={24} height={96} fill={hair} />
      <rect x={154} y={46} width={24} height={96} fill={hair} />
      <rect x={24} y={60} width={12} height={70} fill="#6a3a20" />
      <rect x={164} y={60} width={12} height={70} fill="#6a3a20" />
      {/* ── CABEZA: oval ── */}
      <rect x={32} y={46} width={136} height={106} fill={skin} />
      <rect x={34} y={140} width={132} height={16} fill={skin} />
      <rect x={32} y={100} width={12} height={24} fill="#a06838" />
      <rect x={156} y={100} width={12} height={24} fill="#a06838" />
      <rect x={26} y={96} width={10} height={20} fill={skin} />
      <rect x={164} y={96} width={10} height={20} fill={skin} />
      {/* aretes de perla */}
      <rect x={26} y={106} width={8} height={8} fill="#f0ece0" />
      <rect x={166} y={106} width={8} height={8} fill="#f0ece0" />
      {/* ── CEJAS ── */}
      <rect x={44} y={78} width={34} height={6} fill="#3a1e0a" />
      <rect x={122} y={78} width={34} height={6} fill="#3a1e0a" />
      {/* ── OJOS: castaños cálidos ── */}
      <rect x={44} y={86} width={34} height={20} fill="white" />
      <rect x={49} y={87} width={20} height={18} fill="#4a2810" />
      <rect x={54} y={90} width={12} height={12} fill="#1a0a04" />
      <rect x={54} y={90} width={4} height={4} fill="white" />
      <rect x={44} y={86} width={34} height={4} fill={skin} />
      <rect x={44} y={104} width={34} height={4} fill="#a06030" />
      <rect x={122} y={86} width={34} height={20} fill="white" />
      <rect x={131} y={87} width={20} height={18} fill="#4a2810" />
      <rect x={134} y={90} width={12} height={12} fill="#1a0a04" />
      <rect x={134} y={90} width={4} height={4} fill="white" />
      <rect x={122} y={86} width={34} height={4} fill={skin} />
      <rect x={122} y={104} width={34} height={4} fill="#a06030" />
      {/* ── NARIZ ── */}
      <rect x={92} y={108} width={16} height={20} fill="#a86030" />
      <rect x={88} y={118} width={24} height={8} fill="#906028" />
      <rect x={82} y={124} width={14} height={8} fill="#906028" />
      <rect x={104} y={124} width={14} height={8} fill="#906028" />
      <rect x={84} y={128} width={8} height={4} fill="#703a18" />
      <rect x={108} y={128} width={8} height={4} fill="#703a18" />
      {/* ── BOCA ── */}
      {win ? (
        <rect x={66} y={142} width={68} height={8} fill="#cc4030" />
      ) : panic ? (
        <rect x={70} y={144} width={60} height={6} fill="#9a4838" />
      ) : (
        <rect x={68} y={142} width={64} height={6} fill="#9a4838" />
      )}
      <rect x={68} y={140} width={64} height={4} fill="#e89088" />
      {win && <rect x={68} y={143} width={64} height={4} fill="white" />}
      <rect x={64} y={138} width={8} height={8} fill="#c07868" />
      <rect x={128} y={138} width={8} height={8} fill="#c07868" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={60} y={106} width={8} height={22} fill="#88c8f0" />}
      {panic && <rect x={148} y={106} width={8} height={22} fill="#88c8f0" />}
      {panic && <rect x={62} y={126} width={6} height={10} fill="#aadcf8" />}
      {panic && <rect x={68} y={146} width={6} height={8} fill="#8a3820" />}
      {panic && <rect x={126} y={146} width={6} height={8} fill="#8a3820" />}
    </g>
  );
}
