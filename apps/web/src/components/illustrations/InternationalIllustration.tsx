import React from 'react';

const P = 6;
function px(col: number, row: number, w: number, h: number, fill: string) {
  return <rect x={col*P} y={row*P} width={w*P} height={h*P} fill={fill} />;
}

export function InternationalIllustration() {
  const P_NAV = '#162032'; const P_SLT = '#2A3D52'; const P_CB = '#74ACDF';
  const P_WH = '#ECE8E0'; const P_BK = '#080C12';
  const P_GD = '#F6B40E'; const P_GR = '#3D5468'; const P_GR2 = '#8A9BAA';
  const P_CR = '#CC2200'; const P_RD = '#EF3030'; const P_GN = '#3AA858';
  const P_LB = '#B3D4F0'; const P_DG = '#1E3A1E'; const P_YL = '#FFD84D';
  const P_BR = '#7A5530';
  return (
    <svg width="320" height="180" viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}>
      {/* Deep space background */}
      {px(0,0,53,30,P_NAV)}
      {/* Stars scattered */}
      {[[1,1],[5,3],[10,1],[18,2],[25,0],[33,2],[40,1],[48,3],[52,0]].map(([c,r])=>(
        <rect key={`${c}${r}`} x={(c as number)*P} y={(r as number)*P} width={2} height={2} fill={P_WH} />
      ))}
      {/* ── Pixel globe (center) — lat/lon grid + continent blocks ── */}
      {/* Globe background */}
      {px(12,3,30,24,P_CB)}
      {/* Latitude stripe rows (dark blue) */}
      {[4,6,8,10,12,14,16,18,20,22].map(r=>(
        <rect key={r} x={12*P} y={r*P} width={30*P} height={2} fill={P_NAV} />
      ))}
      {/* Longitude column lines */}
      {[16,20,24,28,32,36].map(c=>(
        <rect key={c} x={c*P} y={3*P} width={2} height={24*P} fill={P_NAV} />
      ))}
      {/* Continent blocks (green patches) */}
      {/* South America (left-center) */}
      {px(15,8,5,8,P_DG)}{px(14,10,2,4,P_GN)}{px(16,15,4,4,P_GN)}
      {/* North America */}
      {px(14,4,7,5,P_GN)}{px(13,5,2,3,P_GN)}
      {/* Europe/Africa (right-center) */}
      {px(25,5,5,4,P_RD)}{px(26,9,4,6,P_CR)}{px(27,14,3,4,P_GN)}
      {/* Asia blob */}
      {px(30,4,9,6,P_GN)}{px(31,9,7,4,P_DG)}
      {/* Globe border frame */}
      <rect x={12*P} y={3*P} width={30*P} height={24*P} fill="none" stroke={P_WH} strokeWidth={2} />
      {/* ── Left flag (Argentina) ── */}
      <rect x={4*P} y={4*P} width={1} height={10*P} fill={P_BR} />
      {px(5,4,7,2,P_CB)}{px(5,6,7,2,P_WH)}{px(5,8,7,2,P_CB)}
      {/* Sun token on white stripe */}
      <rect x={8*P} y={6*P+2} width={P} height={P} fill={P_YL} />
      {/* ── Right flag (USA or IMF) ── */}
      <rect x={46*P} y={4*P} width={1} height={10*P} fill={P_BR} />
      {px(47,4,5,2,P_RD)}{px(47,6,5,2,P_WH)}{px(47,8,5,2,P_RD)}
      {/* ── Storm cloud (top-left of globe) ── */}
      {px(1,4,8,3,P_GR2)}{px(2,3,6,2,P_GR)}{px(0,5,5,2,P_GR2)}
      {/* Lightning bolt pixel */}
      {px(4,7,1,1,P_YL)}{px(3,8,2,1,P_YL)}{px(4,9,1,1,P_YL)}
      {/* ── Negotiation arrows between flags and globe ── */}
      {/* Left arrow → */}
      {[8,9,10].map(c=>(
        <rect key={c} x={c*P} y={10*P} width={P} height={2} fill={P_GD} />
      ))}
      {px(11,9,2,2,P_GD)}
      {/* Right arrow ← */}
      {[44,45,46].map(c=>(
        <rect key={c} x={c*P} y={10*P} width={P} height={2} fill={P_GR2} />
      ))}
      {px(42,9,2,2,P_GR2)}
      {/* Label */}
      <rect x={0} y={160} width={320} height={20} fill="rgba(9,21,37,0.92)" />
      <text x={8} y={174} fill={P_WH} fontSize={8} fontFamily="'Press Start 2P'" style={{imageRendering:'pixelated' as const}}>INTERNACIONAL</text>
    </svg>
  );
}

      {/* Globe outline */}
      <circle cx="100" cy="60" r="45" fill="#0a1628" stroke="#1565c0" strokeWidth="1.5" opacity="0.7" />
      {/* Latitude lines */}
      <ellipse cx="100" cy="60" rx="45" ry="15" fill="none" stroke="#1976d2" strokeWidth="0.8" opacity="0.4" />
      <ellipse cx="100" cy="60" rx="45" ry="30" fill="none" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />
      {/* Longitude lines */}
      <line x1="100" y1="15" x2="100" y2="105" stroke="#1976d2" strokeWidth="0.8" opacity="0.4" />
      <line x1="70" y1="17" x2="130" y2="103" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />
      <line x1="130" y1="17" x2="70" y2="103" stroke="#1976d2" strokeWidth="0.8" opacity="0.3" />

      {/* Continents (simplified) */}
      {/* South America */}
      <path d="M85,50 Q82,60 84,75 Q90,82 95,78 Q100,72 98,60 Q95,50 85,50 Z" fill="#2e7d32" opacity="0.7" />
      {/* North America */}
      <path d="M75,30 Q65,35 68,48 Q74,52 80,46 Q85,38 80,30 Z" fill="#1565c0" opacity="0.7" />
      {/* Europe */}
      <path d="M108,38 Q104,42 106,50 Q112,54 118,48 Q120,40 115,36 Z" fill="#c62828" opacity="0.7" />
      {/* Africa */}
      <path d="M110,55 Q108,68 112,80 Q118,82 122,74 Q125,62 122,54 Z" fill="#e65100" opacity="0.7" />

      {/* Flags */}
      {/* Flag 1 top-left */}
      <rect x="15" y="10" width="20" height="12" rx="1" fill="#1565c0" />
      <rect x="15" y="10" width="20" height="4" fill="#1565c0" />
      <rect x="15" y="14" width="20" height="4" fill="#fdd835" />
      <rect x="15" y="18" width="20" height="4" fill="#1565c0" />
      <line x1="14" y1="10" x2="14" y2="25" stroke="#795548" strokeWidth="1.5" />

      {/* Flag 2 top-right */}
      <rect x="165" y="10" width="20" height="12" rx="1" fill="#c62828" />
      <rect x="172" y="10" width="6" height="12" fill="#fafafa" />
      <line x1="164" y1="10" x2="164" y2="25" stroke="#795548" strokeWidth="1.5" />

      {/* Storm clouds with drifting animation */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0,0;8,0;0,0" dur="6s" repeatCount="indefinite" />
        <ellipse cx="30" cy="45" rx="18" ry="12" fill="#37474f" opacity="0.8" />
        <ellipse cx="42" cy="40" rx="14" ry="10" fill="#455a64" opacity="0.7" />
        {/* Lightning */}
        <polyline points="35,52 32,60 37,58 34,68" stroke="#ffd54f" strokeWidth="2" fill="none">
          <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
        </polyline>
      </g>

      {/* Arrows */}
      <line x1="95" y1="60" x2="70" y2="45" stroke="#ffd54f" strokeWidth="1.5" markerEnd="url(#arrow)" opacity="0.7" />
      <line x1="105" y1="58" x2="130" y2="45" stroke="#ef9a9a" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}
