export function CasaRosadaMini({ tense = false }: { tense?: boolean }) {
  const PK = tense ? '#D4948A' : '#E8B4B8';
  const WH = '#ECE8E0';
  const CB = '#74ACDF';
  const GD = '#F6B40E';
  const GR = '#8A9BAA';
  const BR = '#7A5530';
  // P=2 grid, viewBox 80×60
  const r = (x: number, y: number, w: number, h: number, fill: string) => (
    <rect x={x * 2} y={y * 2} width={w * 2} height={h * 2} fill={fill} />
  );
  return (
    <svg
      viewBox="0 0 80 60"
      xmlns="http://www.w3.org/2000/svg"
      width={80}
      height={60}
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Sky */}
      <rect x={0} y={0} width={80} height={60} fill={CB} opacity={0.25} />
      {/* Flag pole + flag */}
      {r(19, 1, 1, 8, GR)}
      {r(20, 1, 3, 1, CB)}
      {r(20, 2, 3, 1, WH)}
      {r(20, 3, 3, 1, CB)}
      {/* Parapet row */}
      {r(8, 5, 24, 1, WH)}
      {[8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map((c, i) => (
        <rect key={i} x={c * 2} y={4 * 2} width={1 * 2} height={1 * 2} fill={GR} />
      ))}
      {/* Main facade */}
      {r(8, 6, 24, 12, PK)}
      {/* Facade highlight */}
      {r(9, 6, 22, 4, tense ? '#D8A099' : '#F0C8CC')}
      {/* Ground floor arcade arches (5 arches) */}
      {[9, 12, 15, 18, 21].map((c, i) => (
        <g key={i}>
          {r(c, 14, 2, 4, WH)}
          {r(c, 13, 2, 1, GD)}
        </g>
      ))}
      {/* Upper floor windows (4 windows) */}
      {[10, 14, 18, 22].map((c, i) => (
        <g key={i}>
          {r(c, 8, 2, 3, tense ? '#553030' : '#B3D4F0')}
          {r(c, 7, 2, 1, GR)}
        </g>
      ))}
      {/* Central balcony */}
      {r(18, 10, 4, 1, GD)}
      {/* Ground / steps */}
      {r(7, 18, 26, 1, BR)}
      {r(6, 19, 28, 1, BR)}
    </svg>
  );
}
