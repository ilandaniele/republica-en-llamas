import type { PortraitMood } from './types.js';

// ── Schiaretti ─────────────────────────────────────────────────────────────────
// 200×240 canvas. Cara muy ancha y redonda, pelo blanco-gris, traje azul, mate en mano.
export default function SchiarettiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#b87848';
  const hair = '#c0b8a8';
  return (
    <g>
      {/* ── FONDO: ocre cálido cordobés ── */}
      <rect x={0} y={0} width={200} height={240} fill="#2a1e0a" />
      <rect x={0} y={0} width={200} height={240} fill="#332410" />
      {/* detalles cálidos */}
      <rect x={0} y={40} width={200} height={2} fill="#3c2a12" />
      <rect x={0} y={80} width={200} height={2} fill="#3c2a12" />
      <rect x={0} y={120} width={200} height={2} fill="#3c2a12" />
      {/* ── CUERPO / TRAJE AZUL ── */}
      <rect x={6} y={164} width={188} height={80} fill="#3a5a8a" />
      {/* solapa izq */}
      <rect x={6} y={164} width={60} height={76} fill="#2c4870" />
      {/* solapa der */}
      <rect x={134} y={164} width={60} height={76} fill="#2c4870" />
      {/* diagonal izq */}
      <rect x={60} y={164} width={14} height={58} fill="#324e78" />
      <rect x={66} y={164} width={8} height={38} fill="#3a5a8a" />
      {/* diagonal der */}
      <rect x={126} y={164} width={14} height={58} fill="#324e78" />
      <rect x={126} y={164} width={8} height={38} fill="#3a5a8a" />
      {/* camisa blanca */}
      <rect x={74} y={164} width={52} height={80} fill="#f0f0f0" />
      {/* corbata azul oscura */}
      <rect x={86} y={166} width={28} height={76} fill="#1a3060" />
      <rect x={88} y={166} width={24} height={18} fill="#0e1e40" />
      <rect x={90} y={166} width={20} height={10} fill="#0a1830" />
      {/* botones traje */}
      <rect x={30} y={188} width={8} height={8} fill="#243c60" />
      <rect x={30} y={204} width={8} height={8} fill="#243c60" />
      {/* bolsillo */}
      <rect x={16} y={172} width={26} height={20} fill="#263e68" />
      <rect x={18} y={170} width={12} height={8} fill="#3a5a8a" />
      {/* pliegues hombro */}
      <rect x={6} y={164} width={8} height={54} fill="#202e50" />
      <rect x={186} y={164} width={8} height={54} fill="#202e50" />
      {/* ── MATE EN MANO IZQUIERDA (accesorio) ── */}
      <rect x={4} y={196} width={28} height={36} fill="#4a2a10" />
      <rect x={6} y={198} width={24} height={32} fill="#5a3418" />
      {/* boca porrón mate */}
      <rect x={10} y={196} width={16} height={8} fill="#2a1408" />
      {/* bombilla */}
      <rect x={16} y={180} width={4} height={22} fill="#a8a060" />
      <rect x={15} y={178} width={6} height={4} fill="#c0b870" />
      {/* yerba */}
      <rect x={8} y={204} width={20} height={6} fill="#5a7830" />
      <rect x={10} y={208} width={16} height={4} fill="#486428" />
      {/* ── CUELLO GRUESO ── */}
      <rect x={68} y={132} width={64} height={36} fill={skin} />
      <rect x={68} y={140} width={10} height={28} fill="#986030" />
      <rect x={122} y={140} width={10} height={28} fill="#986030" />
      {/* ── PELO BLANCO-GRIS con cobertura ── */}
      <rect x={18} y={26} width={164} height={28} fill={hair} />
      <rect x={20} y={22} width={160} height={12} fill="#9a9080" />
      {/* laterales */}
      <rect x={12} y={44} width={18} height={32} fill={hair} />
      <rect x={170} y={44} width={18} height={32} fill={hair} />
      {/* patillas */}
      <rect x={14} y={66} width={12} height={24} fill={hair} />
      <rect x={174} y={66} width={12} height={24} fill={hair} />
      {/* ── CABEZA MUY ANCHA Y REDONDA ── */}
      <rect x={10} y={44} width={180} height={100} fill={skin} />
      {/* PAPADA y jowls */}
      <rect x={8} y={120} width={184} height={40} fill={skin} />
      <rect x={8} y={148} width={36} height={16} fill="#9a6838" />
      <rect x={156} y={148} width={36} height={16} fill="#9a6838" />
      {/* mejillas muy prominentes */}
      <rect x={10} y={96} width={20} height={34} fill="#c08848" />
      <rect x={170} y={96} width={20} height={34} fill="#c08848" />
      {/* orejas grandes */}
      <rect x={4} y={86} width={16} height={30} fill={skin} />
      <rect x={180} y={86} width={16} height={30} fill={skin} />
      <rect x={6} y={90} width={8} height={20} fill="#9a7040" />
      <rect x={186} y={90} width={8} height={20} fill="#9a7040" />
      {/* ── CEJAS oscuras ── */}
      <rect x={22} y={72} width={46} height={8} fill="#2c1e10" />
      <rect x={132} y={72} width={46} height={8} fill="#2c1e10" />
      {/* ── OJOS: marrón cálido ── */}
      {/* esclerótica izq */}
      <rect x={24} y={82} width={44} height={22} fill="white" />
      {/* iris izq */}
      <rect x={30} y={83} width={26} height={20} fill="#4a2c10" />
      {/* pupila izq */}
      <rect x={36} y={86} width={16} height={14} fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={36} y={86} width={6} height={6} fill="white" />
      {/* párpado sup izq */}
      <rect x={24} y={82} width={44} height={4} fill={skin} />
      {/* sombra inf izq */}
      <rect x={24} y={102} width={44} height={4} fill="#9a7040" />
      {/* esclerótica der */}
      <rect x={132} y={82} width={44} height={22} fill="white" />
      {/* iris der */}
      <rect x={144} y={83} width={26} height={20} fill="#4a2c10" />
      {/* pupila der */}
      <rect x={148} y={86} width={16} height={14} fill="#1a0e06" />
      {/* highlight der */}
      <rect x={148} y={86} width={6} height={6} fill="white" />
      <rect x={132} y={82} width={44} height={4} fill={skin} />
      <rect x={132} y={102} width={44} height={4} fill="#9a7040" />
      {/* ── NARIZ ANCHA ── */}
      <rect x={90} y={104} width={20} height={24} fill="#9a6030" />
      <rect x={84} y={116} width={32} height={10} fill="#885028" />
      <rect x={76} y={122} width={18} height={10} fill="#885028" />
      <rect x={106} y={122} width={18} height={10} fill="#885028" />
      <rect x={78} y={126} width={10} height={6} fill="#6a3818" />
      <rect x={112} y={126} width={10} height={6} fill="#6a3818" />
      {/* ── BOCA CON SONRISA AMPLIA ── */}
      {win ? (
        <rect x={54} y={142} width={92} height={10} fill="#cc3020" />
      ) : panic ? (
        <rect x={60} y={144} width={80} height={8} fill="#8a4028" />
      ) : (
        <rect x={58} y={142} width={84} height={8} fill="#8a4028" />
      )}
      {win && <rect x={56} y={142} width={88} height={5} fill="white" />}
      {/* comisuras levantadas – sonrisa amistosa */}
      <rect x={50} y={136} width={10} height={10} fill="#b06040" />
      <rect x={140} y={136} width={10} height={10} fill="#b06040" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={56} y={104} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={152} y={104} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={58} y={128} width={8} height={12} fill="#aadcf8" />}
      {panic && <rect x={62} y={146} width={8} height={10} fill="#8a3820" />}
      {panic && <rect x={130} y={146} width={8} height={10} fill="#8a3820" />}
    </g>
  );
}
