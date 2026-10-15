import type { PortraitMood } from './types.js';

// ── Milei ──────────────────────────────────────────────────────────────────────
// 200×240 canvas. Caótico pelo oscuro voluminoso, ojos celeste, motosierra.
export default function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#c8845a';
  const hair = '#2c1a08';
  const hairH = '#3d2510'; // highlight
  return (
    <g>
      {/* ── FONDO: rojo caótico con chispas ── */}
      <rect x={0} y={0} width={200} height={240} fill="#1a0a04" />
      <rect x={0} y={0} width={200} height={240} fill="#2a0c06" />
      {/* chispas/fuego fondo */}
      <rect x={10} y={180} width={6} height={20} fill="#cc3300" />
      <rect x={14} y={172} width={4} height={12} fill="#ff6600" />
      <rect x={180} y={170} width={6} height={22} fill="#cc3300" />
      <rect x={184} y={162} width={4} height={14} fill="#ff6600" />
      <rect x={90} y={185} width={4} height={14} fill="#cc4400" />
      <rect x={110} y={178} width={4} height={18} fill="#ff5500" />
      <rect x={50} y={175} width={4} height={16} fill="#aa2200" />
      <rect x={148} y={168} width={4} height={20} fill="#dd4400" />
      {/* ── CUERPO / TRAJE NAVY ── */}
      <rect x={14} y={168} width={172} height={76} fill="#141428" />
      {/* solapas izquierda */}
      <rect x={14} y={168} width={52} height={72} fill="#1a1a38" />
      {/* solapas derecha */}
      <rect x={134} y={168} width={52} height={72} fill="#1a1a38" />
      {/* solapa izq diagonal simulada */}
      <rect x={60} y={168} width={10} height={50} fill="#1a1a38" />
      <rect x={64} y={168} width={6} height={30} fill="#282848" />
      {/* solapa der diagonal simulada */}
      <rect x={130} y={168} width={10} height={50} fill="#1a1a38" />
      <rect x={130} y={168} width={6} height={30} fill="#282848" />
      {/* camisa celeste */}
      <rect x={70} y={168} width={60} height={72} fill="#4a6fa5" />
      {/* corbata oscura */}
      <rect x={88} y={170} width={24} height={70} fill="#1a2060" />
      <rect x={90} y={170} width={20} height={14} fill="#0e1440" />
      {/* nudo corbata */}
      <rect x={92} y={170} width={16} height={8} fill="#0a1030" />
      {/* botones traje izq */}
      <rect x={34} y={190} width={6} height={6} fill="#2a2a50" />
      <rect x={34} y={204} width={6} height={6} fill="#2a2a50" />
      {/* botones traje der */}
      <rect x={160} y={190} width={6} height={6} fill="#2a2a50" />
      {/* bolsillo con pañuelo */}
      <rect x={22} y={176} width={20} height={14} fill="#1e1e3c" />
      <rect x={24} y={174} width={8} height={6} fill="#4a6fa5" />
      {/* pliegue hombro izq */}
      <rect x={14} y={168} width={4} height={40} fill="#0e0e20" />
      {/* pliegue hombro der */}
      <rect x={182} y={168} width={4} height={40} fill="#0e0e20" />
      {/* CUELLO */}
      <rect x={76} y={140} width={48} height={34} fill={skin} />
      {/* sombra cuello */}
      <rect x={76} y={148} width={8} height={26} fill="#a06030" />
      <rect x={116} y={148} width={8} height={26} fill="#a06030" />
      {/* ── MOTOSIERRA (accesorio, mano derecha baja) ── */}
      <rect x={146} y={196} width={40} height={14} fill="#e8a020" />
      <rect x={146} y={192} width={40} height={6} fill="#b07010" />
      {/* mango */}
      <rect x={144} y={192} width={12} height={22} fill="#6a3a10" />
      <rect x={146} y={194} width={8} height={18} fill="#8a5020" />
      {/* dientes sierra */}
      <rect x={148} y={210} width={4} height={8} fill="#c0c0c0" />
      <rect x={154} y={210} width={4} height={8} fill="#c0c0c0" />
      <rect x={160} y={210} width={4} height={8} fill="#c0c0c0" />
      <rect x={166} y={210} width={4} height={8} fill="#c0c0c0" />
      <rect x={172} y={210} width={4} height={8} fill="#c0c0c0" />
      <rect x={178} y={210} width={4} height={8} fill="#c0c0c0" />
      {/* motor */}
      <rect x={186} y={194} width={14} height={18} fill="#4a4a4a" />
      <rect x={188} y={196} width={10} height={12} fill="#2a2a2a" />
      {/* ── PELO: muy voluminoso, caótico, oscuro ── */}
      {/* masa principal */}
      <rect x={26} y={16} width={148} height={76} fill={hair} />
      {/* spikes irregulares en lo alto */}
      <rect x={28} y={4} width={18} height={22} fill={hair} />
      <rect x={44} y={0} width={16} height={18} fill={hair} />
      <rect x={58} y={-4} width={20} height={24} fill={hair} />
      <rect x={76} y={2} width={22} height={18} fill={hair} />
      <rect x={96} y={-2} width={20} height={22} fill={hair} />
      <rect x={114} y={4} width={18} height={18} fill={hair} />
      <rect x={130} y={0} width={16} height={20} fill={hair} />
      <rect x={144} y={6} width={14} height={16} fill={hair} />
      {/* volumen lateral izquierdo – cae hasta hombros */}
      <rect x={10} y={46} width={34} height={110} fill={hair} />
      <rect x={6} y={72} width={18} height={80} fill={hair} />
      <rect x={2} y={100} width={12} height={50} fill={hair} />
      {/* volumen lateral derecho */}
      <rect x={156} y={46} width={34} height={110} fill={hair} />
      <rect x={176} y={72} width={18} height={80} fill={hair} />
      <rect x={186} y={100} width={12} height={50} fill={hair} />
      {/* highlights pelo */}
      <rect x={50} y={10} width={10} height={60} fill={hairH} />
      <rect x={100} y={6} width={8} height={50} fill={hairH} />
      <rect x={130} y={12} width={8} height={40} fill={hairH} />
      <rect x={18} y={60} width={6} height={50} fill={hairH} />
      <rect x={166} y={58} width={6} height={50} fill={hairH} />
      {/* ── CABEZA – cara angosta y larga ── */}
      <rect x={50} y={46} width={100} height={112} fill={skin} />
      <rect x={52} y={140} width={96} height={18} fill={skin} />
      {/* pómulos / sombra lateral */}
      <rect x={50} y={86} width={10} height={30} fill="#a86030" />
      <rect x={140} y={86} width={10} height={30} fill="#a86030" />
      {/* orejas */}
      <rect x={42} y={96} width={12} height={24} fill={skin} />
      <rect x={144} y={96} width={12} height={24} fill={skin} />
      <rect x={44} y={100} width={6} height={14} fill="#a86030" />
      <rect x={148} y={100} width={6} height={14} fill="#a86030" />
      {/* ── CEJAS – gruesas y oscuras ── */}
      <rect x={54} y={76} width={38} height={8} fill={hair} />
      <rect x={54} y={80} width={14} height={4} fill={hair} />
      <rect x={108} y={76} width={38} height={8} fill={hair} />
      <rect x={134} y={80} width={14} height={4} fill={hair} />
      {/* ── OJOS CELESTE (rasgo distintivo) ── */}
      {/* esclerótica izq */}
      <rect x={56} y={86} width={34} height={22} fill="white" />
      {/* iris celeste izq */}
      <rect x={62} y={87} width={18} height={20} fill="#74ACDF" />
      {/* pupila izq */}
      <rect x={68} y={90} width={10} height={14} fill="#1a1a38" />
      {/* highlight izq */}
      <rect x={68} y={90} width={4} height={4} fill="white" />
      {/* párpado superior izq */}
      <rect x={56} y={86} width={34} height={4} fill={skin} />
      {/* sombra inferior izq */}
      <rect x={56} y={106} width={34} height={4} fill="#b07040" />
      {/* esclerótica der */}
      <rect x={110} y={86} width={34} height={22} fill="white" />
      {/* iris celeste der */}
      <rect x={116} y={87} width={18} height={20} fill="#74ACDF" />
      {/* pupila der */}
      <rect x={122} y={90} width={10} height={14} fill="#1a1a38" />
      {/* highlight der */}
      <rect x={122} y={90} width={4} height={4} fill="white" />
      {/* párpado superior der */}
      <rect x={110} y={86} width={34} height={4} fill={skin} />
      {/* sombra inferior der */}
      <rect x={110} y={106} width={34} height={4} fill="#b07040" />
      {/* ── NARIZ – larga y angosta ── */}
      {/* puente */}
      <rect x={94} y={110} width={12} height={22} fill="#a86838" />
      {/* dorso */}
      <rect x={92} y={120} width={16} height={6} fill="#946030" />
      {/* aleta izq */}
      <rect x={84} y={128} width={12} height={8} fill="#906030" />
      {/* aleta der */}
      <rect x={104} y={128} width={12} height={8} fill="#906030" />
      {/* fosas nasales */}
      <rect x={86} y={132} width={6} height={4} fill="#7a4020" />
      <rect x={108} y={132} width={6} height={4} fill="#7a4020" />
      {/* ── BOCA ── */}
      {win ? (
        <rect x={68} y={148} width={64} height={8} fill="#cc3020" />
      ) : panic ? (
        <rect x={72} y={150} width={56} height={6} fill="#7a3020" />
      ) : (
        <rect x={72} y={148} width={56} height={6} fill="#7a3020" />
      )}
      {win && <rect x={70} y={148} width={60} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={68} y={146} width={6} height={6} fill="#a05030" />
      <rect x={126} y={146} width={6} height={6} fill="#a05030" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={74} y={108} width={6} height={16} fill="#88c8f0" />}
      {panic && <rect x={130} y={108} width={6} height={16} fill="#88c8f0" />}
      {panic && <rect x={76} y={122} width={4} height={8} fill="#aadcf8" />}
      {/* boca caída en pánico */}
      {panic && <rect x={74} y={152} width={4} height={6} fill="#8a3820" />}
      {panic && <rect x={122} y={152} width={4} height={6} fill="#8a3820" />}
    </g>
  );
}
