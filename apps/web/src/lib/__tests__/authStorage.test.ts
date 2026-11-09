import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.resetModules();
});
afterEach(() => vi.restoreAllMocks());

describe('authentication persistence choice', () => {
  it('keeps the existing persistent behavior when remember is selected', async () => {
    const { authStorage } = await import('../authStorage.js');
    authStorage.setItem('auth-key', 'session');
    expect(localStorage.getItem('auth-key')).toBe('session');
    expect(sessionStorage.getItem('auth-key')).toBeNull();
  });

  it('stores an unchecked session only in this tab and removes the persistent copy', async () => {
    const { authStorage, setRememberSession } = await import('../authStorage.js');
    localStorage.setItem('auth-key', 'old-session');
    setRememberSession(false);
    authStorage.setItem('auth-key', 'tab-session');
    expect(localStorage.getItem('auth-key')).toBeNull();
    expect(sessionStorage.getItem('auth-key')).toBe('tab-session');
    expect(authStorage.getItem('auth-key')).toBe('tab-session');
  });

  it('does not fall back to a persistent token for an unchecked session', async () => {
    localStorage.setItem('rel-remember-session', 'false');
    localStorage.setItem('auth-key', 'old-session');
    const { authStorage } = await import('../authStorage.js');
    expect(authStorage.getItem('auth-key')).toBeNull();
  });

  it('clears both storage locations on sign out', async () => {
    const { authStorage } = await import('../authStorage.js');
    localStorage.setItem('auth-key', 'persistent');
    sessionStorage.setItem('auth-key', 'tab');
    authStorage.removeItem('auth-key');
    expect(localStorage.getItem('auth-key')).toBeNull();
    expect(sessionStorage.getItem('auth-key')).toBeNull();
  });

  it('continues when browser storage is unavailable', async () => {
    for (const method of ['getItem', 'setItem', 'removeItem'] as const)
      vi.spyOn(Storage.prototype, method).mockImplementation(() => {
        throw new Error('blocked');
      });
    const { authStorage, setRememberSession } = await import('../authStorage.js');
    expect(() => setRememberSession(false)).not.toThrow();
    expect(() => authStorage.setItem('auth-key', 'token')).not.toThrow();
    expect(authStorage.getItem('auth-key')).toBeNull();
    expect(() => authStorage.removeItem('auth-key')).not.toThrow();
  });
});
