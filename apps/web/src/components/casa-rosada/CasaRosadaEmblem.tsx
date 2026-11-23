import { Building } from './Building.js';

export function CasaRosadaEmblem({ className }: { className?: string }) {
  return (
    <svg
      viewBox="12 6 136 66"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Casa Rosada"
      className={className}
    >
      <Building sky="day" />
    </svg>
  );
}
