import { afterEach, describe, expect, it, vi } from 'vitest';
import { browserStorage } from '../browserStorage.js';

afterEach(() => vi.restoreAllMocks());

describe('browser storage availability', () => {
  it('keeps reads and writes from crashing when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(browserStorage.getItem('key')).toBeNull();
    expect(() => browserStorage.setItem('key', 'value')).not.toThrow();
    expect(() => browserStorage.removeItem('key')).not.toThrow();
  });
});
