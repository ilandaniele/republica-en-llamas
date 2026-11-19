import { MIN_USERNAME_LENGTH } from '../useUsernameAvailability.js';

export const MIN_PASSWORD_LENGTH = 8;
const USERNAME_PATTERN = /^[\p{L}\p{N}_.-]{3,24}$/u;

interface RegistrationInput {
  username: string;
  password: string;
  usernameAvailable: boolean | null;
}

export function usernameFormatError(username: string): string | null {
  const name = username.trim().normalize('NFC');
  if (!name) return 'El nombre de usuario es requerido';
  if (name.length < MIN_USERNAME_LENGTH) return 'El usuario debe tener al menos 3 caracteres';
  if (!USERNAME_PATTERN.test(name))
    return 'Usá hasta 24 letras, números, punto, guion o guion bajo, sin espacios';
  return null;
}

/** Returns the first validation error message, or null when the form is valid. */
export function validateRegistration({
  username,
  password,
  usernameAvailable,
}: RegistrationInput): string | null {
  const formatError = usernameFormatError(username);
  if (formatError) return formatError;
  if (usernameAvailable === false) return 'Ese nombre de usuario ya está ocupado';
  if (password.length < MIN_PASSWORD_LENGTH)
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`;
  return null;
}
