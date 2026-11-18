export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
  BETTER_AUTH_SECRET: string;
  WEB_URL: string;
  ALLOWED_ORIGINS?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  EMAIL?: SendEmail;
  RESET_EMAIL_FROM?: string;
}

const MIN_SECRET_LENGTH = 32;

const PAIRED_SETTINGS: [keyof Env, keyof Env][] = [
  ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'],
];

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

function isServableUrl(value: string | undefined): boolean {
  if (!value || !URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === 'https:' || (url.protocol === 'http:' && LOCAL_HOSTNAMES.has(url.hostname));
}

export function findEnvProblems(env: Partial<Env>): string[] {
  const problems: string[] = [];
  if (!env.DB) problems.push('DB binding is missing');
  if (!env.ASSETS) problems.push('ASSETS binding is missing');
  if ((env.BETTER_AUTH_SECRET?.length ?? 0) < MIN_SECRET_LENGTH) {
    problems.push(`BETTER_AUTH_SECRET must have at least ${MIN_SECRET_LENGTH} characters`);
  }
  if (!isServableUrl(env.WEB_URL)) problems.push('WEB_URL must be an https URL (http only on localhost)');
  for (const [first, second] of PAIRED_SETTINGS) {
    if (Boolean(env[first]) !== Boolean(env[second]))
      problems.push(`${first} and ${second} must be set together`);
  }
  return problems;
}

