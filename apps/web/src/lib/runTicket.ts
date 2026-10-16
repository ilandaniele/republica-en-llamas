import { supabase, isOfflineMode } from './supabase.js';

export interface RunTicket {
  id: string;
  seed: number;
}

// Only runs started with a server-issued seed can be saved; guests and offline games keep a local seed.
export async function requestRunTicket(): Promise<RunTicket | null> {
  if (isOfflineMode) return null;
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) return null;
  const { data, error } = await supabase.functions.invoke<RunTicket>('start-run');
  if (error || !data) return null;
  return data;
}
