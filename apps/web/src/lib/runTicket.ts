import { supabase, isOfflineMode } from './supabase.js';

export interface RunTicket {
  id: string;
  seed: number;
}

// Guests get an anonymous session so their seed is server-issued too; offline games keep a local seed.
async function ensureSession(): Promise<boolean> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData.session) return true;
  const { data, error } = await supabase.auth.signInAnonymously();
  return !error && data.session !== null;
}

export async function requestRunTicket(): Promise<RunTicket | null> {
  if (isOfflineMode || !(await ensureSession())) return null;
  const { data, error } = await supabase.functions.invoke<RunTicket>('start-run');
  if (error || !data) return null;
  return data;
}

export async function currentAnonymousToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  return session?.user.is_anonymous ? session.access_token : null;
}

export async function claimRunTicket(anonymousToken: string, ticketId: string): Promise<boolean> {
  const { error } = await supabase.functions.invoke('claim-run-ticket', {
    body: { anonymousToken, ticketId },
  });
  return !error;
}
