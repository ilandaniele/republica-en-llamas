import { describe, expect, it } from 'vitest';
import { ApiClient, PASSWORD, signUp, uniqueEmail } from './client.js';

const EVIL_ORIGIN = 'https://evil.test';

describe('origin check', () => {
  it('rejects cross-origin writes on API and auth routes', async () => {
    const client = await signUp();
    const start = await client.request('/api/start-run', { body: {}, headers: { origin: EVIL_ORIGIN } });
    expect(start.status).toBe(403);
    expect(await start.json()).toEqual({ error: 'Origin not allowed' });

    const signUpAttempt = await new ApiClient().request('/api/auth/sign-up/email', {
      body: { email: uniqueEmail(), password: PASSWORD, name: 'Evil' },
      headers: { origin: EVIL_ORIGIN },
    });
    expect(signUpAttempt.status).toBe(403);
  });

  it('allows cross-origin reads', async () => {
    const response = await new ApiClient().request('/api/leaderboard', { headers: { origin: EVIL_ORIGIN } });
    expect(response.status).toBe(200);
  });
});

describe('body size limit', () => {
  it('rejects oversized API bodies before authentication', async () => {
    const response = await new ApiClient().request('/api/profile', {
      method: 'PATCH',
      rawBody: JSON.stringify({ username: 'x'.repeat(5000) }),
      headers: { 'content-type': 'application/json' },
    });
    expect(response.status).toBe(413);
  });

  it('rejects oversized auth bodies', async () => {
    const response = await new ApiClient().request('/api/auth/sign-in/email', {
      body: { email: uniqueEmail(), password: 'x'.repeat(5000) },
    });
    expect(response.status).toBe(413);
  });

  it('caps submit-run bodies below the route transport limit', async () => {
    const client = await signUp();
    const response = await client.request('/api/submit-run', { body: { padding: 'x'.repeat(70_000) } });
    expect(response.status).toBe(413);
  });
});

describe('IP rate limit', () => {
  it('returns 429 with Retry-After once an IP exceeds the per-minute budget', async () => {
    const client = new ApiClient();
    let limited: Response | undefined;
    for (let i = 0; i < 245 && !limited; i++) {
      const response = await client.request('/api/username-available?name=someone');
      if (response.status === 429) limited = response;
      else expect(response.status).toBe(200);
    }
    expect(limited?.status).toBe(429);
    expect(Number(limited?.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect((await new ApiClient().request('/api/username-available?name=someone')).status).toBe(200);
  });
});

describe('unknown routes', () => {
  it('answers 404 for unknown API paths', async () => {
    expect((await new ApiClient().request('/api/nope')).status).toBe(404);
  });
});
