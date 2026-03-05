import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined;

const MISSING_URL = !supabaseUrl || supabaseUrl.includes('your_project') || supabaseUrl.includes('placeholder');
const MISSING_KEY = !supabaseAnonKey || supabaseAnonKey.includes('your_anon') || supabaseAnonKey.includes('placeholder');

export const isOfflineMode = MISSING_URL || MISSING_KEY;
export const missingEnvVars = {
  url: MISSING_URL,
  key: MISSING_KEY,
};

if (isOfflineMode) {
  console.warn(
    '[República en Llamas] Modo offline activo.\n' +
    (MISSING_URL ? '  ⚠ Falta VITE_SUPABASE_URL en .env\n' : '') +
    (MISSING_KEY ? '  ⚠ Falta VITE_SUPABASE_ANON_KEY en .env\n' : '') +
    '  El progreso se guarda en localStorage.'
  );
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder_key'
);

/** Translate Supabase error messages to Spanish */
export function translateAuthError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Email o contraseña incorrectos';
  if (message.includes('User already registered')) return 'Este email ya tiene una cuenta';
  if (message.includes('Invalid email')) return 'Email inválido';
  if (message.includes('Email not confirmed')) return 'Confirmá tu email antes de ingresar';
  if (message.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres';
  if (message.includes('Unable to validate email address')) return 'Email inválido';
  if (message.includes('duplicate key')) return 'Ese nombre de usuario ya está ocupado';
  if (message.includes('Network')) return 'Error de conexión. Revisá tu internet.';
  return message;
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string, username: string) {
  return supabase.auth.signUp({ email, password, options: { data: { username } } });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
}

/**
 * Ensure a profile row exists for OAuth users (upsert on first login).
 * Call this inside onAuthStateChange when provider === 'google'.
 */
export async function ensureProfile(userId: string, email: string) {
  if (isOfflineMode) return;
  const username = email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '_') ?? 'jugador';
  await supabase.from('profiles').upsert(
    { id: userId, username, country: '', avatar_url: null },
    { onConflict: 'id', ignoreDuplicates: true }
  );
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  if (isOfflineMode) return true;
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  return data === null;
}

export type Tables = {
  profiles: {
    id: string;
    username: string;
    country: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
  };
  game_runs: {
    id: string;
    user_id: string;
    difficulty: 'easy' | 'normal' | 'hard' | 'crisis';
    seed: number;
    score: number;
    turns_survived: number;
    game_over_reason: string | null;
    is_win: boolean;
    final_state: unknown;
    language: string;
    created_at: string;
    completed_at: string | null;
  };
  run_events: {
    id: string;
    run_id: string;
    turn_number: number;
    card_id: string;
    choice_index: number;
    negotiation: string | null;
    effects_json: unknown;
    state_snapshot: unknown;
    created_at: string;
  };
};
