import { describe, expect, it } from 'vitest';
import { ApiClient, PASSWORD, signInAsGuest, signUp, uniqueEmail } from './client.js';

describe('health', () => {
  it('answers ok after querying D1', async () => {
    const response = await new ApiClient().request('/api/health');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
  });
});

describe('guest sign-in', () => {
  it('creates an anonymous session that can start runs but not save them', async () => {
    const guest = await signInAsGuest();
    expect(guest.cookieNames.some((name) => name.endsWith('session_token'))).toBe(true);

    expect(await guest.json('/api/profile')).toEqual({ status: 200, body: { username: null } });

    const ticket = await guest.json<{ ticketId: string }>('/api/start-run', { body: {} });
    expect(ticket.status).toBe(200);

    const submit = await guest.request('/api/submit-run', { body: { ticketId: ticket.body.ticketId } });
    expect(submit.status).toBe(403);
    expect(await submit.json()).toEqual({ error: 'Sign in to save runs' });

    const rename = await guest.request('/api/profile', { method: 'PATCH', body: { username: 'guest_name' } });
    expect(rename.status).toBe(403);
  });

  it('rejects session endpoints without a session', async () => {
    expect((await new ApiClient().request('/api/profile')).status).toBe(401);
    expect((await new ApiClient().request('/api/runs')).status).toBe(401);
  });
});

describe('email accounts', () => {
  it('signs up, signs out and signs back in with a session cookie', async () => {
    const email = uniqueEmail();
    const client = await signUp(new ApiClient(), email);
    const generated = await client.json<{ username: string }>('/api/profile');
    expect(generated.status).toBe(200);
    expect(generated.body.username).toMatch(/^jugador_[0-9a-f]{10}$/);

    expect((await client.request('/api/auth/sign-out', { body: {} })).status).toBe(200);
    expect((await client.request('/api/profile')).status).toBe(401);

    const wrong = await client.request('/api/auth/sign-in/email', {
      body: { email, password: 'wrong-password' },
    });
    expect(wrong.status).toBe(401);

    const signIn = await client.request('/api/auth/sign-in/email', { body: { email, password: PASSWORD } });
    expect(signIn.status).toBe(200);
    expect(await client.json('/api/profile')).toEqual(generated);
  });

  it('rejects a duplicate email sign-up', async () => {
    const email = uniqueEmail();
    await signUp(new ApiClient(), email);
    const again = await new ApiClient().request('/api/auth/sign-up/email', {
      body: { email, password: PASSWORD, name: 'Again' },
    });
    expect(again.status).toBeGreaterThanOrEqual(400);
    expect(again.status).toBeLessThan(500);
  });
});

describe('profile', () => {
  it('updates the username and reports availability', async () => {
    const client = await signUp();
    const username = `int_${crypto.randomUUID().slice(0, 8)}`;
    const availability = `/api/username-available?name=${username}`;

    expect(await client.json(availability)).toEqual({ status: 200, body: { available: true } });
    expect(await client.json('/api/profile', { method: 'PATCH', body: { username } })).toEqual({
      status: 200,
      body: { username },
    });
    expect(await client.json('/api/profile')).toEqual({ status: 200, body: { username } });
    expect(await new ApiClient().json(availability)).toEqual({ status: 200, body: { available: false } });

    const other = await signUp();
    expect((await other.request('/api/profile', { method: 'PATCH', body: { username } })).status).toBe(409);
    expect((await other.request('/api/profile', { method: 'PATCH', body: { username: 'x' } })).status).toBe(
      400,
    );
  });

  it('treats invalid names as unavailable', async () => {
    expect(await new ApiClient().json('/api/username-available?name=a%20b')).toEqual({
      status: 200,
      body: { available: false },
    });
  });
});
