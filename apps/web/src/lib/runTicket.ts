import { ApiError, apiSend, isOfflineMode } from './api.js';
import { authClient } from './auth.js';
import { isPlaytestMode } from './playtest.js';

export interface RunTicket {
  id: string;
  seed: number;
}

const RUN_TICKET_ERRORS = ['daily_cap', 'rate_limit', 'network', 'unavailable'] as const;

export type RunTicketError = (typeof RUN_TICKET_ERRORS)[number];

export function parseRunTicketError(value: unknown): RunTicketError | null {
  return RUN_TICKET_ERRORS.includes(value as RunTicketError) ? (value as RunTicketError) : null;
}

export type RunTicketResult =
  { ticket: RunTicket; error: null } | { ticket: null; error: RunTicketError | null };

const LOCAL_ONLY: RunTicketResult = { ticket: null, error: null };

// Guests get an anonymous session so their seed is server-issued too; offline games keep a local seed.
async function ensureSession(): Promise<boolean> {
  const { data: session } = await authClient.getSession();
  if (session) return true;
  const { data, error } = await authClient.signIn.anonymous();
  return !error && data !== null;
}

function classifyFailure(error: unknown): RunTicketError {
  if (!(error instanceof ApiError)) return 'network';
  if (error.status !== 429) return 'unavailable';
  return error.message.includes('Daily run limit') ? 'daily_cap' : 'rate_limit';
}

function failure(error: RunTicketError): RunTicketResult {
  return { ticket: null, error };
}

export async function requestRunTicket(daily = false): Promise<RunTicketResult> {
  if (isPlaytestMode || isOfflineMode) return LOCAL_ONLY;
  try {
    if (!(await ensureSession())) return failure('network');
    const data = await apiSend<{ ticketId?: unknown; seed?: unknown }>(
      daily ? 'start-run?daily=1' : 'start-run',
      {},
    );
    if (typeof data.ticketId !== 'string' || !Number.isSafeInteger(data.seed) || (data.seed as number) < 0)
      return failure('unavailable');
    return { ticket: { id: data.ticketId, seed: data.seed as number }, error: null };
  } catch (error) {
    return failure(classifyFailure(error));
  }
}
