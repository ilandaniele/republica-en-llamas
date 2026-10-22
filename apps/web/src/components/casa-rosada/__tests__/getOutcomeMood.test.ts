import { describe, expect, it } from 'vitest';
import { getOutcomeMood } from '../getOutcomeMood.js';

describe('getOutcomeMood', () => {
  it('flies the president away in a helicopter after an impeachment', () => {
    expect(getOutcomeMood('impeachment')).toMatchObject({
      helicopter: true,
      escape: true,
      crowd: 3,
      sky: 'night',
    });
  });

  it('leaves ruins, a mushroom cloud and graves after a nuclear strike', () => {
    expect(getOutcomeMood('nuclear_annihilation')).toMatchObject({
      ruins: true,
      mushroom: true,
      graves: true,
      crowd: 0,
    });
  });

  it('celebrates a completed term', () => {
    expect(getOutcomeMood('term_complete')).toMatchObject({ celebration: true, fire: false });
  });
});
