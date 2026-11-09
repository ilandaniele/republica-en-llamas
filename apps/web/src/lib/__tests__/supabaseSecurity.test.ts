import { beforeEach, describe, expect, it, vi } from 'vitest';

const signInWithPassword = vi.hoisted(() => vi.fn());
const onAuthStateChange = vi.hoisted(() => vi.fn());
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({ auth: { signInWithPassword, onAuthStateChange } }),
}));
import { isPasswordRecovery, signIn, translateAuthError } from '../supabase.js';
import { authStorage } from '../authStorage.js';
const authEventListener = onAuthStateChange.mock.calls[0]?.[0];

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
});

describe('auth boundary', () => {
  it('captures recovery events before the interface subscribes and clears them on logout', () => {
    const callback = authEventListener;
    expect(callback).toBeDefined();
    callback('PASSWORD_RECOVERY', { user: { id: 'recovery-user' } });
    expect(isPasswordRecovery('recovery-user')).toBe(true);
    expect(isPasswordRecovery('different-user')).toBe(false);
    callback('SIGNED_OUT', null);
    expect(isPasswordRecovery('recovery-user')).toBe(false);
  });
  it('does not return unknown server details to the interface', () => {
    const detail = 'SQLSTATE 42P01 private_schema.users query failed';
    expect(translateAuthError(detail)).not.toContain(detail);
    expect(translateAuthError(detail)).toBe('No se pudo completar la operación. Intentá de nuevo.');
  });

  it('keeps useful credential errors generic', () => {
    expect(translateAuthError('Invalid login credentials')).toBe('Email o contraseña incorrectos');
  });

  it('applies the requested persistence before the SDK writes a login session', async () => {
    signInWithPassword.mockImplementation(async () => {
      authStorage.setItem('auth-key', 'fixture-session');
      return { error: null };
    });
    await signIn('player@example.test', 'fixture-password', false);
    expect(localStorage.getItem('auth-key')).toBeNull();
    expect(sessionStorage.getItem('auth-key')).toBe('fixture-session');
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'player@example.test',
      password: 'fixture-password',
    });
  });
});
