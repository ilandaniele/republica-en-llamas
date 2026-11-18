import { describe, expect, it } from 'vitest';
import { findEnvProblems, type Env } from '../env.js';

const validEnv = {
  DB: {},
  ASSETS: {},
  BETTER_AUTH_SECRET: 'test-secret-with-enough-entropy-0123456789abcdef',
  WEB_URL: 'https://game.test',
} as unknown as Env;

describe('env validation', () => {
  it('accepts a complete env', () => {
    expect(findEnvProblems(validEnv)).toEqual([]);
  });

  it('allows http only on localhost', () => {
    expect(findEnvProblems({ ...validEnv, WEB_URL: 'http://localhost:8787' })).toEqual([]);
    expect(findEnvProblems({ ...validEnv, WEB_URL: 'http://game.test' })).toHaveLength(1);
  });

  it('reports every problem of a bad env', () => {
    const badEnv = {
      ...validEnv,
      BETTER_AUTH_SECRET: 'short',
      WEB_URL: 'not a url',
      DB: undefined,
    } as unknown as Env;
    expect(findEnvProblems(badEnv).join('; ')).toMatch(/DB binding is missing.*BETTER_AUTH_SECRET.*WEB_URL/);
  });

  it('requires paired secrets together', () => {
    expect(findEnvProblems({ ...validEnv, STRIPE_SECRET_KEY: 'sk_test_x' })).toEqual([
      'STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET must be set together',
    ]);
  });
});
