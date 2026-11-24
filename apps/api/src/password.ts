import { verifyPassword as verifyLegacyScrypt } from 'better-auth/crypto';

export const PBKDF2_ITERATIONS = 50_000;
const PREFIX = 'pbkdf2_sha256';
const SALT_BYTES = 16;
const KEY_BITS = 256;

const encoder = new TextEncoder();

function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password.normalize('NFKC')),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  a.forEach((byte, index) => {
    diff |= byte ^ (b[index] ?? 0);
  });
  return diff === 0;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const hash = await derive(password, salt, PBKDF2_ITERATIONS);
  return `${PREFIX}$${PBKDF2_ITERATIONS}$${toBase64(salt)}$${toBase64(hash)}`;
}

export async function verifyPassword({
  hash,
  password,
}: {
  hash: string;
  password: string;
}): Promise<boolean> {
  const [prefix, iterations, salt, expected] = hash.split('$');
  if (prefix !== PREFIX) return verifyLegacyScrypt({ hash, password });
  const count = Number(iterations);
  if (!Number.isSafeInteger(count) || count < 1 || !salt || !expected) return false;
  const actual = await derive(password, fromBase64(salt), count);
  return constantTimeEqual(actual, fromBase64(expected));
}
