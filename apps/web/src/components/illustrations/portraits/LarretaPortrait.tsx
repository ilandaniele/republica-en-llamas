import type { PortraitMood } from './types.js';

// ── Larreta ────────────────────────────────────────────────────────────────────
// 200×240 canvas. Casi calvo (buzz-cut), cejas muy gruesas (KEY), cara redonda, camisa sin corbata, obelisco fondo.
export default function LarretaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win = mood === 'victory';
  const skin = '#c8845a';
  return (
    <g>
      {/* ── FONDO: cyan/gris Ciudad de Buenos Aires ── */}
      <rect x={0} y={0} width={200} height={240} fill="#1a2a30" />
      <rect x={0} y={0} width={200} height={240} fill="#1e3038" />
      {/* sky gradient */}
      <rect x={0} y={0} width={200} height={80} fill="#1e3848" />
      {/* ── OBELISCO pixel en fondo ── */}
      <rect x={164} y={20} width={10} height={120} fill="#3a4a50" />
      <rect x={162} y={16} width={14} height={10} fill="#2a3840" />
      <rect x={164} y={18} width={10} height={6} fill="#3a4a50" />
      {/* tope obelisco */}
      <rect x={167} y={12} width={4} height={8} fill="#4a5a62" />
      <rect x={168} y={8} width={2} height={6} fill="#5a6a72" />
      {/* ventanas obelisco */}
      <rect x={166} y={36} width={6} height={8} fill="#2a5860" />
      <rect x={166} y={52} width={6} height={8} fill="#2a5860" />
      <rect x={166} y={68} width={6} height={8} fill="#2a5860" />
      <rect x={166} y={84} width={6} height={8} fill="#2a5860" />
      {/* base obelisco */}
      <rect x={158} y={136} width={22} height={8} fill="#2a3840" />
      {/* ── CUERPO / TRAJE CARBÓN ── */}
      <rect x={12} y={168} width={176} height={76} fill="#282830" />
      {/* solapa izq */}
      <rect x={12} y={168} width={56} height={72} fill="#1e1e28" />
      {/* solapa der */}
      <rect x={132} y={168} width={56} height={72} fill="#1e1e28" />
      {/* diagonal izq */}
      <rect x={62} y={168} width={12} height={54} fill="#222230" />
      <rect x={66} y={168} width={6} height={34} fill="#2c2c3c" />
      {/* diagonal der */}
      <rect x={126} y={168} width={12} height={54} fill="#222230" />
      <rect x={126} y={168} width={6} height={34} fill="#2c2c3c" />
      {/* CAMISA BLANCA – sin corbata ── */}
      <rect x={74} y={168} width={52} height={76} fill="#f0f0f0" />
      {/* cuello camisa */}
      <rect x={84} y={168} width={32} height={16} fill="#e8e8e8" />
      <rect x={90} y={168} width={20} height={10} fill="#f8f8f8" />
      {/* botones camisa */}
      <rect x={97} y={186} width={6} height={6} fill="#c8c8c8" />
      <rect x={97} y={200} width={6} height={6} fill="#c8c8c8" />
      <rect x={97} y={214} width={6} height={6} fill="#c8c8c8" />
      {/* botones traje izq */}
      <rect x={30} y={192} width={8} height={8} fill="#181820" />
      <rect x={30} y={208} width={8} height={8} fill="#181820" />
      {/* bolsillo con pañuelo blanco */}
      <rect x={20} y={176} width={22} height={18} fill="#1a1a24" />
      <rect x={22} y={174} width={10} height={6} fill="#f0f0f0" />
      {/* pliegue hombro */}
      <rect x={12} y={168} width={6} height={52} fill="#101018" />
      <rect x={182} y={168} width={6} height={52} fill="#101018" />
      {/* ── CUELLO ── */}
      <rect x={78} y={138} width={44} height={34} fill={skin} />
      <rect x={78} y={146} width={8} height={26} fill="#a86030" />
      <rect x={114} y={146} width={8} height={26} fill="#a86030" />
      {/* ── CABEZA: redonda ── */}
      <rect x={36} y={30} width={128} height={120} fill={skin} />
      <rect x={38} y={138} width={124} height={18} fill={skin} />
      {/* pómulos */}
      <rect x={36} y={106} width={14} height={28} fill="#b07040" />
      <rect x={150} y={106} width={14} height={28} fill="#b07040" />
      {/* orejas */}
      <rect x={28} y={92} width={12} height={26} fill={skin} />
      <rect x={160} y={92} width={12} height={26} fill={skin} />
      <rect x={30} y={96} width={6} height={16} fill="#a86030" />
      <rect x={164} y={96} width={6} height={16} fill="#a86030" />
      {/* ── BUZZ-CUT: sombra muy corta ── */}
      <rect x={36} y={30} width={128} height={16} fill="#a86030" />
      <rect x={38} y={30} width={124} height={12} fill="#3a2818" />
      <rect x={44} y={30} width={112} height={8} fill={skin} />
      {/* stubble hairline lateral */}
      <rect x={36} y={34} width={12} height={22} fill="#3a2818" />
      <rect x={152} y={34} width={12} height={22} fill="#3a2818" />
      {/* ── CEJAS MUY GRUESAS Y PROMINENTES – KEY FEATURE ── */}
      {/* ceja izq */}
      <rect x={42} y={72} width={52} height={14} fill="#1a1008" />
      {/* arco interior izq */}
      <rect x={42} y={68} width={14} height={8} fill="#1a1008" />
      {/* degradado */}
      <rect x={44} y={74} width={48} height={4} fill="#0e0806" />
      {/* ceja der */}
      <rect x={106} y={72} width={52} height={14} fill="#1a1008" />
      {/* arco interior der */}
      <rect x={144} y={68} width={14} height={8} fill="#1a1008" />
      <rect x={108} y={74} width={48} height={4} fill="#0e0806" />
      {/* ── OJOS: marrón con bolsas ── */}
      {/* esclerótica izq */}
      <rect x={44} y={88} width={46} height={22} fill="white" />
      {/* iris izq */}
      <rect x={52} y={89} width={28} height={20} fill="#5a3218" />
      {/* pupila izq */}
      <rect x={58} y={92} width={18} height={14} fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={58} y={92} width={6} height={6} fill="white" />
      {/* párpado sup izq */}
      <rect x={44} y={88} width={46} height={4} fill={skin} />
      {/* bolsas bajo ojos */}
      <rect x={44} y={108} width={46} height={6} fill="#b07040" />
      <rect x={44} y={112} width={46} height={4} fill="#a06030" />
      {/* esclerótica der */}
      <rect x={110} y={88} width={46} height={22} fill="white" />
      {/* iris der */}
      <rect x={120} y={89} width={28} height={20} fill="#5a3218" />
      {/* pupila der */}
      <rect x={124} y={92} width={18} height={14} fill="#1a0e06" />
      {/* highlight der */}
      <rect x={124} y={92} width={6} height={6} fill="white" />
      <rect x={110} y={88} width={46} height={4} fill={skin} />
      <rect x={110} y={108} width={46} height={6} fill="#b07040" />
      <rect x={110} y={112} width={46} height={4} fill="#a06030" />
      {/* ── NARIZ ── */}
      <rect x={90} y={114} width={20} height={22} fill="#a86030" />
      <rect x={86} y={124} width={28} height={10} fill="#906028" />
      <rect x={80} y={130} width={16} height={8} fill="#906028" />
      <rect x={104} y={130} width={16} height={8} fill="#906028" />
      <rect x={82} y={134} width={10} height={4} fill="#703a18" />
      <rect x={108} y={134} width={10} height={4} fill="#703a18" />
      {/* ── BOCA ── */}
      {win ? (
        <rect x={66} y={148} width={68} height={8} fill="#cc3020" />
      ) : panic ? (
        <rect x={70} y={150} width={60} height={6} fill="#6a3020" />
      ) : (
        <rect x={68} y={148} width={64} height={6} fill="#6a3020" />
      )}
      {win && <rect x={68} y={149} width={64} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={62} y={144} width={8} height={8} fill="#a05030" />
      <rect x={130} y={144} width={8} height={8} fill="#a05030" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={62} y={112} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={138} y={112} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={64} y={136} width={8} height={10} fill="#aadcf8" />}
      {panic && <rect x={70} y={152} width={8} height={8} fill="#8a3820" />}
      {panic && <rect x={122} y={152} width={8} height={8} fill="#8a3820" />}
    </g>
  );
}
