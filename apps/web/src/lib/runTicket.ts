import { apiSend, isOfflineMode } from './api.js';
import { authClient } from './auth.js';
import { isPlaytestMode } from './playtest.js';

export interface RunTicket {
  id: string;
  seed: number;
}

// Guests get an anonymous session so their seed is server-issued too; offline games keep a local seed.
async function ensureSession(): Promise<boolean> {
  const { data: session } = await authClient.getSession();
  if (session) return true;
  const { data, error } = await authClient.signIn.anonymous();
  return !error && data !== null;
}

export async function requestRunTicket(): Promise<RunTicket | null> {
  try {
    if (isPlaytestMode || isOfflineMode || !(await ensureSession())) return null;
    const data = await apiSend<{ ticketId?: unknown; seed?: unknown }>('start-run', {});
    if (typeof data.ticketId !== 'string' || !Number.isSafeInteger(data.seed) || (data.seed as number) < 0)
      return null;
    return { id: data.ticketId, seed: data.seed as number };
  } catch {
    return null;
  }
}
