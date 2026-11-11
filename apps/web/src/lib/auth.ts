import { createAuthClient } from 'better-auth/react';
import { anonymousClient } from 'better-auth/client/plugins';
import { apiGet, apiSend, isOfflineMode } from './api.js';

export const authClient = createAuthClient({ plugins: [anonymousClient()] });

const AUTH_ERRORS: [string, string][] = [
  ['Invalid email or password', 'Email o contraseña incorrectos'],
  ['User already exists', 'Este email ya tiene una cuenta'],
  ['Invalid email', 'Email inválido'],
  ['Password too short', 'La contraseña debe tener al menos 8 caracteres'],
  ['Email not verified', 'Confirmá tu email antes de ingresar'],
  ['Username taken', 'Ese nombre de usuario ya está ocupado'],
  ['Failed to fetch', 'Error de conexión. Revisá tu internet.'],
];

export function translateAuthError(message: string): string {
  return (
    AUTH_ERRORS.find(([match]) => message.includes(match))?.[1] ??
    'No se pudo completar la operación. Intentá de nuevo.'
  );
}

export function signIn(email: string, password: string, rememberMe = true) {
  return authClient.signIn.email({ email, password, rememberMe });
}

export function saveUsername(username: string) {
  return apiSend<{ username: string }>('profile', { username: username.trim() }, 'PATCH');
}

export async function signUp(email: string, password: string, username: string) {
  const result = await authClient.signUp.email({ email, password, name: username.trim() });
  if (!result.error) await saveUsername(username).catch(() => undefined);
  return result;
}

export function signOut() {
  return authClient.signOut();
}

export function signInWithGoogle() {
  return authClient.signIn.social({ provider: 'google', callbackURL: '/' });
}

export function requestPasswordReset(email: string) {
  return authClient.requestPasswordReset({ email, redirectTo: '/reset-password' });
}

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  if (isOfflineMode) return true;
  const params = new URLSearchParams({ name: username });
  return apiGet<{ available: boolean }>(`username-available?${params.toString()}`)
    .then((result) => result.available)
    .catch(() => true);
}
