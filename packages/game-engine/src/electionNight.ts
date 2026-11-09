import type { GameState } from './types.js';
import { calculateElectionResult } from './congress.js';
import { canonicalPresident, PRESIDENT_IDS } from './presidents.js';
import { PARTIES, partyForPresident, type PartyId } from './parties.js';
import { clamp, createRng } from './utils.js';

export const ELECTION_PARTIES = Object.keys(PARTIES) as PartyId[];
export const ELECTION_COUNT_STEPS = 12;
export const ELECTION_DISTRICTS = [
  ['02', 'Ciudad Autónoma de Buenos Aires', 65],
  ['06', 'Buenos Aires', 370],
  ['10', 'Catamarca', 8],
  ['14', 'Córdoba', 75],
  ['18', 'Corrientes', 24],
  ['22', 'Chaco', 24],
  ['26', 'Chubut', 13],
  ['30', 'Entre Ríos', 28],
  ['34', 'Formosa', 12],
  ['38', 'Jujuy', 16],
  ['42', 'La Pampa', 8],
  ['46', 'La Rioja', 8],
  ['50', 'Mendoza', 40],
  ['54', 'Misiones', 26],
  ['58', 'Neuquén', 15],
  ['62', 'Río Negro', 16],
  ['66', 'Salta', 30],
  ['70', 'San Juan', 16],
  ['74', 'San Luis', 11],
  ['78', 'Santa Cruz', 8],
  ['82', 'Santa Fe', 75],
  ['86', 'Santiago del Estero', 20],
  ['90', 'Tucumán', 35],
  ['94', 'Tierra del Fuego, Antártida e Islas del Atlántico Sur', 4],
] as const;

export type PartyVotes = Record<PartyId, number>;
export interface DistrictCount {
  id: string;
  name: string;
  votes: PartyVotes;
  counted: number;
  total: number;
  leader: PartyId | null;
}
export interface ElectionCountFrame {
  step: number;
  districts: DistrictCount[];
  votes: PartyVotes;
  counted: number;
  total: number;
  leader: PartyId | null;
}
export interface ElectionNight {
  playerParty: PartyId;
  winner: PartyId;
  contenders: { party: PartyId; presidentId: string }[];
  frames: ElectionCountFrame[];
}

function emptyVotes(): PartyVotes {
  return Object.fromEntries(ELECTION_PARTIES.map((party) => [party, 0])) as PartyVotes;
}

function sumVotes(votes: PartyVotes): number {
  return ELECTION_PARTIES.reduce((sum, party) => sum + votes[party], 0);
}

export function electionLeader(votes: PartyVotes): PartyId | null {
  const ordered = [...ELECTION_PARTIES].sort((a, b) => votes[b] - votes[a]);
  return votes[ordered[0]!] > votes[ordered[1]!] ? ordered[0]! : null;
}

function totals(districts: DistrictCount[]): PartyVotes {
  const result = emptyVotes();
  for (const district of districts)
    for (const party of ELECTION_PARTIES) result[party] += district.votes[party];
  return result;
}

function finalDistricts(state: GameState, winner: PartyId, runner: PartyId): DistrictCount[] {
  const rng = createRng(state.seed + 49031);
  const strength = Math.min(Math.abs(calculateElectionResult(state).marginPercent), 30) / 500;
  return ELECTION_DISTRICTS.map(([id, name, weight], index) => {
    const total = weight * 10000;
    const regionalParty = ELECTION_PARTIES[Math.floor(rng() * ELECTION_PARTIES.length)]!;
    const scores = ELECTION_PARTIES.map((party) => {
      const base = party === winner ? 0.48 + strength : party === runner ? 0.32 - strength : 0.2 / 3;
      const regional = index % 6 === 3 && party === regionalParty ? 0.65 : 0;
      return Math.max(0.01, base + (rng() - 0.5) * 0.24 + regional);
    });
    const scoreSum = scores.reduce((sum, value) => sum + value, 0);
    const votes = emptyVotes();
    let remaining = total;
    ELECTION_PARTIES.forEach((party, partyIndex) => {
      votes[party] =
        partyIndex === ELECTION_PARTIES.length - 1
          ? remaining
          : Math.floor((total * scores[partyIndex]!) / scoreSum);
      remaining -= votes[party];
    });
    return { id, name, votes, total, counted: total, leader: electionLeader(votes) };
  });
}

function ensureWinner(districts: DistrictCount[], winner: PartyId): DistrictCount[] {
  const aggregate = totals(districts);
  const highest = [...ELECTION_PARTIES].sort((a, b) => aggregate[b] - aggregate[a])[0]!;
  const corrected = districts.map((district) => {
    const votes = { ...district.votes };
    [votes[winner], votes[highest]] = [votes[highest], votes[winner]];
    return { ...district, votes, leader: electionLeader(votes) };
  });
  if (electionLeader(totals(corrected)) !== winner) {
    const donor = ELECTION_PARTIES.find(
      (party) => party !== winner && aggregate[party] === aggregate[highest],
    )!;
    corrected[0]!.votes[donor] -= 1;
    corrected[0]!.votes[winner] += 1;
    corrected[0]!.leader = electionLeader(corrected[0]!.votes);
  }
  return corrected;
}

function countFrame(final: DistrictCount[], step: number, seed: number): ElectionCountFrame {
  const districts = final.map((district, index) => {
    const rng = createRng(seed + Number(district.id) * 997);
    const delay = Math.floor(rng() * 4);
    const progress = clamp((step - delay) / (ELECTION_COUNT_STEPS - delay), 0, 1);
    const ordered = [...ELECTION_PARTIES].sort((a, b) => district.votes[b] - district.votes[a]);
    const votes = emptyVotes();
    for (const party of ELECTION_PARTIES) {
      const exponent = index % 3 === 0 && party === ordered[0] ? 1.65 : party === ordered[1] ? 0.65 : 1.1;
      votes[party] = Math.floor(district.votes[party] * progress ** exponent);
    }
    return { ...district, votes, counted: sumVotes(votes), leader: electionLeader(votes) };
  });
  const votes = totals(districts);
  return {
    step,
    districts,
    votes,
    counted: sumVotes(votes),
    total: final.reduce((sum, district) => sum + district.total, 0),
    leader: electionLeader(votes),
  };
}

export function getElectionNight(state: GameState): ElectionNight {
  const playerId = canonicalPresident(state.presidentId) ?? 'milei';
  const playerParty = partyForPresident(playerId) ?? 'libertario';
  const rivals = [...(state.debate?.candidates ?? PRESIDENT_IDS)]
    .filter((id) => partyForPresident(id) !== playerParty)
    .sort((a, b) => (state.debate?.scores[b] ?? 0) - (state.debate?.scores[a] ?? 0));
  const rivalId = rivals[0] ?? PRESIDENT_IDS.find((id) => partyForPresident(id) !== playerParty)!;
  const rivalParty = partyForPresident(rivalId)!;
  const won = calculateElectionResult(state).won;
  const winner = won ? playerParty : rivalParty;
  const final = ensureWinner(finalDistricts(state, winner, won ? rivalParty : playerParty), winner);
  return {
    playerParty,
    winner,
    contenders: ELECTION_PARTIES.map((party) => ({
      party,
      presidentId:
        party === playerParty
          ? playerId
          : (rivals.find((id) => partyForPresident(id) === party) ??
            PRESIDENT_IDS.find((id) => partyForPresident(id) === party)!),
    })),
    frames: Array.from({ length: ELECTION_COUNT_STEPS + 1 }, (_, step) =>
      countFrame(final, step, state.seed),
    ),
  };
}
