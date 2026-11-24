const USERNAME_PATTERN = /^[\p{L}\p{N}_.-]{3,24}$/u;
const LATIN_LETTER = /\p{Script=Latin}/u;
const NON_LATIN_LETTER = /(?=\p{L})\P{Script=Latin}/u;

function mixesScripts(name: string): boolean {
  return LATIN_LETTER.test(name) && NON_LATIN_LETTER.test(name);
}

export function validUsername(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.trim().normalize('NFKC');
  return USERNAME_PATTERN.test(name) && !mixesScripts(name) ? name : null;
}

export function usernameKey(name: string): string {
  return name.toLowerCase();
}
