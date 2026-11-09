import { ELECTION_PARTIES, type DistrictCount } from '@republica/game-engine';

export function votePercent(votes: number, total: number): string {
  return total ? ((votes / total) * 100).toFixed(1) : '0.0';
}

export function districtMargin(district: DistrictCount): number {
  if (!district.counted) return Infinity;
  const votes = ELECTION_PARTIES.map((party) => district.votes[party]).sort((a, b) => b - a);
  return ((votes[0]! - votes[1]!) / district.counted) * 100;
}
