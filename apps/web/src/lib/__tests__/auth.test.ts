import { describe, expect, it } from 'vitest';
import { translateAuthError } from '../auth.js';

describe('translateAuthError', () => {
  it('does not reveal that an email is already registered', () => {
    const message = translateAuthError('User already exists. Use another email.');
    expect(message).not.toMatch(/email/i);
    expect(message).toMatch(/iniciá sesión/);
  });

  it('falls back to a generic message', () => {
    expect(translateAuthError('unexpected')).toBe('No se pudo completar la operación. Intentá de nuevo.');
  });
});
