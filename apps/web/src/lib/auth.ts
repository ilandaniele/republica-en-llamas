import { createAuthClient } from 'better-auth/react';
import { anonymousClient } from 'better-auth/client/plugins';
import { ApiError, apiGet, apiSend, isOfflineMode } from './api.js';

export const authClient = createAuthClient({ plugins: [anonymousClient()] });

const USERNAME_NOT_SAVED = 'Username not saved';
const USERNAME_TAKEN_AFTER_SIGN_UP = 'Username not saved: name taken';

const AUTH_ERRORS: [string, string][] = [
  [
    USERNAME_TAKEN_AFTER_SIGN_UP,
    'Tu cuenta se creó, pero ese nombre de usuario ya está ocupado. Elegí otro desde tu perfil.',
  ],
  [
    USERNAME_NOT_SAVED,
    'Tu cuenta se creó, pero no pudimos guardar tu nombre de usuario. Elegilo desde tu perfil.',
  ],
  ['Invalid email or password', 'Email o contraseña incorrectos'],
  ['User already exists', 'No pudimos crear la cuenta con esos datos. Si ya tenés cuenta, iniciá sesión.'],
  ['Invalid email', 'Email inválido'],
  ['Password too short', 'La contraseña debe tener al menos 8 caracteres'],
  ['Email not verified', 'Confirmá tu email antes de ingresar'],
  ['Username taken', 'Ese nombre de usuario ya está ocupado'],
  ['Failed to fetch', 'Error de conexión. Revisá tu internet.'],
  ['Too many requests', 'Demasiados intentos. Esperá un minuto y volvé a intentar.'],
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

function isClientError(error: unknown) {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

async function saveUsernameAfterSignUp(username: string): Promise<string | null> {
  try {
    await saveUsername(username).catch((error: unknown) => {
      if (isClientError(error)) throw error;
      return saveUsername(username);
    });
    return null;
  } catch (error) {
    return error instanceof ApiError && error.status === 409
      ? USERNAME_TAKEN_AFTER_SIGN_UP
      : USERNAME_NOT_SAVED;
  }
}

export async function signUp(email: string, password: string, username: string) {
  const result = await authClient.signUp.email({ email, password, name: username.trim() });
  if (result.error) return result;
  const usernameError = await saveUsernameAfterSignUp(username);
  return usernameError ? { ...result, error: { message: usernameError } } : result;
}

export async function signOut() {
  const result = await authClient.signOut();
  const { useGameStore } = await import('../stores/gameStore.js');
  const { resetGame, setUserId } = useGameStore.getState();
  resetGame();
  setUserId(null);
  return result;
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
  const result = await apiGet<{ available: boolean }>(`username-available?${params.toString()}`);
  return result.available;
}
