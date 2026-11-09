import { describe, expect, it } from 'vitest';
import { initGame } from '../gameLoop.js';
import { getElectionNight, ELECTION_PARTIES, ELECTION_COUNT_STEPS } from '../electionNight.js';
import { PRESIDENT_IDS } from '../presidents.js';
import { partyForPresident } from '../parties.js';

describe('presidential election night', () => {
  it.each(PRESIDENT_IDS)('ends with the real engine outcome for %s in both win and loss', (president) => {
    const initial = { ...initGame('normal', 42, 'es', undefined, president), turn: 40 };
    for (const won of [true, false]) {
      const state = {
        ...initial,
        political: { ...initial.political, popularity: won ? 70 : 25 },
        economic: { ...initial.economic, marketConfidence: 70 },
      };
      const before = structuredClone(state);
      const night = getElectionNight(state);
      const final = night.frames.at(-1)!;
      expect(night.frames).toHaveLength(ELECTION_COUNT_STEPS + 1);
      expect(final.leader).toBe(night.winner);
      expect(night.winner === partyForPresident(president)).toBe(won);
      expect(final.counted).toBe(final.total);
      expect(final.districts).toHaveLength(24);
      expect(new Set(final.districts.map((district) => district.id)).size).toBe(24);
      expect(night.contenders).toHaveLength(5);
      expect(
        night.contenders.every((contender) => partyForPresident(contender.presidentId) === contender.party),
      ).toBe(true);
      expect(state).toEqual(before);
    }
  });

  it('counts only nonnegative integer votes without losing votes when a district changes color', () => {
    const night = getElectionNight({ ...initGame('normal', 42), turn: 40 });
    expect(night.frames[0]!.counted).toBe(0);
    expect(night.frames[0]!.districts.every((district) => district.leader === null)).toBe(true);
    for (const [index, frame] of night.frames.entries()) {
      expect(frame.counted).toBe(frame.districts.reduce((sum, district) => sum + district.counted, 0));
      expect(frame.counted).toBe(ELECTION_PARTIES.reduce((sum, party) => sum + frame.votes[party], 0));
      for (const [districtIndex, district] of frame.districts.entries()) {
        expect(district.counted).toBeLessThanOrEqual(district.total);
        expect(district.counted).toBe(
          ELECTION_PARTIES.reduce((sum, party) => sum + district.votes[party], 0),
        );
        for (const party of ELECTION_PARTIES) {
          expect(Number.isInteger(district.votes[party])).toBe(true);
          expect(district.votes[party]).toBeGreaterThanOrEqual(0);
          if (index)
            expect(district.votes[party]).toBeGreaterThanOrEqual(
              night.frames[index - 1]!.districts[districtIndex]!.votes[party],
            );
        }
      }
    }
    const final = night.frames.at(-1)!;
    expect(
      night.frames.some((frame) =>
        frame.districts.some(
          (district, index) => district.leader && district.leader !== final.districts[index]!.leader,
        ),
      ),
    ).toBe(true);
  });

  it('reproduces the same returns after refresh and varies geographic results by seed', () => {
    const state = { ...initGame('normal', 117), turn: 40 };
    expect(getElectionNight(state)).toEqual(getElectionNight(structuredClone(state)));
    expect(getElectionNight(state).frames.at(-1)!.votes).not.toEqual(
      getElectionNight({ ...state, seed: 118 }).frames.at(-1)!.votes,
    );
  });

  it('selects an opposing party even when every debate participant shares the player party', () => {
    const state = { ...initGame('normal', 42, 'es', undefined, 'massa'), turn: 40 };
    const night = getElectionNight({
      ...state,
      political: { ...state.political, popularity: 20 },
      debate: {
        playerId: 'massa',
        candidates: ['massa', 'cristina', 'nestor', 'grabois'],
        scores: {},
        rounds: [],
        scoreBonus: 0,
      },
    });
    expect(night.winner).not.toBe('peronista');
    expect(night.frames.at(-1)!.leader).toBe(night.winner);
  });
});
