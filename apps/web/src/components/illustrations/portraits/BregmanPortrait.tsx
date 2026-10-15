import type { PortraitMood } from './types.js';

// ── Bregman ────────────────────────────────────────────────────────────────────
// 200×240 canvas. Pelo rubio con highlights, ojos verdes, campera de cuero, pin puño.
export default function BregmanPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#d8a870';
  const hair = '#c8a030';
  const hairH = '#e0c040';
  return (
    <g>
      {/* ── FONDO: rojo profundo ── */}
      <rect x={0} y={0} width={200} height={240} fill="#280808" />
      <rect x={0} y={0} width={200} height={240} fill="#300a0a" />
      {/* patrón sutil */}
      <rect x={0} y={30} width={200} height={2} fill="#380e0e" />
      <rect x={0} y={60} width={200} height={2} fill="#380e0e" />
      <rect x={0} y={90} width={200} height={2} fill="#380e0e" />
      {/* ── CUERPO / CAMPERA DE CUERO NEGRA ── */}
      <rect x={12} y={168} width={176} height={76} fill="#181818" />
      {/* solapa izq */}
      <rect x={12} y={168} width={58} height={72} fill="#0e0e0e" />
      {/* solapa der */}
      <rect x={130} y={168} width={58} height={72} fill="#0e0e0e" />
      {/* diagonal izq */}
      <rect x={64} y={168} width={10} height={52} fill="#141414" />
      <rect x={68} y={168} width={6} height={34} fill="#1e1e1e" />
      {/* diagonal der */}
      <rect x={126} y={168} width={10} height={52} fill="#141414" />
      <rect x={126} y={168} width={6} height={34} fill="#1e1e1e" />
      {/* línea central campera */}
      <rect x={96} y={168} width={8} height={76} fill="#2a2a2a" />
      {/* camisa interior blanca */}
      <rect x={74} y={168} width={52} height={76} fill="#e8e8e8" />
      {/* zipper */}
      <rect x={98} y={172} width={4} height={70} fill="#888888" />
      <rect x={97} y={172} width={6} height={4} fill="#aaaaaa" />
      {/* botón zipper */}
      <rect x={98} y={174} width={4} height={4} fill="#cccccc" />
      {/* pliegues hombro */}
      <rect x={12} y={168} width={6} height={48} fill="#080808" />
      <rect x={182} y={168} width={6} height={48} fill="#080808" />
      {/* ── PIN PUÑO ALZADO en solapa izquierda ── */}
      <rect x={22} y={182} width={16} height={18} fill="#cc2200" />
      <rect x={24} y={180} width={12} height={4} fill="#ee3300" />
      {/* mano pixel */}
      <rect x={26} y={178} width={6} height={4} fill="#d8a870" />
      <rect x={28} y={174} width={4} height={6} fill="#d8a870" />
      {/* botones campera */}
      <rect x={152} y={188} width={6} height={6} fill="#2a2a2a" />
      <rect x={152} y={202} width={6} height={6} fill="#2a2a2a" />
      {/* ── CUELLO ── */}
      <rect x={78} y={140} width={44} height={32} fill={skin} />
      <rect x={78} y={148} width={8} height={24} fill="#b07848" />
      <rect x={114} y={148} width={8} height={24} fill="#b07848" />
      {/* ── PELO RUBIO: mechas, largo ── */}
      {/* masa superior */}
      <rect x={28} y={16} width={144} height={30} fill={hair} />
      {/* highlights superiores */}
      <rect x={38} y={16} width={16} height={24} fill={hairH} />
      <rect x={76} y={14} width={12} height={26} fill={hairH} />
      <rect x={114} y={16} width={14} height={22} fill={hairH} />
      {/* lateral izquierdo – hasta hombros */}
      <rect x={18} y={30} width={22} height={100} fill={hair} />
      <rect x={20} y={44} width={10} height={80} fill={hairH} />
      {/* lateral derecho */}
      <rect x={160} y={30} width={22} height={100} fill={hair} />
      <rect x={170} y={44} width={10} height={80} fill={hairH} />
      {/* pelo sobre frente */}
      <rect x={34} y={40} width={132} height={14} fill={hair} />
      <rect x={36} y={50} width={128} height={6} fill="#a88020" />
      {/* detalles capa pelo */}
      <rect x={24} y={60} width={8} height={60} fill="#a08020" />
      <rect x={168} y={60} width={8} height={60} fill="#a08020" />
      {/* ── CABEZA: slim oval ── */}
      <rect x={36} y={40} width={128} height={112} fill={skin} />
      <rect x={38} y={144} width={124} height={14} fill={skin} />
      {/* pómulos sutiles */}
      <rect x={36} y={100} width={10} height={22} fill="#c09058" />
      <rect x={154} y={100} width={10} height={22} fill="#c09058" />
      {/* orejas */}
      <rect x={30} y={92} width={10} height={18} fill={skin} />
      <rect x={160} y={92} width={10} height={18} fill={skin} />
      {/* ── CEJAS naturales ── */}
      <rect x={46} y={74} width={34} height={6} fill="#6a3a18" />
      <rect x={120} y={74} width={34} height={6} fill="#6a3a18" />
      {/* ── OJOS VERDES ── */}
      {/* esclerótica izq */}
      <rect x={46} y={82} width={36} height={20} fill="white" />
      {/* iris verde izq */}
      <rect x={52} y={83} width={22} height={18} fill="#5a8860" />
      {/* pupila izq */}
      <rect x={58} y={86} width={12} height={12} fill="#1a3020" />
      {/* highlight izq */}
      <rect x={58} y={86} width={4} height={4} fill="white" />
      {/* iris external ring */}
      <rect x={52} y={83} width={22} height={3} fill="#3a6040" />
      {/* párpado sup izq */}
      <rect x={46} y={82} width={36} height={4} fill={skin} />
      {/* sombra inf izq */}
      <rect x={46} y={100} width={36} height={4} fill="#b07848" />
      {/* esclerótica der */}
      <rect x={118} y={82} width={36} height={20} fill="white" />
      {/* iris verde der */}
      <rect x={126} y={83} width={22} height={18} fill="#5a8860" />
      {/* pupila der */}
      <rect x={130} y={86} width={12} height={12} fill="#1a3020" />
      {/* highlight der */}
      <rect x={130} y={86} width={4} height={4} fill="white" />
      <rect x={126} y={83} width={22} height={3} fill="#3a6040" />
      <rect x={118} y={82} width={36} height={4} fill={skin} />
      <rect x={118} y={100} width={36} height={4} fill="#b07848" />
      {/* ── NARIZ ── */}
      <rect x={92} y={106} width={16} height={20} fill="#b87848" />
      <rect x={88} y={116} width={24} height={8} fill="#a06030" />
      <rect x={84} y={120} width={14} height={8} fill="#a06030" />
      <rect x={102} y={120} width={14} height={8} fill="#a06030" />
      <rect x={86} y={124} width={8} height={4} fill="#803818" />
      <rect x={106} y={124} width={8} height={4} fill="#803818" />
      {/* ── BOCA CON SONRISA ── */}
      {win ? (
        <rect x={64} y={138} width={72} height={8} fill="#cc4020" />
      ) : panic ? (
        <rect x={68} y={140} width={64} height={6} fill="#8a4028" />
      ) : (
        <rect x={66} y={138} width={68} height={6} fill="#8a4028" />
      )}
      {win && <rect x={66} y={139} width={68} height={4} fill="white" />}
      {/* comisuras levantadas */}
      <rect x={60} y={132} width={8} height={8} fill="#c87868" />
      <rect x={132} y={132} width={8} height={8} fill="#c87868" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={64} y={102} width={8} height={24} fill="#88c8f0" />}
      {panic && <rect x={140} y={102} width={8} height={24} fill="#88c8f0" />}
      {panic && <rect x={66} y={124} width={6} height={10} fill="#aadcf8" />}
      {panic && <rect x={70} y={142} width={6} height={8} fill="#8a3820" />}
      {panic && <rect x={124} y={142} width={6} height={8} fill="#8a3820" />}
    </g>
  );
}
