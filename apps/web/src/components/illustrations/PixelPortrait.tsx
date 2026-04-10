import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export type PortraitId = 'milei' | 'massa' | 'bullrich' | 'bregman' | 'schiaretti' | 'larreta' | 'ingeniero' | 'populista' | 'tecnocrata' | 'izquierda' | 'federal' | 'corporativo';
export type PortraitMood = 'neutral' | 'panic' | 'victory';

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

// ── Milei ──────────────────────────────────────────────────────────────────────
// 200×240 canvas. Caótico pelo oscuro voluminoso, ojos celeste, motosierra.
function MileiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c8845a';
  const hair  = '#2c1a08';
  const hairH = '#3d2510'; // highlight
  return (
    <g>
      {/* ── FONDO: rojo caótico con chispas ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#1a0a04" />
      <rect x={0}   y={0}   width={200} height={240} fill="#2a0c06" />
      {/* chispas/fuego fondo */}
      <rect x={10}  y={180} width={6}   height={20}  fill="#cc3300" />
      <rect x={14}  y={172} width={4}   height={12}  fill="#ff6600" />
      <rect x={180} y={170} width={6}   height={22}  fill="#cc3300" />
      <rect x={184} y={162} width={4}   height={14}  fill="#ff6600" />
      <rect x={90}  y={185} width={4}   height={14}  fill="#cc4400" />
      <rect x={110} y={178} width={4}   height={18}  fill="#ff5500" />
      <rect x={50}  y={175} width={4}   height={16}  fill="#aa2200" />
      <rect x={148} y={168} width={4}   height={20}  fill="#dd4400" />
      {/* ── CUERPO / TRAJE NAVY ── */}
      <rect x={14}  y={168} width={172} height={76}  fill="#141428" />
      {/* solapas izquierda */}
      <rect x={14}  y={168} width={52}  height={72}  fill="#1a1a38" />
      {/* solapas derecha */}
      <rect x={134} y={168} width={52}  height={72}  fill="#1a1a38" />
      {/* solapa izq diagonal simulada */}
      <rect x={60}  y={168} width={10}  height={50}  fill="#1a1a38" />
      <rect x={64}  y={168} width={6}   height={30}  fill="#282848" />
      {/* solapa der diagonal simulada */}
      <rect x={130} y={168} width={10}  height={50}  fill="#1a1a38" />
      <rect x={130} y={168} width={6}   height={30}  fill="#282848" />
      {/* camisa celeste */}
      <rect x={70}  y={168} width={60}  height={72}  fill="#4a6fa5" />
      {/* corbata oscura */}
      <rect x={88}  y={170} width={24}  height={70}  fill="#1a2060" />
      <rect x={90}  y={170} width={20}  height={14}  fill="#0e1440" />
      {/* nudo corbata */}
      <rect x={92}  y={170} width={16}  height={8}   fill="#0a1030" />
      {/* botones traje izq */}
      <rect x={34}  y={190} width={6}   height={6}   fill="#2a2a50" />
      <rect x={34}  y={204} width={6}   height={6}   fill="#2a2a50" />
      {/* botones traje der */}
      <rect x={160} y={190} width={6}   height={6}   fill="#2a2a50" />
      {/* bolsillo con pañuelo */}
      <rect x={22}  y={176} width={20}  height={14}  fill="#1e1e3c" />
      <rect x={24}  y={174} width={8}   height={6}   fill="#4a6fa5" />
      {/* pliegue hombro izq */}
      <rect x={14}  y={168} width={4}   height={40}  fill="#0e0e20" />
      {/* pliegue hombro der */}
      <rect x={182} y={168} width={4}   height={40}  fill="#0e0e20" />
      {/* CUELLO */}
      <rect x={76}  y={140} width={48}  height={34}  fill={skin} />
      {/* sombra cuello */}
      <rect x={76}  y={148} width={8}   height={26}  fill="#a06030" />
      <rect x={116} y={148} width={8}   height={26}  fill="#a06030" />
      {/* ── MOTOSIERRA (accesorio, mano derecha baja) ── */}
      <rect x={146} y={196} width={40}  height={14}  fill="#e8a020" />
      <rect x={146} y={192} width={40}  height={6}   fill="#b07010" />
      {/* mango */}
      <rect x={144} y={192} width={12}  height={22}  fill="#6a3a10" />
      <rect x={146} y={194} width={8}   height={18}  fill="#8a5020" />
      {/* dientes sierra */}
      <rect x={148} y={210} width={4}   height={8}   fill="#c0c0c0" />
      <rect x={154} y={210} width={4}   height={8}   fill="#c0c0c0" />
      <rect x={160} y={210} width={4}   height={8}   fill="#c0c0c0" />
      <rect x={166} y={210} width={4}   height={8}   fill="#c0c0c0" />
      <rect x={172} y={210} width={4}   height={8}   fill="#c0c0c0" />
      <rect x={178} y={210} width={4}   height={8}   fill="#c0c0c0" />
      {/* motor */}
      <rect x={186} y={194} width={14}  height={18}  fill="#4a4a4a" />
      <rect x={188} y={196} width={10}  height={12}  fill="#2a2a2a" />
      {/* ── PELO: muy voluminoso, caótico, oscuro ── */}
      {/* masa principal */}
      <rect x={26}  y={16}  width={148} height={76}  fill={hair} />
      {/* spikes irregulares en lo alto */}
      <rect x={28}  y={4}   width={18}  height={22}  fill={hair} />
      <rect x={44}  y={0}   width={16}  height={18}  fill={hair} />
      <rect x={58}  y={-4}  width={20}  height={24}  fill={hair} />
      <rect x={76}  y={2}   width={22}  height={18}  fill={hair} />
      <rect x={96}  y={-2}  width={20}  height={22}  fill={hair} />
      <rect x={114} y={4}   width={18}  height={18}  fill={hair} />
      <rect x={130} y={0}   width={16}  height={20}  fill={hair} />
      <rect x={144} y={6}   width={14}  height={16}  fill={hair} />
      {/* volumen lateral izquierdo – cae hasta hombros */}
      <rect x={10}  y={46}  width={34}  height={110} fill={hair} />
      <rect x={6}   y={72}  width={18}  height={80}  fill={hair} />
      <rect x={2}   y={100} width={12}  height={50}  fill={hair} />
      {/* volumen lateral derecho */}
      <rect x={156} y={46}  width={34}  height={110} fill={hair} />
      <rect x={176} y={72}  width={18}  height={80}  fill={hair} />
      <rect x={186} y={100} width={12}  height={50}  fill={hair} />
      {/* highlights pelo */}
      <rect x={50}  y={10}  width={10}  height={60}  fill={hairH} />
      <rect x={100} y={6}   width={8}   height={50}  fill={hairH} />
      <rect x={130} y={12}  width={8}   height={40}  fill={hairH} />
      <rect x={18}  y={60}  width={6}   height={50}  fill={hairH} />
      <rect x={166} y={58}  width={6}   height={50}  fill={hairH} />
      {/* ── CABEZA – cara angosta y larga ── */}
      <rect x={50}  y={46}  width={100} height={112} fill={skin} />
      <rect x={52}  y={140} width={96}  height={18}  fill={skin} />
      {/* pómulos / sombra lateral */}
      <rect x={50}  y={86}  width={10}  height={30}  fill="#a86030" />
      <rect x={140} y={86}  width={10}  height={30}  fill="#a86030" />
      {/* orejas */}
      <rect x={42}  y={96}  width={12}  height={24}  fill={skin} />
      <rect x={144} y={96}  width={12}  height={24}  fill={skin} />
      <rect x={44}  y={100} width={6}   height={14}  fill="#a86030" />
      <rect x={148} y={100} width={6}   height={14}  fill="#a86030" />
      {/* ── CEJAS – gruesas y oscuras ── */}
      <rect x={54}  y={76}  width={38}  height={8}   fill={hair} />
      <rect x={54}  y={80}  width={14}  height={4}   fill={hair} />
      <rect x={108} y={76}  width={38}  height={8}   fill={hair} />
      <rect x={134} y={80}  width={14}  height={4}   fill={hair} />
      {/* ── OJOS CELESTE (rasgo distintivo) ── */}
      {/* esclerótica izq */}
      <rect x={56}  y={86}  width={34}  height={22}  fill="white" />
      {/* iris celeste izq */}
      <rect x={62}  y={87}  width={18}  height={20}  fill="#74ACDF" />
      {/* pupila izq */}
      <rect x={68}  y={90}  width={10}  height={14}  fill="#1a1a38" />
      {/* highlight izq */}
      <rect x={68}  y={90}  width={4}   height={4}   fill="white" />
      {/* párpado superior izq */}
      <rect x={56}  y={86}  width={34}  height={4}   fill={skin} />
      {/* sombra inferior izq */}
      <rect x={56}  y={106} width={34}  height={4}   fill="#b07040" />
      {/* esclerótica der */}
      <rect x={110} y={86}  width={34}  height={22}  fill="white" />
      {/* iris celeste der */}
      <rect x={116} y={87}  width={18}  height={20}  fill="#74ACDF" />
      {/* pupila der */}
      <rect x={122} y={90}  width={10}  height={14}  fill="#1a1a38" />
      {/* highlight der */}
      <rect x={122} y={90}  width={4}   height={4}   fill="white" />
      {/* párpado superior der */}
      <rect x={110} y={86}  width={34}  height={4}   fill={skin} />
      {/* sombra inferior der */}
      <rect x={110} y={106} width={34}  height={4}   fill="#b07040" />
      {/* ── NARIZ – larga y angosta ── */}
      {/* puente */}
      <rect x={94}  y={110} width={12}  height={22}  fill="#a86838" />
      {/* dorso */}
      <rect x={92}  y={120} width={16}  height={6}   fill="#946030" />
      {/* aleta izq */}
      <rect x={84}  y={128} width={12}  height={8}   fill="#906030" />
      {/* aleta der */}
      <rect x={104} y={128} width={12}  height={8}   fill="#906030" />
      {/* fosas nasales */}
      <rect x={86}  y={132} width={6}   height={4}   fill="#7a4020" />
      <rect x={108} y={132} width={6}   height={4}   fill="#7a4020" />
      {/* ── BOCA ── */}
      {win
        ? <rect x={68} y={148} width={64} height={8}  fill="#cc3020" />
        : panic
        ? <rect x={72} y={150} width={56} height={6}  fill="#7a3020" />
        : <rect x={72} y={148} width={56} height={6}  fill="#7a3020" />}
      {win && <rect x={70}  y={148} width={60} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={68}  y={146} width={6}   height={6}   fill="#a05030" />
      <rect x={126} y={146} width={6}   height={6}   fill="#a05030" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={74}  y={108} width={6}  height={16} fill="#88c8f0" />}
      {panic && <rect x={130} y={108} width={6}  height={16} fill="#88c8f0" />}
      {panic && <rect x={76}  y={122} width={4}  height={8}  fill="#aadcf8" />}
      {/* boca caída en pánico */}
      {panic && <rect x={74}  y={152} width={4}  height={6}  fill="#8a3820" />}
      {panic && <rect x={122} y={152} width={4}  height={6}  fill="#8a3820" />}
    </g>
  );
}

// ── Massa ──────────────────────────────────────────────────────────────────────
// 200×240 canvas. Cara cuadrada ancha, cejas caídas, papada, carpeta en mano.
function MassaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#b07848';
  const hair  = '#5a4a38';
  return (
    <g>
      {/* ── FONDO: azul PJ oscuro ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#0a1428" />
      <rect x={0}   y={0}   width={200} height={240} fill="#0e1c36" />
      {/* detalle fondo: líneas sutiles */}
      <rect x={0}   y={60}  width={200} height={2}   fill="#101e38" />
      <rect x={0}   y={120} width={200} height={2}   fill="#101e38" />
      <rect x={0}   y={180} width={200} height={2}   fill="#101e38" />
      {/* ── CUERPO / TRAJE NAVY OSCURO ── */}
      <rect x={10}  y={166} width={180} height={78}  fill="#242438" />
      {/* solapa izquierda */}
      <rect x={10}  y={166} width={58}  height={74}  fill="#1a1a2e" />
      {/* solapa derecha */}
      <rect x={132} y={166} width={58}  height={74}  fill="#1a1a2e" />
      {/* diagonal solapa izq */}
      <rect x={62}  y={166} width={12}  height={54}  fill="#202038" />
      <rect x={66}  y={166} width={6}   height={34}  fill="#2a2a48" />
      {/* diagonal solapa der */}
      <rect x={126} y={166} width={12}  height={54}  fill="#202038" />
      <rect x={126} y={166} width={6}   height={34}  fill="#2a2a48" />
      {/* camisa blanca */}
      <rect x={74}  y={166} width={52}  height={78}  fill="#e8e8e8" />
      {/* corbata azul */}
      <rect x={86}  y={168} width={28}  height={72}  fill="#3a5a8a" />
      <rect x={88}  y={168} width={24}  height={16}  fill="#2a4070" />
      <rect x={90}  y={168} width={20}  height={10}  fill="#1e3060" />
      {/* botones camisa */}
      <rect x={98}  y={192} width={4}   height={4}   fill="#c0c0c0" />
      <rect x={98}  y={204} width={4}   height={4}   fill="#c0c0c0" />
      <rect x={98}  y={216} width={4}   height={4}   fill="#c0c0c0" />
      {/* bolsillo con pañuelo */}
      <rect x={18}  y={174} width={24}  height={18}  fill="#1e1e3c" />
      <rect x={20}  y={172} width={12}  height={8}   fill="#3a5a8a" />
      {/* pliegues hombro */}
      <rect x={10}  y={166} width={6}   height={48}  fill="#121220" />
      <rect x={184} y={166} width={6}   height={48}  fill="#121220" />
      {/* ── CARPETA EN MANO DERECHA (accesorio) ── */}
      <rect x={148} y={194} width={42}  height={54}  fill="#e8d090" />
      <rect x={150} y={196} width={38}  height={50}  fill="#f0d898" />
      {/* lomo carpeta */}
      <rect x={148} y={194} width={8}   height={54}  fill="#c8a840" />
      {/* líneas hojas */}
      <rect x={156} y={202} width={28}  height={2}   fill="#a09060" />
      <rect x={156} y={210} width={28}  height={2}   fill="#a09060" />
      <rect x={156} y={218} width={28}  height={2}   fill="#a09060" />
      <rect x={156} y={226} width={22}  height={2}   fill="#a09060" />
      {/* clip carpeta */}
      <rect x={162} y={194} width={14}  height={6}   fill="#888050" />
      {/* ── CUELLO GRUESO ── */}
      <rect x={66}  y={136} width={68}  height={36}  fill={skin} />
      <rect x={66}  y={144} width={12}  height={28}  fill="#906030" />
      <rect x={122} y={144} width={12}  height={28}  fill="#906030" />
      {/* ── PELO: corto gris-marrón, plano arriba ── */}
      <rect x={26}  y={30}  width={148} height={28}  fill={hair} />
      {/* degradado pelo */}
      <rect x={30}  y={26}  width={140} height={10}  fill="#4a3c2c" />
      {/* laterales */}
      <rect x={20}  y={44}  width={18}  height={30}  fill={hair} />
      <rect x={162} y={44}  width={18}  height={30}  fill={hair} />
      {/* patillas */}
      <rect x={22}  y={68}  width={10}  height={20}  fill={hair} />
      <rect x={168} y={68}  width={10}  height={20}  fill={hair} />
      {/* ── CABEZA: muy ancha y cuadrada ── */}
      <rect x={22}  y={44}  width={156} height={100} fill={skin} />
      {/* PAPADA / mandíbula ancha */}
      <rect x={20}  y={124} width={160} height={36}  fill={skin} />
      <rect x={18}  y={140} width={34}  height={14}  fill="#9a6838" />
      <rect x={148} y={140} width={34}  height={14}  fill="#9a6838" />
      {/* pómulos prominentes */}
      <rect x={22}  y={86}  width={16}  height={26}  fill="#9a7040" />
      <rect x={162} y={86}  width={16}  height={26}  fill="#9a7040" />
      {/* orejas grandes */}
      <rect x={14}  y={88}  width={14}  height={28}  fill={skin} />
      <rect x={172} y={88}  width={14}  height={28}  fill={skin} />
      <rect x={16}  y={92}  width={6}   height={18}  fill="#9a7040" />
      <rect x={178} y={92}  width={6}   height={18}  fill="#9a7040" />
      {/* ── CEJAS: caídas en las puntas externas ── */}
      {/* izq: interior más alto, exterior más bajo */}
      <rect x={32}  y={76}  width={26}  height={8}   fill="#2c1e10" />
      <rect x={54}  y={80}  width={16}  height={8}   fill="#2c1e10" />
      {/* der: espejado */}
      <rect x={118} y={76}  width={26}  height={8}   fill="#2c1e10" />
      <rect x={142} y={80}  width={16}  height={8}   fill="#2c1e10" />
      {/* ── OJOS: oscuros, con párpado caído (hooded) ── */}
      {/* esclerótica izq */}
      <rect x={34}  y={88}  width={38}  height={22}  fill="white" />
      {/* párpado superior pesado izq */}
      <rect x={34}  y={88}  width={38}  height={8}   fill={skin} />
      {/* iris oscuro izq */}
      <rect x={40}  y={93}  width={22}  height={16}  fill="#3a2410" />
      {/* pupila izq */}
      <rect x={46}  y={96}  width={12}  height={10}  fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={46}  y={96}  width={4}   height={4}   fill="white" />
      {/* sombra inferior oj izq */}
      <rect x={34}  y={108} width={38}  height={4}   fill="#906030" />
      {/* esclerótica der */}
      <rect x={128} y={88}  width={38}  height={22}  fill="white" />
      {/* párpado der */}
      <rect x={128} y={88}  width={38}  height={8}   fill={skin} />
      {/* iris der */}
      <rect x={138} y={93}  width={22}  height={16}  fill="#3a2410" />
      {/* pupila der */}
      <rect x={142} y={96}  width={12}  height={10}  fill="#1a0e06" />
      {/* highlight der */}
      <rect x={142} y={96}  width={4}   height={4}   fill="white" />
      {/* sombra inferior oj der */}
      <rect x={128} y={108} width={38}  height={4}   fill="#906030" />
      {/* ── NARIZ ANCHA ── */}
      {/* puente */}
      <rect x={92}  y={110} width={16}  height={22}  fill="#9a6030" />
      {/* dorso nariz */}
      <rect x={88}  y={120} width={24}  height={8}   fill="#885028" />
      {/* aleta izq */}
      <rect x={78}  y={126} width={16}  height={10}  fill="#885028" />
      {/* aleta der */}
      <rect x={106} y={126} width={16}  height={10}  fill="#885028" />
      {/* fosas */}
      <rect x={80}  y={130} width={8}   height={6}   fill="#6a3818" />
      <rect x={112} y={130} width={8}   height={6}   fill="#6a3818" />
      {/* ── BOCA ── */}
      {win
        ? <rect x={60} y={148} width={80} height={8}  fill="#cc3020" />
        : panic
        ? <rect x={66} y={150} width={68} height={6}  fill="#6a2810" />
        : <rect x={64} y={148} width={72} height={6}  fill="#6a2810" />}
      {win && <rect x={62}  y={148} width={76} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={60}  y={144} width={8}   height={8}   fill="#9a5830" />
      <rect x={132} y={144} width={8}   height={8}   fill="#9a5830" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={52}  y={110} width={8}  height={22} fill="#88c8f0" />}
      {panic && <rect x={154} y={110} width={8}  height={22} fill="#88c8f0" />}
      {panic && <rect x={54}  y={130} width={6}  height={10} fill="#aadcf8" />}
      {panic && <rect x={62}  y={152} width={6}  height={8}  fill="#8a3820" />}
      {panic && <rect x={132} y={152} width={6}  height={8}  fill="#8a3820" />}
    </g>
  );
}

// ── Bullrich ───────────────────────────────────────────────────────────────────
// 200×240 canvas. Flequillo recto, blazer gris, blusa rosa, badge/escudo en solapa.
function BullrichPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c07848';
  const hair  = '#7a4a28';
  const hairD = '#4e2e14';
  return (
    <g>
      {/* ── FONDO: gris-azul gobierno ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#2a3040" />
      <rect x={0}   y={0}   width={200} height={240} fill="#303848" />
      <rect x={0}   y={0}   width={200} height={4}   fill="#383e50" />
      <rect x={0}   y={8}   width={200} height={2}   fill="#383e50" />
      <rect x={0}   y={16}  width={200} height={2}   fill="#383e50" />
      <rect x={0}   y={24}  width={200} height={2}   fill="#383e50" />
      {/* ── CUERPO / BLAZER GRIS ── */}
      <rect x={12}  y={168} width={176} height={76}  fill="#787878" />
      <rect x={12}  y={168} width={56}  height={72}  fill="#646464" />
      <rect x={132} y={168} width={56}  height={72}  fill="#646464" />
      <rect x={62}  y={168} width={12}  height={56}  fill="#6e6e6e" />
      <rect x={66}  y={168} width={6}   height={36}  fill="#7a7a7a" />
      <rect x={126} y={168} width={12}  height={56}  fill="#6e6e6e" />
      <rect x={126} y={168} width={6}   height={36}  fill="#7a7a7a" />
      {/* blusa rosa */}
      <rect x={74}  y={168} width={52}  height={76}  fill="#e8b8a8" />
      <rect x={82}  y={168} width={36}  height={16}  fill="#f0c8b8" />
      <rect x={88}  y={168} width={24}  height={10}  fill="#f8d8c8" />
      {/* collar de perlas */}
      <rect x={78}  y={174} width={4}   height={4}   fill="#f0ece0" />
      <rect x={84}  y={172} width={4}   height={4}   fill="#f0ece0" />
      <rect x={90}  y={170} width={4}   height={4}   fill="#f0ece0" />
      <rect x={96}  y={170} width={4}   height={4}   fill="#f0ece0" />
      <rect x={102} y={170} width={4}   height={4}   fill="#f0ece0" />
      <rect x={108} y={170} width={4}   height={4}   fill="#f0ece0" />
      <rect x={114} y={172} width={4}   height={4}   fill="#f0ece0" />
      <rect x={120} y={174} width={4}   height={4}   fill="#f0ece0" />
      {/* ── BADGE / ESCUDO en solapa izquierda ── */}
      <rect x={20}  y={180} width={20}  height={24}  fill="#c89060" />
      <rect x={22}  y={182} width={16}  height={20}  fill="#d8a070" />
      <rect x={24}  y={184} width={12}  height={6}   fill="#74ACDF" />
      <rect x={24}  y={192} width={6}   height={8}   fill="#3060a0" />
      <rect x={30}  y={192} width={6}   height={8}   fill="#e8e8e8" />
      {/* botones blazer */}
      <rect x={58}  y={200} width={6}   height={6}   fill="#505050" />
      <rect x={58}  y={214} width={6}   height={6}   fill="#505050" />
      <rect x={12}  y={168} width={6}   height={50}  fill="#585858" />
      <rect x={182} y={168} width={6}   height={50}  fill="#585858" />
      {/* ── CUELLO ── */}
      <rect x={78}  y={140} width={44}  height={32}  fill={skin} />
      <rect x={78}  y={148} width={8}   height={24}  fill="#a06030" />
      <rect x={114} y={148} width={8}   height={24}  fill="#a06030" />
      {/* ── PELO: castaño, flequillo + largo a los lados ── */}
      <rect x={30}  y={20}  width={140} height={36}  fill={hair} />
      <rect x={44}  y={22}  width={14}  height={28}  fill="#9a6038" />
      <rect x={88}  y={18}  width={10}  height={30}  fill="#9a6038" />
      <rect x={126} y={22}  width={12}  height={26}  fill="#9a6038" />
      {/* FLEQUILLO – recto, cubre frente */}
      <rect x={28}  y={44}  width={144} height={22}  fill={hair} />
      <rect x={30}  y={62}  width={140} height={6}   fill={hairD} />
      <rect x={22}  y={46}  width={24}  height={96}  fill={hair} />
      <rect x={154} y={46}  width={24}  height={96}  fill={hair} />
      <rect x={24}  y={60}  width={12}  height={70}  fill="#6a3a20" />
      <rect x={164} y={60}  width={12}  height={70}  fill="#6a3a20" />
      {/* ── CABEZA: oval ── */}
      <rect x={32}  y={46}  width={136} height={106} fill={skin} />
      <rect x={34}  y={140} width={132} height={16}  fill={skin} />
      <rect x={32}  y={100} width={12}  height={24}  fill="#a06838" />
      <rect x={156} y={100} width={12}  height={24}  fill="#a06838" />
      <rect x={26}  y={96}  width={10}  height={20}  fill={skin} />
      <rect x={164} y={96}  width={10}  height={20}  fill={skin} />
      {/* aretes de perla */}
      <rect x={26}  y={106} width={8}   height={8}   fill="#f0ece0" />
      <rect x={166} y={106} width={8}   height={8}   fill="#f0ece0" />
      {/* ── CEJAS ── */}
      <rect x={44}  y={78}  width={34}  height={6}   fill="#3a1e0a" />
      <rect x={122} y={78}  width={34}  height={6}   fill="#3a1e0a" />
      {/* ── OJOS: castaños cálidos ── */}
      <rect x={44}  y={86}  width={34}  height={20}  fill="white" />
      <rect x={49}  y={87}  width={20}  height={18}  fill="#4a2810" />
      <rect x={54}  y={90}  width={12}  height={12}  fill="#1a0a04" />
      <rect x={54}  y={90}  width={4}   height={4}   fill="white" />
      <rect x={44}  y={86}  width={34}  height={4}   fill={skin} />
      <rect x={44}  y={104} width={34}  height={4}   fill="#a06030" />
      <rect x={122} y={86}  width={34}  height={20}  fill="white" />
      <rect x={131} y={87}  width={20}  height={18}  fill="#4a2810" />
      <rect x={134} y={90}  width={12}  height={12}  fill="#1a0a04" />
      <rect x={134} y={90}  width={4}   height={4}   fill="white" />
      <rect x={122} y={86}  width={34}  height={4}   fill={skin} />
      <rect x={122} y={104} width={34}  height={4}   fill="#a06030" />
      {/* ── NARIZ ── */}
      <rect x={92}  y={108} width={16}  height={20}  fill="#a86030" />
      <rect x={88}  y={118} width={24}  height={8}   fill="#906028" />
      <rect x={82}  y={124} width={14}  height={8}   fill="#906028" />
      <rect x={104} y={124} width={14}  height={8}   fill="#906028" />
      <rect x={84}  y={128} width={8}   height={4}   fill="#703a18" />
      <rect x={108} y={128} width={8}   height={4}   fill="#703a18" />
      {/* ── BOCA ── */}
      {win
        ? <rect x={66} y={142} width={68} height={8}  fill="#cc4030" />
        : panic
        ? <rect x={70} y={144} width={60} height={6}  fill="#9a4838" />
        : <rect x={68} y={142} width={64} height={6}  fill="#9a4838" />}
      <rect x={68}  y={140} width={64}  height={4}   fill="#e89088" />
      {win && <rect x={68}  y={143} width={64} height={4} fill="white" />}
      <rect x={64}  y={138} width={8}   height={8}   fill="#c07868" />
      <rect x={128} y={138} width={8}   height={8}   fill="#c07868" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={60}  y={106} width={8}  height={22} fill="#88c8f0" />}
      {panic && <rect x={148} y={106} width={8}  height={22} fill="#88c8f0" />}
      {panic && <rect x={62}  y={126} width={6}  height={10} fill="#aadcf8" />}
      {panic && <rect x={68}  y={146} width={6}  height={8}  fill="#8a3820" />}
      {panic && <rect x={126} y={146} width={6}  height={8}  fill="#8a3820" />}
    </g>
  );
}

// ── Bregman ────────────────────────────────────────────────────────────────────
// 200×240 canvas. Pelo rubio con highlights, ojos verdes, campera de cuero, pin puño.
function BregmanPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#d8a870';
  const hair  = '#c8a030';
  const hairH = '#e0c040';
  return (
    <g>
      {/* ── FONDO: rojo profundo ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#280808" />
      <rect x={0}   y={0}   width={200} height={240} fill="#300a0a" />
      {/* patrón sutil */}
      <rect x={0}   y={30}  width={200} height={2}   fill="#380e0e" />
      <rect x={0}   y={60}  width={200} height={2}   fill="#380e0e" />
      <rect x={0}   y={90}  width={200} height={2}   fill="#380e0e" />
      {/* ── CUERPO / CAMPERA DE CUERO NEGRA ── */}
      <rect x={12}  y={168} width={176} height={76}  fill="#181818" />
      {/* solapa izq */}
      <rect x={12}  y={168} width={58}  height={72}  fill="#0e0e0e" />
      {/* solapa der */}
      <rect x={130} y={168} width={58}  height={72}  fill="#0e0e0e" />
      {/* diagonal izq */}
      <rect x={64}  y={168} width={10}  height={52}  fill="#141414" />
      <rect x={68}  y={168} width={6}   height={34}  fill="#1e1e1e" />
      {/* diagonal der */}
      <rect x={126} y={168} width={10}  height={52}  fill="#141414" />
      <rect x={126} y={168} width={6}   height={34}  fill="#1e1e1e" />
      {/* línea central campera */}
      <rect x={96}  y={168} width={8}   height={76}  fill="#2a2a2a" />
      {/* camisa interior blanca */}
      <rect x={74}  y={168} width={52}  height={76}  fill="#e8e8e8" />
      {/* zipper */}
      <rect x={98}  y={172} width={4}   height={70}  fill="#888888" />
      <rect x={97}  y={172} width={6}   height={4}   fill="#aaaaaa" />
      {/* botón zipper */}
      <rect x={98}  y={174} width={4}   height={4}   fill="#cccccc" />
      {/* pliegues hombro */}
      <rect x={12}  y={168} width={6}   height={48}  fill="#080808" />
      <rect x={182} y={168} width={6}   height={48}  fill="#080808" />
      {/* ── PIN PUÑO ALZADO en solapa izquierda ── */}
      <rect x={22}  y={182} width={16}  height={18}  fill="#cc2200" />
      <rect x={24}  y={180} width={12}  height={4}   fill="#ee3300" />
      {/* mano pixel */}
      <rect x={26}  y={178} width={6}   height={4}   fill="#d8a870" />
      <rect x={28}  y={174} width={4}   height={6}   fill="#d8a870" />
      {/* botones campera */}
      <rect x={152} y={188} width={6}   height={6}   fill="#2a2a2a" />
      <rect x={152} y={202} width={6}   height={6}   fill="#2a2a2a" />
      {/* ── CUELLO ── */}
      <rect x={78}  y={140} width={44}  height={32}  fill={skin} />
      <rect x={78}  y={148} width={8}   height={24}  fill="#b07848" />
      <rect x={114} y={148} width={8}   height={24}  fill="#b07848" />
      {/* ── PELO RUBIO: mechas, largo ── */}
      {/* masa superior */}
      <rect x={28}  y={16}  width={144} height={30}  fill={hair} />
      {/* highlights superiores */}
      <rect x={38}  y={16}  width={16}  height={24}  fill={hairH} />
      <rect x={76}  y={14}  width={12}  height={26}  fill={hairH} />
      <rect x={114} y={16}  width={14}  height={22}  fill={hairH} />
      {/* lateral izquierdo – hasta hombros */}
      <rect x={18}  y={30}  width={22}  height={100} fill={hair} />
      <rect x={20}  y={44}  width={10}  height={80}  fill={hairH} />
      {/* lateral derecho */}
      <rect x={160} y={30}  width={22}  height={100} fill={hair} />
      <rect x={170} y={44}  width={10}  height={80}  fill={hairH} />
      {/* pelo sobre frente */}
      <rect x={34}  y={40}  width={132} height={14}  fill={hair} />
      <rect x={36}  y={50}  width={128} height={6}   fill="#a88020" />
      {/* detalles capa pelo */}
      <rect x={24}  y={60}  width={8}   height={60}  fill="#a08020" />
      <rect x={168} y={60}  width={8}   height={60}  fill="#a08020" />
      {/* ── CABEZA: slim oval ── */}
      <rect x={36}  y={40}  width={128} height={112} fill={skin} />
      <rect x={38}  y={144} width={124} height={14}  fill={skin} />
      {/* pómulos sutiles */}
      <rect x={36}  y={100} width={10}  height={22}  fill="#c09058" />
      <rect x={154} y={100} width={10}  height={22}  fill="#c09058" />
      {/* orejas */}
      <rect x={30}  y={92}  width={10}  height={18}  fill={skin} />
      <rect x={160} y={92}  width={10}  height={18}  fill={skin} />
      {/* ── CEJAS naturales ── */}
      <rect x={46}  y={74}  width={34}  height={6}   fill="#6a3a18" />
      <rect x={120} y={74}  width={34}  height={6}   fill="#6a3a18" />
      {/* ── OJOS VERDES ── */}
      {/* esclerótica izq */}
      <rect x={46}  y={82}  width={36}  height={20}  fill="white" />
      {/* iris verde izq */}
      <rect x={52}  y={83}  width={22}  height={18}  fill="#5a8860" />
      {/* pupila izq */}
      <rect x={58}  y={86}  width={12}  height={12}  fill="#1a3020" />
      {/* highlight izq */}
      <rect x={58}  y={86}  width={4}   height={4}   fill="white" />
      {/* iris external ring */}
      <rect x={52}  y={83}  width={22}  height={3}   fill="#3a6040" />
      {/* párpado sup izq */}
      <rect x={46}  y={82}  width={36}  height={4}   fill={skin} />
      {/* sombra inf izq */}
      <rect x={46}  y={100} width={36}  height={4}   fill="#b07848" />
      {/* esclerótica der */}
      <rect x={118} y={82}  width={36}  height={20}  fill="white" />
      {/* iris verde der */}
      <rect x={126} y={83}  width={22}  height={18}  fill="#5a8860" />
      {/* pupila der */}
      <rect x={130} y={86}  width={12}  height={12}  fill="#1a3020" />
      {/* highlight der */}
      <rect x={130} y={86}  width={4}   height={4}   fill="white" />
      <rect x={126} y={83}  width={22}  height={3}   fill="#3a6040" />
      <rect x={118} y={82}  width={36}  height={4}   fill={skin} />
      <rect x={118} y={100} width={36}  height={4}   fill="#b07848" />
      {/* ── NARIZ ── */}
      <rect x={92}  y={106} width={16}  height={20}  fill="#b87848" />
      <rect x={88}  y={116} width={24}  height={8}   fill="#a06030" />
      <rect x={84}  y={120} width={14}  height={8}   fill="#a06030" />
      <rect x={102} y={120} width={14}  height={8}   fill="#a06030" />
      <rect x={86}  y={124} width={8}   height={4}   fill="#803818" />
      <rect x={106} y={124} width={8}   height={4}   fill="#803818" />
      {/* ── BOCA CON SONRISA ── */}
      {win
        ? <rect x={64} y={138} width={72} height={8}  fill="#cc4020" />
        : panic
        ? <rect x={68} y={140} width={64} height={6}  fill="#8a4028" />
        : <rect x={66} y={138} width={68} height={6}  fill="#8a4028" />}
      {win && <rect x={66}  y={139} width={68} height={4} fill="white" />}
      {/* comisuras levantadas */}
      <rect x={60}  y={132} width={8}   height={8}   fill="#c87868" />
      <rect x={132} y={132} width={8}   height={8}   fill="#c87868" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={64}  y={102} width={8}  height={24} fill="#88c8f0" />}
      {panic && <rect x={140} y={102} width={8}  height={24} fill="#88c8f0" />}
      {panic && <rect x={66}  y={124} width={6}  height={10} fill="#aadcf8" />}
      {panic && <rect x={70}  y={142} width={6}  height={8}  fill="#8a3820" />}
      {panic && <rect x={124} y={142} width={6}  height={8}  fill="#8a3820" />}
    </g>
  );
}

// ── Schiaretti ─────────────────────────────────────────────────────────────────
// 200×240 canvas. Cara muy ancha y redonda, pelo blanco-gris, traje azul, mate en mano.
function SchiarettiPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#b87848';
  const hair  = '#c0b8a8';
  return (
    <g>
      {/* ── FONDO: ocre cálido cordobés ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#2a1e0a" />
      <rect x={0}   y={0}   width={200} height={240} fill="#332410" />
      {/* detalles cálidos */}
      <rect x={0}   y={40}  width={200} height={2}   fill="#3c2a12" />
      <rect x={0}   y={80}  width={200} height={2}   fill="#3c2a12" />
      <rect x={0}   y={120} width={200} height={2}   fill="#3c2a12" />
      {/* ── CUERPO / TRAJE AZUL ── */}
      <rect x={6}   y={164} width={188} height={80}  fill="#3a5a8a" />
      {/* solapa izq */}
      <rect x={6}   y={164} width={60}  height={76}  fill="#2c4870" />
      {/* solapa der */}
      <rect x={134} y={164} width={60}  height={76}  fill="#2c4870" />
      {/* diagonal izq */}
      <rect x={60}  y={164} width={14}  height={58}  fill="#324e78" />
      <rect x={66}  y={164} width={8}   height={38}  fill="#3a5a8a" />
      {/* diagonal der */}
      <rect x={126} y={164} width={14}  height={58}  fill="#324e78" />
      <rect x={126} y={164} width={8}   height={38}  fill="#3a5a8a" />
      {/* camisa blanca */}
      <rect x={74}  y={164} width={52}  height={80}  fill="#f0f0f0" />
      {/* corbata azul oscura */}
      <rect x={86}  y={166} width={28}  height={76}  fill="#1a3060" />
      <rect x={88}  y={166} width={24}  height={18}  fill="#0e1e40" />
      <rect x={90}  y={166} width={20}  height={10}  fill="#0a1830" />
      {/* botones traje */}
      <rect x={30}  y={188} width={8}   height={8}   fill="#243c60" />
      <rect x={30}  y={204} width={8}   height={8}   fill="#243c60" />
      {/* bolsillo */}
      <rect x={16}  y={172} width={26}  height={20}  fill="#263e68" />
      <rect x={18}  y={170} width={12}  height={8}   fill="#3a5a8a" />
      {/* pliegues hombro */}
      <rect x={6}   y={164} width={8}   height={54}  fill="#202e50" />
      <rect x={186} y={164} width={8}   height={54}  fill="#202e50" />
      {/* ── MATE EN MANO IZQUIERDA (accesorio) ── */}
      <rect x={4}   y={196} width={28}  height={36}  fill="#4a2a10" />
      <rect x={6}   y={198} width={24}  height={32}  fill="#5a3418" />
      {/* boca porrón mate */}
      <rect x={10}  y={196} width={16}  height={8}   fill="#2a1408" />
      {/* bombilla */}
      <rect x={16}  y={180} width={4}   height={22}  fill="#a8a060" />
      <rect x={15}  y={178} width={6}   height={4}   fill="#c0b870" />
      {/* yerba */}
      <rect x={8}   y={204} width={20}  height={6}   fill="#5a7830" />
      <rect x={10}  y={208} width={16}  height={4}   fill="#486428" />
      {/* ── CUELLO GRUESO ── */}
      <rect x={68}  y={132} width={64}  height={36}  fill={skin} />
      <rect x={68}  y={140} width={10}  height={28}  fill="#986030" />
      <rect x={122} y={140} width={10}  height={28}  fill="#986030" />
      {/* ── PELO BLANCO-GRIS con cobertura ── */}
      <rect x={18}  y={26}  width={164} height={28}  fill={hair} />
      <rect x={20}  y={22}  width={160} height={12}  fill="#9a9080" />
      {/* laterales */}
      <rect x={12}  y={44}  width={18}  height={32}  fill={hair} />
      <rect x={170} y={44}  width={18}  height={32}  fill={hair} />
      {/* patillas */}
      <rect x={14}  y={66}  width={12}  height={24}  fill={hair} />
      <rect x={174} y={66}  width={12}  height={24}  fill={hair} />
      {/* ── CABEZA MUY ANCHA Y REDONDA ── */}
      <rect x={10}  y={44}  width={180} height={100} fill={skin} />
      {/* PAPADA y jowls */}
      <rect x={8}   y={120} width={184} height={40}  fill={skin} />
      <rect x={8}   y={148} width={36}  height={16}  fill="#9a6838" />
      <rect x={156} y={148} width={36}  height={16}  fill="#9a6838" />
      {/* mejillas muy prominentes */}
      <rect x={10}  y={96}  width={20}  height={34}  fill="#c08848" />
      <rect x={170} y={96}  width={20}  height={34}  fill="#c08848" />
      {/* orejas grandes */}
      <rect x={4}   y={86}  width={16}  height={30}  fill={skin} />
      <rect x={180} y={86}  width={16}  height={30}  fill={skin} />
      <rect x={6}   y={90}  width={8}   height={20}  fill="#9a7040" />
      <rect x={186} y={90}  width={8}   height={20}  fill="#9a7040" />
      {/* ── CEJAS oscuras ── */}
      <rect x={22}  y={72}  width={46}  height={8}   fill="#2c1e10" />
      <rect x={132} y={72}  width={46}  height={8}   fill="#2c1e10" />
      {/* ── OJOS: marrón cálido ── */}
      {/* esclerótica izq */}
      <rect x={24}  y={82}  width={44}  height={22}  fill="white" />
      {/* iris izq */}
      <rect x={30}  y={83}  width={26}  height={20}  fill="#4a2c10" />
      {/* pupila izq */}
      <rect x={36}  y={86}  width={16}  height={14}  fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={36}  y={86}  width={6}   height={6}   fill="white" />
      {/* párpado sup izq */}
      <rect x={24}  y={82}  width={44}  height={4}   fill={skin} />
      {/* sombra inf izq */}
      <rect x={24}  y={102} width={44}  height={4}   fill="#9a7040" />
      {/* esclerótica der */}
      <rect x={132} y={82}  width={44}  height={22}  fill="white" />
      {/* iris der */}
      <rect x={144} y={83}  width={26}  height={20}  fill="#4a2c10" />
      {/* pupila der */}
      <rect x={148} y={86}  width={16}  height={14}  fill="#1a0e06" />
      {/* highlight der */}
      <rect x={148} y={86}  width={6}   height={6}   fill="white" />
      <rect x={132} y={82}  width={44}  height={4}   fill={skin} />
      <rect x={132} y={102} width={44}  height={4}   fill="#9a7040" />
      {/* ── NARIZ ANCHA ── */}
      <rect x={90}  y={104} width={20}  height={24}  fill="#9a6030" />
      <rect x={84}  y={116} width={32}  height={10}  fill="#885028" />
      <rect x={76}  y={122} width={18}  height={10}  fill="#885028" />
      <rect x={106} y={122} width={18}  height={10}  fill="#885028" />
      <rect x={78}  y={126} width={10}  height={6}   fill="#6a3818" />
      <rect x={112} y={126} width={10}  height={6}   fill="#6a3818" />
      {/* ── BOCA CON SONRISA AMPLIA ── */}
      {win
        ? <rect x={54} y={142} width={92} height={10} fill="#cc3020" />
        : panic
        ? <rect x={60} y={144} width={80} height={8}  fill="#8a4028" />
        : <rect x={58} y={142} width={84} height={8}  fill="#8a4028" />}
      {win && <rect x={56}  y={142} width={88} height={5} fill="white" />}
      {/* comisuras levantadas – sonrisa amistosa */}
      <rect x={50}  y={136} width={10}  height={10}  fill="#b06040" />
      <rect x={140} y={136} width={10}  height={10}  fill="#b06040" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={56}  y={104} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={152} y={104} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={58}  y={128} width={8}  height={12} fill="#aadcf8" />}
      {panic && <rect x={62}  y={146} width={8}  height={10} fill="#8a3820" />}
      {panic && <rect x={130} y={146} width={8}  height={10} fill="#8a3820" />}
    </g>
  );
}

// ── Larreta ────────────────────────────────────────────────────────────────────
// 200×240 canvas. Casi calvo (buzz-cut), cejas muy gruesas (KEY), cara redonda, camisa sin corbata, obelisco fondo.
function LarretaPortrait({ mood }: { mood: PortraitMood }) {
  const panic = mood === 'panic';
  const win   = mood === 'victory';
  const skin  = '#c8845a';
  return (
    <g>
      {/* ── FONDO: cyan/gris Ciudad de Buenos Aires ── */}
      <rect x={0}   y={0}   width={200} height={240} fill="#1a2a30" />
      <rect x={0}   y={0}   width={200} height={240} fill="#1e3038" />
      {/* sky gradient */}
      <rect x={0}   y={0}   width={200} height={80}  fill="#1e3848" />
      {/* ── OBELISCO pixel en fondo ── */}
      <rect x={164} y={20}  width={10}  height={120} fill="#3a4a50" />
      <rect x={162} y={16}  width={14}  height={10}  fill="#2a3840" />
      <rect x={164} y={18}  width={10}  height={6}   fill="#3a4a50" />
      {/* tope obelisco */}
      <rect x={167} y={12}  width={4}   height={8}   fill="#4a5a62" />
      <rect x={168} y={8}   width={2}   height={6}   fill="#5a6a72" />
      {/* ventanas obelisco */}
      <rect x={166} y={36}  width={6}   height={8}   fill="#2a5860" />
      <rect x={166} y={52}  width={6}   height={8}   fill="#2a5860" />
      <rect x={166} y={68}  width={6}   height={8}   fill="#2a5860" />
      <rect x={166} y={84}  width={6}   height={8}   fill="#2a5860" />
      {/* base obelisco */}
      <rect x={158} y={136} width={22}  height={8}   fill="#2a3840" />
      {/* ── CUERPO / TRAJE CARBÓN ── */}
      <rect x={12}  y={168} width={176} height={76}  fill="#282830" />
      {/* solapa izq */}
      <rect x={12}  y={168} width={56}  height={72}  fill="#1e1e28" />
      {/* solapa der */}
      <rect x={132} y={168} width={56}  height={72}  fill="#1e1e28" />
      {/* diagonal izq */}
      <rect x={62}  y={168} width={12}  height={54}  fill="#222230" />
      <rect x={66}  y={168} width={6}   height={34}  fill="#2c2c3c" />
      {/* diagonal der */}
      <rect x={126} y={168} width={12}  height={54}  fill="#222230" />
      <rect x={126} y={168} width={6}   height={34}  fill="#2c2c3c" />
      {/* CAMISA BLANCA – sin corbata ── */}
      <rect x={74}  y={168} width={52}  height={76}  fill="#f0f0f0" />
      {/* cuello camisa */}
      <rect x={84}  y={168} width={32}  height={16}  fill="#e8e8e8" />
      <rect x={90}  y={168} width={20}  height={10}  fill="#f8f8f8" />
      {/* botones camisa */}
      <rect x={97}  y={186} width={6}   height={6}   fill="#c8c8c8" />
      <rect x={97}  y={200} width={6}   height={6}   fill="#c8c8c8" />
      <rect x={97}  y={214} width={6}   height={6}   fill="#c8c8c8" />
      {/* botones traje izq */}
      <rect x={30}  y={192} width={8}   height={8}   fill="#181820" />
      <rect x={30}  y={208} width={8}   height={8}   fill="#181820" />
      {/* bolsillo con pañuelo blanco */}
      <rect x={20}  y={176} width={22}  height={18}  fill="#1a1a24" />
      <rect x={22}  y={174} width={10}  height={6}   fill="#f0f0f0" />
      {/* pliegue hombro */}
      <rect x={12}  y={168} width={6}   height={52}  fill="#101018" />
      <rect x={182} y={168} width={6}   height={52}  fill="#101018" />
      {/* ── CUELLO ── */}
      <rect x={78}  y={138} width={44}  height={34}  fill={skin} />
      <rect x={78}  y={146} width={8}   height={26}  fill="#a86030" />
      <rect x={114} y={146} width={8}   height={26}  fill="#a86030" />
      {/* ── CABEZA: redonda ── */}
      <rect x={36}  y={30}  width={128} height={120} fill={skin} />
      <rect x={38}  y={138} width={124} height={18}  fill={skin} />
      {/* pómulos */}
      <rect x={36}  y={106} width={14}  height={28}  fill="#b07040" />
      <rect x={150} y={106} width={14}  height={28}  fill="#b07040" />
      {/* orejas */}
      <rect x={28}  y={92}  width={12}  height={26}  fill={skin} />
      <rect x={160} y={92}  width={12}  height={26}  fill={skin} />
      <rect x={30}  y={96}  width={6}   height={16}  fill="#a86030" />
      <rect x={164} y={96}  width={6}   height={16}  fill="#a86030" />
      {/* ── BUZZ-CUT: sombra muy corta ── */}
      <rect x={36}  y={30}  width={128} height={16}  fill="#a86030" />
      <rect x={38}  y={30}  width={124} height={12}  fill="#3a2818" />
      <rect x={44}  y={30}  width={112} height={8}   fill={skin} />
      {/* stubble hairline lateral */}
      <rect x={36}  y={34}  width={12}  height={22}  fill="#3a2818" />
      <rect x={152} y={34}  width={12}  height={22}  fill="#3a2818" />
      {/* ── CEJAS MUY GRUESAS Y PROMINENTES – KEY FEATURE ── */}
      {/* ceja izq */}
      <rect x={42}  y={72}  width={52}  height={14}  fill="#1a1008" />
      {/* arco interior izq */}
      <rect x={42}  y={68}  width={14}  height={8}   fill="#1a1008" />
      {/* degradado */}
      <rect x={44}  y={74}  width={48}  height={4}   fill="#0e0806" />
      {/* ceja der */}
      <rect x={106} y={72}  width={52}  height={14}  fill="#1a1008" />
      {/* arco interior der */}
      <rect x={144} y={68}  width={14}  height={8}   fill="#1a1008" />
      <rect x={108} y={74}  width={48}  height={4}   fill="#0e0806" />
      {/* ── OJOS: marrón con bolsas ── */}
      {/* esclerótica izq */}
      <rect x={44}  y={88}  width={46}  height={22}  fill="white" />
      {/* iris izq */}
      <rect x={52}  y={89}  width={28}  height={20}  fill="#5a3218" />
      {/* pupila izq */}
      <rect x={58}  y={92}  width={18}  height={14}  fill="#1a0e06" />
      {/* highlight izq */}
      <rect x={58}  y={92}  width={6}   height={6}   fill="white" />
      {/* párpado sup izq */}
      <rect x={44}  y={88}  width={46}  height={4}   fill={skin} />
      {/* bolsas bajo ojos */}
      <rect x={44}  y={108} width={46}  height={6}   fill="#b07040" />
      <rect x={44}  y={112} width={46}  height={4}   fill="#a06030" />
      {/* esclerótica der */}
      <rect x={110} y={88}  width={46}  height={22}  fill="white" />
      {/* iris der */}
      <rect x={120} y={89}  width={28}  height={20}  fill="#5a3218" />
      {/* pupila der */}
      <rect x={124} y={92}  width={18}  height={14}  fill="#1a0e06" />
      {/* highlight der */}
      <rect x={124} y={92}  width={6}   height={6}   fill="white" />
      <rect x={110} y={88}  width={46}  height={4}   fill={skin} />
      <rect x={110} y={108} width={46}  height={6}   fill="#b07040" />
      <rect x={110} y={112} width={46}  height={4}   fill="#a06030" />
      {/* ── NARIZ ── */}
      <rect x={90}  y={114} width={20}  height={22}  fill="#a86030" />
      <rect x={86}  y={124} width={28}  height={10}  fill="#906028" />
      <rect x={80}  y={130} width={16}  height={8}   fill="#906028" />
      <rect x={104} y={130} width={16}  height={8}   fill="#906028" />
      <rect x={82}  y={134} width={10}  height={4}   fill="#703a18" />
      <rect x={108} y={134} width={10}  height={4}   fill="#703a18" />
      {/* ── BOCA ── */}
      {win
        ? <rect x={66} y={148} width={68} height={8}  fill="#cc3020" />
        : panic
        ? <rect x={70} y={150} width={60} height={6}  fill="#6a3020" />
        : <rect x={68} y={148} width={64} height={6}  fill="#6a3020" />}
      {win && <rect x={68}  y={149} width={64} height={4} fill="white" />}
      {/* comisuras */}
      <rect x={62}  y={144} width={8}   height={8}   fill="#a05030" />
      <rect x={130} y={144} width={8}   height={8}   fill="#a05030" />
      {/* ── PÁNICO: lágrimas ── */}
      {panic && <rect x={62}  y={112} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={138} y={112} width={10} height={26} fill="#88c8f0" />}
      {panic && <rect x={64}  y={136} width={8}  height={10} fill="#aadcf8" />}
      {panic && <rect x={70}  y={152} width={8}  height={8}  fill="#8a3820" />}
      {panic && <rect x={122} y={152} width={8}  height={8}  fill="#8a3820" />}
    </g>
  );
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function PixelPortrait({ id, mood = 'neutral', px = 96 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMood     = useRef<PortraitMood>(mood);

  const base: PortraitId =
    id === 'ingeniero'   ? 'milei'       :
    id === 'populista'   ? 'massa'       :
    id === 'tecnocrata'  ? 'bullrich'    :
    id === 'izquierda'   ? 'bregman'     :
    id === 'federal'     ? 'schiaretti'  :
    id === 'corporativo' ? 'larreta'     : id;

  const svgH = Math.round(px * 240 / 200);

  // ── Idle: subtle float animation ──────────────────────────────────────────
  useGSAP(() => {
    gsap.to(containerRef.current, {
      y: -3,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, { scope: containerRef });

  // ── Mood transitions ──────────────────────────────────────────────────────
  useGSAP(() => {
    if (prevMood.current === mood) return;
    prevMood.current = mood;

    if (mood === 'panic') {
      gsap.killTweensOf(containerRef.current, 'x,rotation');
      gsap.timeline()
        .to(containerRef.current, { x: -5, rotation: -3, duration: 0.06, ease: 'none' })
        .to(containerRef.current, { x:  5, rotation:  3, duration: 0.06, ease: 'none' })
        .to(containerRef.current, { x: -4, rotation: -2, duration: 0.06, ease: 'none' })
        .to(containerRef.current, { x:  4, rotation:  2, duration: 0.06, ease: 'none' })
        .to(containerRef.current, { x:  0, rotation:  0, duration: 0.08, ease: 'none' });
    } else if (mood === 'victory') {
      gsap.killTweensOf(containerRef.current, 'scale,y');
      gsap.timeline()
        .to(containerRef.current, {
          scale: 1.18,
          duration: 0.18,
          ease: 'back.out(3)',
          transformOrigin: '50% 100%',
          immediateRender: false,
        })
        .to(containerRef.current, {
          scale: 1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)',
          transformOrigin: '50% 100%',
        });
    } else {
      // back to neutral
      gsap.to(containerRef.current, { x: 0, rotation: 0, scale: 1, duration: 0.2 });
    }
  }, { scope: containerRef, dependencies: [mood] });

  return (
    <div
      ref={containerRef}
      style={{ display: 'inline-block', width: px, height: svgH, lineHeight: 0 }}
    >
      <svg
        width={px}
        height={svgH}
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated', display: 'block' }}
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
    </div>
  );
}
