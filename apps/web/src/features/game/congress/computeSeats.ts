import type { GameState } from '@republica/game-engine';
import { CX, CY, ROW_COUNTS, ROW_RADII, VISUAL_SEATS } from './congressData.js';
import type { Seat, SeatBloc } from './congressData.js';

type SeatCounts = Pick<GameState['congress'], 'governmentSeats' | 'oppositionSeats' | 'independentSeats'>;

export function computeSeats(congress: SeatCounts): Seat[] {
  const TOTAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;

  // Visual proportions (257 dots total)
  const visGov = Math.round((VISUAL_SEATS * congress.governmentSeats) / TOTAL);
  const visOpp =
    congress.oppositionSeats > 0 ? Math.round((VISUAL_SEATS * congress.oppositionSeats) / TOTAL) : 0;
  const visInd = VISUAL_SEATS - visGov - visOpp;
  const visHardOpp = Math.round(visOpp * 0.6);
  const visProOpp = visOpp - visHardOpp;

  // Compute raw positions
  const positions: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < ROW_COUNTS.length; row++) {
    const count = ROW_COUNTS[row]!;
    const r = ROW_RADII[row]!;
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * (1 - i / (count - 1));
      positions.push({ x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) });
    }
  }

  // Sort by x to assign blocs left (opposition) → right (government)
  const sorted = positions.map((pos, idx) => ({ ...pos, idx })).sort((a, b) => a.x - b.x);

  // Bloc assignment
  const blocs: SeatBloc[] = [];
  for (let i = 0; i < visHardOpp; i++) blocs.push('hardOpposition');
  for (let i = 0; i < visProOpp; i++) blocs.push('proOpposition');
  for (let i = 0; i < visInd; i++) blocs.push('independent');
  for (let i = 0; i < visGov; i++) blocs.push('government');
  // fill any rounding leftover
  while (blocs.length < VISUAL_SEATS) blocs.push('government');

  const seats: Seat[] = new Array(VISUAL_SEATS);
  sorted.forEach((pos, sortedIdx) => {
    seats[pos.idx] = { x: pos.x, y: pos.y, bloc: blocs[sortedIdx] ?? 'independent', index: pos.idx };
  });
  return seats;
}
