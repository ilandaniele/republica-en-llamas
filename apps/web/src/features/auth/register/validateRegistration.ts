import { MIN_USERNAME_LENGTH } from '../useUsernameAvailability.js';

export const MIN_PASSWORD_LENGTH = 6;

interface RegistrationInput {
  username: string;
  password: string;
  usernameAvailable: boolean | null;
}

/** Returns the first validation error message, or null when the form is valid. */
export function validateRegistration({
  username,
  password,
  usernameAvailable,
}: RegistrationInput): string | null {
  if (!username.trim()) return 'El nombre de usuario es requerido';
  if (username.length < MIN_USERNAME_LENGTH) return 'El usuario debe tener al menos 3 caracteres';
  if (usernameAvailable === false) return 'Ese nombre de usuario ya está ocupado';
  if (password.length < MIN_PASSWORD_LENGTH) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
}
