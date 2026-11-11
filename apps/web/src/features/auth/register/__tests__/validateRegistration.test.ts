import { describe, expect, it } from 'vitest';
import { validateRegistration } from '../validateRegistration.js';

const valid = { username: 'jugador_1', password: 'password123', usernameAvailable: true };

describe('validateRegistration', () => {
  it('accepts a valid form', () => {
    expect(validateRegistration(valid)).toBeNull();
  });

  it.each(['a'.repeat(25), 'bad name', '<script>', 'ali​ce'])('rejects the username %j', (username) => {
    expect(validateRegistration({ ...valid, username })).toMatch(/hasta 24 letras/);
  });

  it('accepts accented names', () => {
    expect(validateRegistration({ ...valid, username: 'Peñarol.ñ' })).toBeNull();
  });
});
