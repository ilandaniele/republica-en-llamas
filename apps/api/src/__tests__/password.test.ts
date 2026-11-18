import { hashPassword as hashLegacyScrypt } from 'better-auth/crypto';
import { describe, expect, it } from 'vitest';
import { hashPassword, PBKDF2_ITERATIONS, verifyPassword } from '../password.js';

describe('password hashing', () => {
  it('hashes with salted PBKDF2 and verifies the right password only', async () => {
    const hash = await hashPassword('correct horse battery');

    expect(hash.startsWith(`pbkdf2_sha256$${PBKDF2_ITERATIONS}$`)).toBe(true);
    expect(await hashPassword('correct horse battery')).not.toBe(hash);
    expect(await verifyPassword({ hash, password: 'correct horse battery' })).toBe(true);
    expect(await verifyPassword({ hash, password: 'wrong horse battery' })).toBe(false);
  });

  it('uses the iteration count stored in the hash', async () => {
    const hash = (await hashPassword('secret-password')).replace(`$${PBKDF2_ITERATIONS}$`, '$1000$');

    expect(await verifyPassword({ hash, password: 'secret-password' })).toBe(false);
  });

  it('still verifies legacy scrypt hashes', async () => {
    const hash = await hashLegacyScrypt('legacy-password');

    expect(await verifyPassword({ hash, password: 'legacy-password' })).toBe(true);
    expect(await verifyPassword({ hash, password: 'other-password' })).toBe(false);
  });

  it('rejects malformed PBKDF2 hashes', async () => {
    expect(await verifyPassword({ hash: 'pbkdf2_sha256$abc$$', password: 'x' })).toBe(false);
  });
});
