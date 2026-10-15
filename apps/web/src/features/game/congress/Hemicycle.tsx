import { CX, CY, ROW_RADII } from './congressData.js';
import { seatColor } from './congressData.js';
import type { Seat, VoteStatus } from './congressData.js';

interface HemicycleProps {
  seats: Seat[];
  seatVotes: VoteStatus[];
  required: number;
  live: boolean;
}

function ArcGuides() {
  return (
    <>
      {ROW_RADII.map((r) => (
        <path
          key={r}
          d={`M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`}
          fill="none"
          stroke="#1e293b"
          strokeWidth="0.5"
        />
      ))}
    </>
  );
}

function ChoriVendor() {
  return (
    <g transform="translate(510,285)">
      {/* Body */}
      <rect x="2" y="8" width="12" height="14" fill="#8B4513" />
      {/* Head */}
      <rect x="4" y="2" width="8" height="8" fill="#F5C8A0" />
      {/* Hat */}
      <rect x="2" y="0" width="12" height="4" fill="#4A3728" />
      {/* Wheelbarrow */}
      <rect x="-4" y="16" width="20" height="6" fill="#888" />
      <rect x="6" y="22" width="4" height="4" fill="#555" />
      {/* Sausages on barrow */}
      <rect x="0" y="14" width="6" height="3" fill="#CC6633" />
      <rect x="7" y="14" width="6" height="3" fill="#CC5522" />
    </g>
  );
}

export function Hemicycle({ seats, seatVotes, required, live }: HemicycleProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
      <svg
        viewBox="0 0 600 345"
        className="h-auto w-full"
        style={{ display: 'block', maxHeight: live ? '340px' : '200px' }}
      >
        {live && <ArcGuides />}
        {seats.map((seat) => {
          const vote = seatVotes[seat.index] ?? 'pending';
          const pendingOpacity = live ? 0.5 : 0.4;
          return (
            <circle
              key={seat.index}
              cx={seat.x}
              cy={seat.y}
              r={5}
              fill={seatColor(seat, vote)}
              opacity={vote === 'pending' ? pendingOpacity : 1}
              style={live ? { transition: 'fill 0.15s ease, opacity 0.15s ease' } : undefined}
            />
          );
        })}
        {live && (
          <>
            <text x={CX} y={CY + 16} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
              {required} votos para mayoría
            </text>
            <ChoriVendor />
          </>
        )}
      </svg>
    </div>
  );
}
