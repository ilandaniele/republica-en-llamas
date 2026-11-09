import type { CareerOffice } from '@republica/game-engine';

export function CareerOfficeScene({ office }: { office: CareerOffice }) {
  const floors = office === 'mayor' ? 2 : 3;
  return (
    <svg
      viewBox="0 0 160 70"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      role="img"
      aria-label={
        office === 'mayor'
          ? 'Municipalidad'
          : office === 'governor'
            ? 'Gobernación provincial'
            : 'Ministerio nacional'
      }
      className="w-full"
      style={{ maxHeight: 230 }}
    >
      <rect width={160} height={70} fill="#7fb8e0" />
      <rect y={58} width={160} height={12} fill="#4a7c3f" />
      <rect x={20} y={20} width={120} height={38} fill="#f4f4f0" />
      <rect x={16} y={17} width={128} height={4} fill="#2e6da4" />
      {office === 'governor' && (
        <g fill="#74acdf">
          <rect x={61} y={10} width={38} height={7} />
          <rect x={69} y={6} width={22} height={4} />
          <rect x={76} y={3} width={8} height={3} />
        </g>
      )}
      {office === 'minister' && (
        <g fill="#74acdf">
          <rect x={50} y={5} width={60} height={12} />
          <rect x={54} y={8} width={52} height={2} fill="#0d1b2a" />
        </g>
      )}
      {Array.from({ length: floors }, (_, row) =>
        Array.from({ length: 12 }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={25 + col * 9}
            y={25 + row * 10}
            width={4}
            height={6}
            fill="#1e3a5f"
          />
        )),
      )}
      <rect x={74} y={45} width={12} height={13} fill="#0d1b2a" />
      <rect x={68} y={58} width={24} height={4} fill="#888888" />
      <rect x={12} y={12} width={1} height={46} fill="#f4f4f0" />
      <rect x={13} y={12} width={14} height={3} fill="#74acdf" />
      <rect x={13} y={15} width={14} height={3} fill="#f4f4f0" />
      <rect x={13} y={18} width={14} height={3} fill="#74acdf" />
      {[39, 112].map((x) => (
        <g key={x}>
          <rect x={x} y={54} width={3} height={10} fill="#0d1b2a" />
          <rect x={x} y={50} width={3} height={4} fill="#c8960c" />
          <rect x={x - 1} y={54} width={5} height={5} fill="#74acdf" />
        </g>
      ))}
    </svg>
  );
}
