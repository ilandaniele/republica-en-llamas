import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';

const apiGet = vi.hoisted(() => vi.fn());
vi.mock('../../lib/api.js', () => ({ apiGet }));
vi.mock('../useAuth.js', () => ({ useAuth: () => ({ user: null }) }));

const { entitlementsQuery } = await import('../useEntitlements.js');

describe('entitlementsQuery', () => {
  it('surfaces a failed fetch instead of caching an empty list', async () => {
    apiGet.mockRejectedValue(new Error('Request failed'));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await expect(client.fetchQuery(entitlementsQuery('alice'))).rejects.toThrow('Request failed');
    expect(client.getQueryData(entitlementsQuery('alice').queryKey)).toBeUndefined();
  });

  it('returns the server entitlements', async () => {
    apiGet.mockResolvedValue({ entitlements: ['presidents_pack'] });
    const client = new QueryClient();
    await expect(client.fetchQuery(entitlementsQuery('alice'))).resolves.toEqual(['presidents_pack']);
  });

  it('is disabled without a user', () => {
    expect(entitlementsQuery(undefined).enabled).toBe(false);
  });
});
