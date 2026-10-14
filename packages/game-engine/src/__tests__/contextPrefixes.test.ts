import { describe, expect, it } from 'vitest';
import { getContextPrefix } from '../contextPrefixes.js';
import { createRng } from '../utils.js';

describe('getContextPrefix', () => {
  it('returns null when the category does not change', () => {
    expect(getContextPrefix('crisis', 'crisis', createRng(1))).toBeNull();
    expect(getContextPrefix(null, 'crisis', createRng(1))).toBeNull();
  });

  it('is deterministic for the same seed', () => {
    const first = getContextPrefix('economic', 'crisis', createRng(42));
    const second = getContextPrefix('economic', 'crisis', createRng(42));
    expect(first).not.toBeNull();
    expect(first).toBe(second);
  });
});
