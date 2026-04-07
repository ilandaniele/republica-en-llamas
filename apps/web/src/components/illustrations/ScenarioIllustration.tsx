import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { ScenarioId } from '@republica/game-engine';

gsap.registerPlugin(useGSAP);

interface Props {
  id: ScenarioId;
  presidentId?: string;
}

// ── Pixel rect primitive ────────────────────────────────────────────────────────
function R(x: number, y: number, w: number, h: number, fill: string, rx = 0, stroke?: string, sw = 1.5): React.ReactElement {
  return stroke
    ? <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} stroke={stroke} strokeWidth={sw} />
    : <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} />;
}

// ── President pixel figure (26×44) ─────────────────────────────────────────────
const PRES_CFG: Record<string, { suit: string; dark: string; hair: string; skin: string; tie: string; style: string }> = {
  milei:       { suit: '#1a237e', dark: '#0d1545', hair: '#1a0a00', skin: '#c8845a', tie: '#F6B40E', style: 'spiky' },
  ingeniero:   { suit: '#1a237e', dark: '#0d1545', hair: '#1a0a00', skin: '#c8845a', tie: '#F6B40E', style: 'spiky' },
  massa:       { suit: '#880e0e', dark: '#5a0000', hair: '#1a0a00', skin: '#c8845a', tie: '#f44336', style: 'combed' },
  populista:   { suit: '#880e0e', dark: '#5a0000', hair: '#1a0a00', skin: '#c8845a', tie: '#f44336', style: 'combed' },
  bullrich:    { suit: '#f57f17', dark: '#a35200', hair: '#2a1800', skin: '#d4a06a', tie: '#FFD54F', style: 'pulled' },
  tecnocrata:  { suit: '#f57f17', dark: '#a35200', hair: '#2a1800', skin: '#d4a06a', tie: '#FFD54F', style: 'pulled' },
  bregman:     { suit: '#b71c1c', dark: '#7f0000', hair: '#1a0a00', skin: '#e8b07a', tie: '#ef5350', style: 'curly' },
  izquierda:   { suit: '#b71c1c', dark: '#7f0000', hair: '#1a0a00', skin: '#e8b07a', tie: '#ef5350', style: 'curly' },
  schiaretti:  { suit: '#3e2723', dark: '#1a0000', hair: '#4a4a4a', skin: '#c8845a', tie: '#8d6e63', style: 'side' },
  federal:     { suit: '#3e2723', dark: '#1a0000', hair: '#4a4a4a', skin: '#c8845a', tie: '#8d6e63', style: 'side' },
  larreta:     { suit: '#37474f', dark: '#263238', hair: '#888888', skin: '#d4a06a', tie: '#90a4ae', style: 'gray' },
  corporativo: { suit: '#37474f', dark: '#263238', hair: '#888888', skin: '#d4a06a', tie: '#90a4ae', style: 'gray' },
};

function Pres({ pid, x, y }: { pid: string; x: number; y: number }): React.ReactElement {
  const c = PRES_CFG[pid] ?? { suit: '#37474f', dark: '#263238', hair: '#555', skin: '#c8845a', tie: '#90a4ae', style: 'gray' };
  const hx = x + 13;
  const hy = y + 12;
  return (
    <g>
      {R(x+3, y+30, 8, 14, c.dark)}
      {R(x+15, y+30, 8, 14, c.dark)}
      {R(x+1, y+16, 24, 16, c.suit)}
      {R(x+1, y+16, 10, 12, c.dark)}
      {R(x+15, y+16, 10, 12, c.dark)}
      {R(x+8, y+16, 10, 14, '#e8e8e8')}
      {R(x+10, y+16, 6, 12, c.tie)}
      <circle cx={hx} cy={hy} r={11} fill={c.skin} />
      {c.style === 'spiky' && <><rect x={hx-10} y={hy-13} width={5} height={9} fill={c.hair} /><rect x={hx-5} y={hy-15} width={5} height={12} fill={c.hair} /><rect x={hx} y={hy-16} width={5} height={12} fill={c.hair} /><rect x={hx+5} y={hy-14} width={5} height={10} fill={c.hair} /><rect x={hx+9} y={hy-12} width={4} height={8} fill={c.hair} /></>}
      {c.style === 'combed' && <rect x={hx-10} y={hy-12} width={21} height={9} fill={c.hair} />}
      {c.style === 'pulled' && <><rect x={hx-10} y={hy-12} width={21} height={8} fill={c.hair} /><rect x={hx+6} y={hy-14} width={5} height={6} fill={c.hair} /></>}
      {c.style === 'curly' && [hx-8,hx-3,hx+2,hx+7].map((bx,i)=><circle key={i} cx={bx} cy={hy-9} r={5} fill={c.hair} />)}
      {c.style === 'side' && <rect x={hx-10} y={hy-12} width={15} height={9} fill={c.hair} />}
      {c.style === 'gray' && <><rect x={hx-10} y={hy-12} width={21} height={8} fill={c.hair} /><rect x={hx-10} y={hy-5} width={21} height={4} fill={c.hair} /></>}
      {R(hx-6, hy-2, 4, 3, '#1a0a00')}
      {R(hx+2, hy-2, 4, 3, '#1a0a00')}
    </g>
  );
}

// ── Scenes (320×180 canvas) ───────────────────────────────────────────────────

function SceneHiperinflacion({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#1f0800')}
      {R(0,0,320,55,'#3d0c00')}
      {R(0,140,320,40,'#2a1400')}
      {R(0,138,320,8,'#3e2000')}
      {R(0,50,70,130,'#2e1200')}
      {[0,1,2,3,4,5].map(i=><React.Fragment key={i}>{R(5,60+i*12,12,10,'#cc3300')}{R(22,60+i*12,12,10,i%2===0?'#cc2200':'#1a0800')}</React.Fragment>)}
      {R(250,40,70,140,'#2e1200')}
      {[0,1,2,3,4,5].map(i=><React.Fragment key={i}>{R(254,50+i*12,14,10,'#cc2200')}{R(272,50+i*12,14,10,i%2===0?'#1a0800':'#cc3300')}</React.Fragment>)}
      <g className="gsap-primary">
        {R(88,104,34,19,'#a5d6a7',1,'#2e7d32',1)}
        {R(108,88,34,19,'#c8e6c9',1,'#1b5e20',1)}
        {R(132,72,34,19,'#a5d6a7',1,'#2e7d32',1)}
        {R(148,56,32,18,'#c8e6c9',1,'#1b5e20',1)}
        {R(118,98,28,16,'#81c784',1,'#388e3c',1)}
        {R(98,68,28,16,'#a5d6a7',1,'#2e7d32',1)}
        <text x={92} y={118} fill="#1b5e20" fontSize={9} fontFamily="monospace" fontWeight="bold">$</text>
        <text x={112} y={102} fill="#1b5e20" fontSize={9} fontFamily="monospace" fontWeight="bold">$</text>
        <text x={136} y={86} fill="#1b5e20" fontSize={9} fontFamily="monospace" fontWeight="bold">$</text>
      </g>
      {R(82,120,86,26,'#5d4037',3,'#2c1a00',2)}
      {R(82,120,86,10,'#795548',3)}
      <circle cx={110} cy={148} r={13} fill="#3e2000" stroke="#5d4037" strokeWidth={2} />
      <circle cx={110} cy={148} r={5} fill="#1a0800" />
      <line x1={168} y1={124} x2={210} y2={114} stroke="#5d4037" strokeWidth={3} />
      <line x1={168} y1={138} x2={210} y2={138} stroke="#5d4037" strokeWidth={3} />
      {R(212,38,100,96,'#f5e6c8',2,'#5d4037',2)}
      {R(212,38,100,18,'#c62828',2)}
      <text x={216} y={52} fill="#fff" fontSize={9} fontFamily="monospace" fontWeight="bold">PRECIOS</text>
      <text x={216} y={72} fill="#c62828" fontSize={10} fontFamily="monospace" fontWeight="bold">$82.500</text>
      <text x={216} y={90} fill="#c62828" fontSize={10} fontFamily="monospace" fontWeight="bold">$210.000</text>
      <text x={216} y={108} fill="#c62828" fontSize={10} fontFamily="monospace" fontWeight="bold">$1.200.000</text>
      <text x={216} y={124} fill="#880000" fontSize={8} fontFamily="monospace">pan/kilo</text>
      <Pres pid={pid} x={22} y={92} />
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#ef5350" fontSize={8} fontFamily="monospace" letterSpacing={1}>💸 HIPERINFLACIÓN 1989</text>
    </>
  );
}

function SceneCorralito({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#607d8b')}
      {R(0,130,320,50,'#4a3728')}
      {R(55,20,210,120,'#e8e0d0',0,'#b0a890',2)}
      {R(55,20,210,16,'#9e9e9e')}
      <polygon points="55,20 160,4 265,20" fill="#d0c8b8" stroke="#b0a890" strokeWidth={2} />
      <text x={160} y={52} fill="#5d4037" fontSize={12} fontFamily="monospace" fontWeight="bold" textAnchor="middle">BANCO CENTRAL</text>
      <text x={160} y={66} fill="#5d4037" fontSize={9} fontFamily="monospace" textAnchor="middle">CERRADO POR DECRETO</text>
      {[68,90,112,134,156,178,200,222,244].map((x,i)=><rect key={i} x={x} y={20} width={7} height={120} fill="#d5cdc0"/>)}
      {R(108,50,64,78,'#455a64',2,'#263238',2)}
      {R(114,56,52,30,'#102030',1)}
      {R(116,58,48,26,'#0d2137')}
      <text x={140} y={72} fill="#ef5350" fontSize={9} fontFamily="monospace" fontWeight="bold" textAnchor="middle">SIN EFECTIVO</text>
      {R(114,90,52,30,'#263238')}
      {[0,1,2].map(row=>[0,1,2].map(col=><rect key={`${row}-${col}`} x={118+col*16} y={94+row*9} width={12} height={7} fill="#34495e" stroke="#263238" strokeWidth={0.5} rx={1}/>))}
      <g className="gsap-primary">
        {[110,128,146,164].map((x,i)=><rect key={i} x={x} y={36} width={7} height={98} fill="#546e7a" stroke="#37474f" strokeWidth={1.5}/>)}
        {R(108,36,12,12,'#78909c')}{R(162,36,12,12,'#78909c')}
      </g>
      {[270,284,298,312].map((x,i)=><React.Fragment key={i}><circle cx={x} cy={106} r={8} fill="#f4c08a"/>{R(x-7,115,14,20,['#1565c0','#880e0e','#2e7d32','#455a64'][i]!,1)}</React.Fragment>)}
      <Pres pid={pid} x={22} y={82} />
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#90caf9" fontSize={8} fontFamily="monospace" letterSpacing={1}>🏦 CORRALITO 2001</text>
    </>
  );
}

function SceneConvertibilidad() {
  return (
    <>
      {R(0,0,320,180,'#e3f2fd')}
      {R(0,130,320,50,'#5d4037')}
      {R(0,0,320,50,'#bbdefb')}
      {[30,100,190,265].map((x,i)=><ellipse key={i} cx={x} cy={18+i*4} rx={26} ry={11} fill="white" opacity={0.8}/>)}
      {R(146,28,8,110,'#78909c')}
      {R(55,48,210,7,'#546e7a')}
      {R(55,55,80,12,'#546e7a')}
      {R(60,67,70,26,'#c8e6c9',2,'#43a047',2)}
      <text x={95} y={84} fill="#1b5e20" fontSize={15} fontFamily="monospace" fontWeight="bold" textAnchor="middle">USD</text>
      <text x={95} y={96} fill="#2e7d32" fontSize={10} fontFamily="monospace" textAnchor="middle">$1 = $1</text>
      {R(185,55,80,12,'#546e7a')}
      {R(190,67,70,26,'#a5d6a7',2,'#43a047',2)}
      <text x={225} y={84} fill="#1b5e20" fontSize={15} fontFamily="monospace" fontWeight="bold" textAnchor="middle">ARS</text>
      <text x={225} y={96} fill="#2e7d32" fontSize={10} fontFamily="monospace" textAnchor="middle">CONVERTIBLE</text>
      <g className="gsap-primary">
        {[{x:18,h:35,f:'#4caf50'},{x:39,h:55,f:'#43a047'},{x:60,h:45,f:'#66bb6a'},{x:81,h:72,f:'#2e7d32'},{x:102,h:90,f:'#1b5e20'},{x:123,h:75,f:'#388e3c'}].map((b,i)=>(
          <rect key={i} x={b.x} y={130-b.h} width={17} height={b.h} fill={b.f} style={{transformOrigin:`${b.x+8}px 130px`}}/>
        ))}
      </g>
      <line x1={14} y1={130} x2={145} y2={130} stroke="#1b5e20" strokeWidth={2}/>
      <line x1={14} y1={50} x2={14} y2={130} stroke="#1b5e20" strokeWidth={2}/>
      <text x={60} y={148} fill="#1b5e20" fontSize={8} fontFamily="monospace">PIB % crecimiento</text>
      {R(0,162,320,18,'rgba(0,0,0,0.75)')}
      <text x={8} y={174} fill="#74ACDF" fontSize={8} fontFamily="monospace" letterSpacing={1}>⚖ CONVERTIBILIDAD 1991</text>
    </>
  );
}

function SceneRodrigazo({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#200800')}
      {R(0,0,320,70,'#4a1000')}
      {R(0,40,320,45,'rgba(200,40,0,0.4)')}
      {R(0,55,55,125,'#1a0800')}{R(0,55,55,16,'#2a1400')}
      {R(265,45,55,135,'#1a0800')}{R(265,45,55,16,'#2a1400')}
      {R(78,62,50,118,'#1a0800')}{R(185,58,50,122,'#1a0800')}
      {[0,1,2,3,4].map(i=><React.Fragment key={i}>
        {R(6,58+i*10,12,7,'#cc3300')}{R(34,58+i*10,12,7,i%2===0?'#cc2200':'#440000')}
        {R(268,50+i*10,12,7,'#cc3300')}{R(292,50+i*10,12,7,'#440000')}
      </React.Fragment>)}
      <g className="gsap-primary">
        {[100,122,148,174,200,222].map((x,i)=><React.Fragment key={i}>
          {R(x,106,10,30,'#ff6600')}{R(x+2,96,6,14,'#ffaa00')}{R(x+3,90,4,10,'#ffdd00')}
        </React.Fragment>)}
      </g>
      {[90,106,120,136,150,166,180,196,210,226,240,256].map((x,i)=><React.Fragment key={i}>
        <circle cx={x} cy={134} r={6} fill="#1a0800"/>
        {R(x-5,140,10,18,'#1a0800')}
      </React.Fragment>)}
      <Pres pid={pid} x={22} y={86} />
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#F6B40E" fontSize={8} fontFamily="monospace" letterSpacing={1}>🔥 RODRIGAZO 1975</text>
    </>
  );
}

function SceneMalvinas() {
  return (
    <>
      {R(0,0,320,180,'#0d2140')}
      {R(0,90,320,90,'#1565c0')}
      {[20,55,80,100,155,210,260,305].map((x,i)=><circle key={i} cx={x} cy={10+i*4} r={1.5} fill="white" opacity={0.7}/>)}
      {[0,30,60,90,120,150,180,210,240,270,300].map((x,i)=><React.Fragment key={i}>
        <ellipse cx={x+15} cy={106} rx={20} ry={5} fill="#1976d2" opacity={0.7}/>
        <ellipse cx={x} cy={118} rx={18} ry={4} fill="#0d47a1" opacity={0.5}/>
      </React.Fragment>)}
      {R(140,68,120,36,'#2d4a1e',2)}{R(145,58,90,22,'#344e22',2)}{R(200,52,40,22,'#3a5526',2)}
      {R(230,28,4,44,'#5d4037')}
      {R(234,28,24,9,'#74ACDF')}{R(234,37,24,9,'#ffffff')}{R(234,46,24,9,'#74ACDF')}
      <circle cx={246} cy={37} r={4} fill="#F6B40E"/>
      <g className="gsap-primary">
        {R(12,76,115,24,'#455a64',2,'#263238',2)}
        {R(34,58,72,22,'#546e7a',2,'#37474f',2)}
        {R(56,44,34,18,'#607d8b',2,'#455a64',2)}
        {R(24,74,22,8,'#37474f',1)}{R(16,70,32,9,'#455a64',1)}
        <line x1={16} y1={72} x2={4} y2={66} stroke="#37474f" strokeWidth={3}/>
        {R(82,74,22,8,'#37474f',1)}
        <line x1={86} y1={72} x2={74} y2={64} stroke="#37474f" strokeWidth={3}/>
        {R(56,38,32,8,'#003399',1)}{R(56,38,32,2,'#cc0000',1)}{R(56,40,32,3,'#ffffff',1)}{R(56,43,32,3,'#cc0000',1)}{R(70,38,5,8,'#cc0000',1)}
      </g>
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#90caf9" fontSize={8} fontFamily="monospace" letterSpacing={1}>⚓ GUERRA DE MALVINAS 1982</text>
    </>
  );
}

function SceneKirchnerismo({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#1565c0')}
      {R(0,100,320,80,'#2e1a00')}
      {R(0,96,320,12,'#3e2a00')}
      {R(14,38,130,104,'#263238',2,'#1a2328',2)}
      {R(20,10,22,42,'#37474f',1,'#263238',2)}
      {R(50,18,22,34,'#455a64',1,'#37474f',2)}
      {R(80,6,22,46,'#37474f',1,'#263238',2)}
      {[2,3].map(row=>[0,1,2,3].map(col=><rect key={`${row}-${col}`} x={24+col*28} y={50+row*26} width={20} height={16} fill="#f6b40e" stroke="#cc8800" strokeWidth={1}/>))}
      <g className="gsap-secondary">
        <circle cx={31} cy={8} r={9} fill="#546e7a" opacity={0.7}/>
        <circle cx={42} cy={2} r={8} fill="#607d8b" opacity={0.6}/>
        <circle cx={60} cy={15} r={10} fill="#546e7a" opacity={0.7}/>
        <circle cx={90} cy={4} r={11} fill="#455a64" opacity={0.6}/>
      </g>
      <g className="gsap-primary">
        {[{x:162,h:48,f:'#4caf50'},{x:186,h:70,f:'#43a047'},{x:210,h:86,f:'#388e3c'},{x:234,h:102,f:'#2e7d32'},{x:258,h:116,f:'#1b5e20'},{x:282,h:108,f:'#388e3c'}].map((b,i)=>(
          <rect key={i} x={b.x} y={132-b.h} width={20} height={b.h} fill={b.f} style={{transformOrigin:`${b.x+10}px 132px`}}/>
        ))}
      </g>
      {['03','04','05','06','07','08'].map((l,i)=><text key={i} x={162+i*24+10} y={140} fill="#81c784" fontSize={6} fontFamily="monospace" textAnchor="middle">{l}</text>)}
      <text x={242} y={156} fill="#66bb6a" fontSize={8} fontFamily="monospace">% PIB</text>
      <Pres pid={pid} x={22} y={48} />
      {R(12,96,46,10,'#5d4037',1)}{R(14,106,42,20,'#4a3728',1)}
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#81c784" fontSize={8} fontFamily="monospace" letterSpacing={1}>📈 KIRCHNERISMO 2003</text>
    </>
  );
}

function SceneLla({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#200800')}
      {R(0,80,320,100,'#1a0800')}
      {[0,16,32,48,64,80,96,112,128,144,160,176,192,208,224,240,256,272,288,304].map((x,i)=><React.Fragment key={i}>
        {R(x,95-i%4*4,16,85+i%3*8,'#2a0800')}
        {R(x+4,84-i%3*6,8,22+i%2*12,'rgba(200,50,0,0.7)')}
      </React.Fragment>)}
      {R(16,22,100,150,'#1a2040',0,'#263260',2)}
      {R(204,14,96,160,'#1a2040',0,'#263260',2)}
      <line x1={16} y1={22} x2={116} y2={172} stroke="#cc2200" strokeWidth={7} opacity={0.8}/>
      <line x1={204} y1={14} x2={300} y2={174} stroke="#cc2200" strokeWidth={7} opacity={0.8}/>
      <g className="gsap-secondary">
        {[128,148,162,178,142,168,152].map((x,i)=><text key={i} x={x} y={28+i*22} fill="#f6b40e" fontSize={16} fontFamily="monospace" fontWeight="bold">$</text>)}
      </g>
      <g className="gsap-primary" style={{transformOrigin:'148px 98px'}}>
        {R(112,92,72,14,'#e8a020',2,'#b07010',2)}
        {R(110,88,20,24,'#6a3a10',2,'#2c1000',2)}
        {R(114,90,12,20,'#8a5020',1)}
        {[118,128,138,148,158,168,178].map((x,i)=><rect key={i} x={x} y={106} width={6} height={12} fill="#c0c0c0"/>)}
        <text x={120} y={102} fill="#1a0800" fontSize={8} fontFamily="monospace" fontWeight="bold">MOTOSIERRA</text>
      </g>
      <Pres pid={pid} x={114} y={42} />
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#F6B40E" fontSize={8} fontFamily="monospace" letterSpacing={1}>⚡ LIBERTAD AVANZA 2023</text>
    </>
  );
}

function SceneGuerraUcrania({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,44,'#005bbb')}
      {R(0,44,320,46,'#ffd500')}
      {R(0,90,320,90,'#1a0f00')}
      {R(0,0,320,180,'rgba(0,0,40,0.35)')}
      {/* Skyline silhouettes */}
      {R(0,50,42,110,'#0a0a0a')}{R(42,60,28,100,'#0a0a0a')}{R(70,45,22,115,'#0a0a0a')}{R(92,55,36,105,'#0a0a0a')}
      {R(230,42,32,118,'#0a0a0a')}{R(262,52,24,108,'#0a0a0a')}{R(286,38,34,122,'#0a0a0a')}
      <g className="gsap-explosion">
        {R(128,50,62,44,'rgba(255,100,0,0.45)')}
        {R(142,40,34,22,'rgba(255,180,0,0.55)')}
        {R(154,32,22,16,'#fffde7')}
      </g>
      <g className="gsap-secondary">
        {[132,152,170,144,166].map((x,i)=><circle key={i} cx={x} cy={50-i*3} r={10+i*3} fill="#546e7a" opacity={0.7}/>)}
      </g>
      <g className="gsap-primary">
        {R(58,116,95,30,'#374000',2,'#263000',2)}
        {R(52,127,108,17,'#2e3800',1)}
        {R(70,108,54,14,'#374000',2,'#263000',2)}
        <circle cx={80} cy={148} r={13} fill="#1a2000" stroke="#374000" strokeWidth={2}/>
        <circle cx={110} cy={148} r={13} fill="#1a2000" stroke="#374000" strokeWidth={2}/>
        <circle cx={134} cy={148} r={13} fill="#1a2000" stroke="#374000" strokeWidth={2}/>
        <line x1={122} y1={112} x2={175} y2={100} stroke="#374000" strokeWidth={8}/>
        <line x1={122} y1={112} x2={177} y2={99} stroke="#2e3800" strokeWidth={5}/>
      </g>
      <Pres pid={pid} x={248} y={82} />
      {R(238,128,62,12,'#3e2723',1)}{R(242,140,54,22,'#2e1c12',1)}
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#ffd500" fontSize={8} fontFamily="monospace" letterSpacing={1}>🌻 GUERRA UCRANIA 2022</text>
    </>
  );
}

function SceneConflictoIran({ pid }: { pid: string }) {
  return (
    <>
      {R(0,0,320,180,'#1a0d00')}
      {R(0,0,320,50,'#7b2f00')}
      {R(0,20,320,40,'#a83200')}
      {R(0,38,320,30,'#cc4400')}
      {R(0,112,320,68,'#3d2200')}
      {R(0,108,320,10,'#5a3300')}
      {/* Oil derrick */}
      {R(226,36,10,86,'#1a1a1a')}
      {R(208,30,46,16,'#1a1a1a')}
      <polygon points="226,26 262,26 244,10" fill="#1a1a1a"/>
      <polygon points="226,26 190,26 208,10" fill="#252525"/>
      <g className="gsap-secondary">
        {R(229,16,14,24,'#ff6600')}{R(232,8,8,14,'#ffaa00')}{R(234,4,6,8,'#ffdd00')}
      </g>
      {/* Crescent symbols */}
      <circle cx={58} cy={35} r={22} fill="#004d00"/>
      <circle cx={65} cy={35} r={15} fill="#1a0d00"/>
      <text x={46} y={58} fill="#ffffff" fontSize={13} fontFamily="monospace">☪</text>
      <text x={78} y={56} fill="#0055cc" fontSize={13} fontFamily="monospace">✡</text>
      {/* Mosque dome */}
      {R(100,66,90,58,'#1a0d00')}{R(105,58,80,16,'#1a0d00')}
      <ellipse cx={145} cy={58} rx={40} ry={16} fill="#1a0d00"/>
      {R(130,34,30,28,'#1a0d00')}
      <g className="gsap-primary">
        {R(176,78,24,10,'#909090',1,'#606060',1)}
        {R(178,76,10,14,'#c0c0c0',1)}
        {R(188,83,36,5,'#ff6600',1)}
        {R(205,84,24,4,'#ff9900')}
        {R(218,86,16,3,'#ffcc00')}
      </g>
      <Pres pid={pid} x={26} y={64} />
      {R(14,108,58,10,'#3e2723')}{R(16,118,54,18,'#2e1c12')}
      {R(0,162,320,18,'rgba(0,0,0,0.85)')}
      <text x={8} y={174} fill="#ff9900" fontSize={8} fontFamily="monospace" letterSpacing={1}>🛢 CONFLICTO IRÁN 2024</text>
    </>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────
export function ScenarioIllustration({ id, presidentId = 'ingeniero' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    switch (id) {
      case 'hiperinflacion_1989':
        gsap.to('.gsap-primary', { y: -14, duration: 1.4, yoyo: true, repeat: -1, ease: 'power1.inOut', stagger: { amount: 0.5, from: 'start' } });
        break;
      case 'corralito_2001':
        gsap.fromTo('.gsap-primary', { x: 0 }, { x: 3, yoyo: true, repeat: 14, duration: 0.07, ease: 'power1.inOut' });
        break;
      case 'convertibilidad':
        gsap.fromTo('.gsap-primary > rect', { scaleY: 0 }, { scaleY: 1, duration: 0.7, stagger: 0.12, ease: 'power2.out', transformOrigin: '50% 100%' });
        break;
      case 'rodrigazo_1975':
        gsap.to('.gsap-primary', { scaleY: 1.2, transformOrigin: '50% 100%', yoyo: true, repeat: -1, duration: 0.5, ease: 'power1.inOut', stagger: { amount: 0.4, from: 'random' } });
        break;
      case 'malvinas_1982':
        gsap.to('.gsap-primary', { x: 24, yoyo: true, repeat: -1, duration: 7, ease: 'sine.inOut' });
        break;
      case 'kirchnerismo_boom':
        gsap.fromTo('.gsap-primary > rect', { scaleY: 0 }, { scaleY: 1, duration: 0.65, stagger: 0.1, ease: 'power2.out', transformOrigin: '50% 100%' });
        gsap.to('.gsap-secondary > circle', { y: -24, autoAlpha: 0, duration: 1.8, stagger: 0.3, repeat: -1, ease: 'power1.out' });
        break;
      case 'libertad_avanza_2023':
        gsap.to('.gsap-primary', { rotation: 7, transformOrigin: '116px 98px', yoyo: true, repeat: -1, duration: 0.4, ease: 'power1.inOut' });
        gsap.fromTo('.gsap-secondary > text', { y: 0, autoAlpha: 1 }, { y: 32, autoAlpha: 0, duration: 1.3, stagger: { each: 0.22, repeat: -1 }, ease: 'power1.in' });
        break;
      case 'guerra_ucrania_2022': {
        // Explosion glow flickers (fast) while smoke rises and tank rolls in parallel
        const tlUcrania = gsap.timeline();
        tlUcrania
          .to('.gsap-explosion', { autoAlpha: 0.5, yoyo: true, repeat: -1, duration: 0.28, ease: 'sine.inOut' })
          .to('.gsap-secondary > circle', { y: -22, autoAlpha: 0, duration: 2, stagger: 0.35, repeat: -1, ease: 'power1.out' }, '<')
          .to('.gsap-primary', { x: 20, yoyo: true, repeat: -1, duration: 5, ease: 'power1.inOut' }, '+=0');
        break;
      }
      case 'conflicto_iran_2024': {
        // Derrick flame flickers with stagger per rect layer (brightest tip fastest)
        const tlFlame = gsap.timeline({ repeat: -1 });
        tlFlame
          .to('.gsap-secondary > rect:last-child', { scaleY: 1.35, transformOrigin: '50% 100%', yoyo: true, duration: 0.2, ease: 'sine.inOut' }, 0)
          .to('.gsap-secondary > rect:nth-child(2)', { scaleY: 1.22, transformOrigin: '50% 100%', yoyo: true, duration: 0.32, ease: 'sine.inOut' }, 0)
          .to('.gsap-secondary > rect:first-child', { scaleY: 1.12, transformOrigin: '50% 100%', yoyo: true, duration: 0.45, ease: 'sine.inOut' }, 0);
        // Missile launches and resets atomically inside timeline — no onRepeat needed
        const tlMissile = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
        tlMissile
          .fromTo('.gsap-primary', { x: 0, y: 0, autoAlpha: 1 }, { x: 36, y: -15, autoAlpha: 0, duration: 1.3, ease: 'power2.in' })
          .set('.gsap-primary', { x: 0, y: 0, autoAlpha: 1 });
        break;
      }
    }
  }, { scope: containerRef, dependencies: [id, presidentId] });

  const scenes: Partial<Record<ScenarioId, React.ReactElement>> = {
    hiperinflacion_1989:  <SceneHiperinflacion pid={presidentId} />,
    corralito_2001:       <SceneCorralito pid={presidentId} />,
    convertibilidad:      <SceneConvertibilidad />,
    rodrigazo_1975:       <SceneRodrigazo pid={presidentId} />,
    malvinas_1982:        <SceneMalvinas />,
    kirchnerismo_boom:    <SceneKirchnerismo pid={presidentId} />,
    libertad_avanza_2023: <SceneLla pid={presidentId} />,
    guerra_ucrania_2022:  <SceneGuerraUcrania pid={presidentId} />,
    conflicto_iran_2024:  <SceneConflictoIran pid={presidentId} />,
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid meet"
        width="100%"
        height="100%"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        aria-label={`Escenario: ${id}`}
      >
        {scenes[id] ?? null}
      </svg>
    </div>
  );
}
