import type { PortraitMood } from './types.js';

// ── Massa ──────────────────────────────────────────────────────────────────────
// 200×240 canvas. Cara cuadrada ancha, cejas caídas, papada, carpeta en mano.
export default function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#b07848';
  const hair = '#5a4a38';
  return (
    <g>
      {/* ── FONDO: azul PJ oscuro ── */}
      <rect x={0} y={0} width={200} height={240} fill="#0a1428" />
      <rect x={0} y={0} width={200} height={240} fill="#0e1c36" />
      {/* detalle fondo: líneas sutiles */}
      <rect x={0} y={60} width={200} height={2} fill="#101e38" />
      <rect x={0} y={120} width={200} height={2} fill="#101e38" />
      <rect x={0} y={180} width={200} height={2} fill="#101e38" />
      {/* ── CUERPO / TRAJE NAVY OSCURO ── */}
      <rect x={10} y={166} width={180} height={78} fill="#242438" />
      {/* solapa izquierda */}
      <rect x={10} y={166} width={58} height={74} fill="#1a1a2e" />
      {/* solapa derecha */}
      <rect x={132} y={166} width={58} height={74} fill="#1a1a2e" />
      {/* diagonal solapa izq */}
      <rect x={62} y={166} width={12} height={54} fill="#202038" />
      <rect x={66} y={166} width={6} height={34} fill="#2a2a48" />
      {/* diagonal solapa der */}
      <rect x={126} y={166} width={12} height={54} fill="#202038" />
      <rect x={126} y={166} width={6} height={34} fill="#2a2a48" />
      {/* camisa blanca */}
      <rect x={74} y={166} width={52} height={78} fill="#e8e8e8" />
      {/* corbata azul */}
      <rect x={86} y={168} width={28} height={72} fill="#3a5a8a" />
      <rect x={88} y={168} width={24} height={16} fill="#2a4070" />
      <rect x={90} y={168} width={20} height={10} fill="#1e3060" />
      {/* botones camisa */}
      <rect x={98} y={192} width={4} height={4} fill="#c0c0c0" />
      <rect x={98} y={204} width={4} height={4} fill="#c0c0c0" />
      <rect x={98} y={216} width={4} height={4} fill="#c0c0c0" />
      {/* bolsillo con pañuelo */}
      <rect x={18} y={174} width={24} height={18} fill="#1e1e3c" />
      <rect x={20} y={172} width={12} height={8} fill="#3a5a8a" />
      {/* pliegues hombro */}
      <rect x={10} y={166} width={6} height={48} fill="#121220" />
      <rect x={184} y={166} width={6} height={48} fill="#121220" />
      {/* ── CARPETA EN MANO DERECHA (accesorio) ── */}
      <rect x={148} y={194} width={42} height={54} fill="#e8d090" />
      <rect x={150} y={196} width={38} height={50} fill="#f0d898" />
      {/* lomo carpeta */}
      <rect x={148} y={194} width={8} height={54} fill="#c8a840" />
      {/* líneas hojas */}
      <rect x={156} y={202} width={28} height={2} fill="#a09060" />
      <rect x={156} y={210} width={28} height={2} fill="#a09060" />
      <rect x={156} y={218} width={28} height={2} fill="#a09060" />
      <rect x={156} y={226} width={22} height={2} fill="#a09060" />
      {/* clip carpeta */}
      <rect x={162} y={194} width={14} height={6} fill="#888050" />
      {/* ── CUELLO GRUESO ── */}
      <rect x={66} y={136} width={68} height={36} fill={skin} />
      <rect x={66} y={144} width={12} height={28} fill="#906030" />
      <rect x={122} y={144} width={12} height={28} fill="#906030" />
      {/* ── PELO: corto gris-marrón, plano arriba ── */}
      <rect x={26} y={30} width={148} height={28} fill={hair} />
      {/* degradado pelo */}
      <rect x={30} y={26} width={140} height={10} fill="#4a3c2c" />
      {/* laterales */}
      <rect x={20} y={44} width={18} height={30} fill={hair} />
      <rect x={162} y={44} width={18} height={30} fill={hair} />
      {/* patillas */}
      <rect x={22} y={68} width={10} height={20} fill={hair} />
      <rect x={168} y={68} width={10} height={20} fill={hair} />
      {/* ── CABEZA: muy ancha y cuadrada ── */}
      <rect x={22} y={44} width={156} height={100} fill={skin} />
      {/* PAPADA / mandíbula ancha */}
      <rect x={20} y={124} width={160} height={36} fill={skin} />
      <rect x={18} y={140} width={34} height={14} fill="#9a6838" />
      <rect x={148} y={140} width={34} height={14} fill="#9a6838" />
      {/* pómulos prominentes */}
      <rect x={22} y={86} width={16} height={26} fill="#9a7040" />
      <rect x={162} y={86} width={16} height={26} fill="#9a7040" />
      {/* orejas grandes */}
      <rect x={14} y={88} width={14} height={28} fill={skin} />
      <rect x={172} y={88} width={14} height={28} fill={skin} />
      <rect x={16} y={92} width={6} height={18} fill="#9a7040" />
      <rect x={178} y={92} width={6} height={18} fill="#9a7040" />
      {/* ── CEJAS: caídas en las puntas externas ── */}
      {/* izq: interior más alto, exterior más bajo */}
      <rect x={32} y={76} width={26} height={8} fill="#2c1e10" />
      <rect x={54} y={80} width={16} height={8} fill="#2c1e10" />
      {/* der: espejado */}
      <rect x={118} y={76} width={26} height={8} fill="#2c1e10" />
      <rect x={142} y={80} width={16} height={8} fill="#2c1e10" />
      {/* ── OJOS: oscuros, con párpado caído (hooded) ── */}
      {/* esclerótica izq */}
      <rect x={34} y={88} width={38} height={22} fill="white" />
      {/* párpado superior pesado izq */}
      <rect x={34} y={88} width={38} height={8} fill={skin} />
      {/* iris oscuro izq */}
      <rect x={40} y={93} width={22} height={16} fill="#3a2410" />
      {/* pupila izq */}
      <rect x={46} y={96} width={12} height={10} fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={46} y={96} width={4} height={4} fill="white" />
      {/* sombra inferior oj izq */}
      <rect x={34} y={108} width={38} height={4} fill="#906030" />
      {/* esclerótica der */}
      <rect x={128} y={88} width={38} height={22} fill="white" />
      {/* párpado der */}
      <rect x={128} y={88} width={38} height={8} fill={skin} />
      {/* iris der */}
      <rect x={138} y={93} width={22} height={16} fill="#3a2410" />
      {/* pupila der */}
      <rect x={142} y={96} width={12} height={10} fill="#1a0e06" />
      {/* highlight der */}
      <rect x={142} y={96} width={4} height={4} fill="white" />
      {/* sombra inferior oj der */}
      <rect x={128} y={108} width={38} height={4} fill="#906030" />
      {/* ── NARIZ ANCHA ── */}
      {/* puente */}
      <rect x={92} y={110} width={16} height={22} fill="#9a6030" />
      {/* dorso nariz */}
      <rect x={88} y={120} width={24} height={8} fill="#885028" />
      {/* aleta izq */}
      <rect x={78} y={126} width={16} height={10} fill="#885028" />
      {/* aleta der */}
      <rect x={106} y={126} width={16} height={10} fill="#885028" />
      {/* fosas */}
      <rect x={80} y={130} width={8} height={6} fill="#6a3818" />
      <rect x={112} y={130} width={8} height={6} fill="#6a3818" />
      {/* ── BOCA ── */}
      {win ? (
        <rect x={60} y={148} width={80} height={8} fill="#cc3020" />
      ) : panic ? (
        <rect x={66} y={150} width={68} height={6} fill="#6a2810" />
      ) : (
        <rect x={64} y={148} width={72} height={6} fill="#6a2810" />
      )}
      {win && <rect x={62} y={148} width={76} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={60} y={144} width={8} height={8} fill="#9a5830" />
      <rect x={132} y={144} width={8} height={8} fill="#9a5830" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={52} y={110} width={8} height={22} fill="#88c8f0" />}
      {panic && <rect x={154} y={110} width={8} height={22} fill="#88c8f0" />}
      {panic && <rect x={54} y={130} width={6} height={10} fill="#aadcf8" />}
      {panic && <rect x={62} y={152} width={6} height={8} fill="#8a3820" />}
      {panic && <rect x={132} y={152} width={6} height={8} fill="#8a3820" />}
    </g>
  );
}
