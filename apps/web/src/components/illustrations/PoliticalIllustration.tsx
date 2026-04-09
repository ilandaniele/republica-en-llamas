import React from 'react';

const P = 6;
function px(col: number, row: number, w: number, h: number, fill: string) {
  return <rect x={col*P} y={row*P} width={w*P} height={h*P} fill={fill} />;
}
function PixPerson({ c, r, suit = '#2A3D52', skin = '#D4956A', hair = '#080C12' }: { c:number; r:number; suit?:string; skin?:string; hair?:string }) {
  return (
    <g>
      {px(c,r,2,1,hair)}
      {px(c,r+1,2,1,skin)}
      {px(c,r+2,2,2,suit)}
      {px(c,r+4,1,1,suit)}
      {px(c+1,r+4,1,1,suit)}
    </g>
  );
}

export function PoliticalIllustration() {
  const P_NAV = '#162032'; const P_SLT = '#2A3D52'; const P_CB = '#74ACDF';
  const P_WH = '#ECE8E0'; const P_SK = '#D4956A'; const P_BK = '#080C12';
  const P_GD = '#F6B40E'; const P_GR = '#3D5468'; const P_GR2 = '#8A9BAA';
  const P_CR = '#CC2200'; const P_RD = '#EF3030'; const P_OR = '#FF7B2A';
  const P_DOME = '#3D6B4A'; const P_STONE = '#D8CFBB'; const P_STONE2 = '#BEB5A0';
  const P_YL = '#FFD84D';
  return (
    <svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Night sky */}
      {px(0,0,53,30,P_NAV)}
      {/* Ground */}
      {px(0,28,53,2,P_GR)}
      {/* Cobble pattern */}
      {[0,4,8,12,16,20,24,28,32,36,40,44,48].map(c=>(
        <rect key={c} x={c*P} y={28*P} width={3*P} height={P} fill="rgba(0,0,0,0.2)" />
      ))}
      {/* Stars */}
      {[[2,2],[8,1],[15,3],[25,1],[35,2],[45,1],[50,3]].map(([c,r])=>(
        <rect key={`${c}${r}`} x={(c!)*P} y={(r!)*P} width={2} height={2} fill="#ECE8E0" />
      ))}
      {/* Left wing */}
      {px(2,12,10,16,P_STONE)}
      {px(2,11,10,1,P_STONE2)}
      {[3,6].map(c=>[14,18].map(r=>(
        <rect key={`${c}${r}`} x={c*P} y={r*P} width={2*P} height={2*P} fill={P_CB}/>
      )))}
      {/* Right wing */}
      {px(41,12,10,16,P_STONE)}
      {px(41,11,10,1,P_STONE2)}
      {[42,45].map(c=>[14,18].map(r=>(
        <rect key={`r${c}${r}`} x={c*P} y={r*P} width={2*P} height={2*P} fill={P_CB}/>
      )))}
      {/* Central body */}
      {px(10,12,33,16,P_STONE)}
      {px(9,11,35,1,P_STONE2)}
      {/* Columns */}
      {[10,13,16,19,22,25,28,31,34,37,40].map(c=>(
        <rect key={c} x={c*P} y={12*P} width={P} height={16*P} fill={P_STONE2} />
      ))}
      {/* Dome */}
      {px(18,8,17,4,P_DOME)}
      {px(19,6,15,2,P_DOME)}
      {px(20,4,13,2,'#4E8A5E')}
      {px(21,3,11,1,'#4E8A5E')}
      {px(22,2,9,1,P_DOME)}
      {px(23,1,7,1,P_DOME)}
      {px(24,0,5,1,P_STONE)}
      {/* Flag on dome */}
      <rect x={26*P+1} y={0} width={2} height={7*P} fill={P_STONE2} />
      {px(27,0,7,1,P_CB)}{px(27,1,7,1,P_WH)}{px(27,2,7,1,P_CB)}
      {/* Dome windows */}
      {[20,24,28].map(c=>(
        <rect key={c} x={c*P} y={5*P} width={2*P} height={2*P} fill={P_CB} />
      ))}
      {/* Interior (visible between columns) */}
      {px(11,13,31,10,P_NAV)}
      {/* Podium */}
      {px(24,19,5,3,P_SLT)}{px(25,18,3,1,P_GD)}
      {/* Deputies fighting — pixel brawl */}
      <PixPerson c={13} r={20} suit={P_CR} skin={P_SK} hair={P_BK}/>
      <PixPerson c={20} r={20} suit={P_SLT} skin={P_SK} hair={P_BK}/>
      <PixPerson c={36} r={20} suit={P_RD} skin={P_SK} hair={P_BK}/>
      <PixPerson c={43} r={20} suit={P_CB} skin={P_SK} hair={P_BK}/>
      {/* Raised fist above deputy 1 */}
      {px(14,18,2,2,P_SK)}
      {/* Raised fist above deputy 3 */}
      {px(37,18,2,2,P_SK)}
      {/* Baton / broken mic pixels */}
      {px(22,20,3,1,P_GR2)}{px(24,19,1,2,P_GR2)}
      {/* Spark pixels between combatants */}
      {[[18,19,P_YL],[19,18,P_OR],[17,18,P_YL]].map(([c,r,f])=>(
        <rect key={`${c}${r}`} x={(c as number)*P} y={(r as number)*P} width={P} height={P} fill={f as string} />
      ))}
      {/* Bottom label bar */}
      <rect x={0} y={160} width={320} height={20} fill="rgba(9,21,37,0.92)" />
      <text x={8} y={174} fill={P_WH} fontSize={8} fontFamily="'Press Start 2P'" style={{imageRendering:'pixelated' as const}}>CONGRESO</text>
    </svg>
  );
}
