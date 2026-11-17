import { AsyncLocalStorage } from 'node:async_hooks';
import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import { findEnvProblems, type Env } from './env.js';
import { allowedOrigins, RequestError } from './http.js';
import { neutralUsername } from './policy.js';
import { transferGuestTickets } from './tickets.js';
import { sendPasswordResetEmail } from './email.js';

function googleProvider(env: Env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return {};
  return { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } };
}

const RESET_TOKEN_TTL_SECONDS = 30 * 60;
const EMAIL_TIMEOUT_MS = 10_000;

export const executionContext = new AsyncLocalStorage<ExecutionContext | undefined>();

function withTimeout(promise: Promise<void>, ms: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((_, reject) => {
    timer = setTimeout(() => reject(new Error('Email send timed out')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function createAuth(env: Env) {
  const problems = findEnvProblems(env);
  if (problems.length > 0) {
    console.error({ event: 'auth_misconfigured', problems });
    throw new RequestError(503, 'Service unavailable');
  }
  return betterAuth({
    appName: 'República en Llamas',
    baseURL: env.WEB_URL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    database: env.DB,
    trustedOrigins: allowedOrigins(env.WEB_URL, env.ALLOWED_ORIGINS),
    rateLimit: {
      enabled: true,
      storage: 'database',
      customRules: { '/sign-in/anonymous': { window: 3600, max: 10 } },
    },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: RESET_TOKEN_TTL_SECONDS,
      sendResetPassword: ({ user, url }) =>
        withTimeout(sendPasswordResetEmail(env, user.email, url), EMAIL_TIMEOUT_MS),
    },
    socialProviders: googleProvider(env),
    advanced: {
      ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] },
      disableOriginCheck: false,
      backgroundTasks: { handler: (promise) => executionContext.getStore()?.waitUntil(promise) },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if ((user as { isAnonymous?: boolean | null }).isAnonymous) return;
            await env.DB.prepare('insert or ignore into profiles (id, username) values (?1, ?2)')
              .bind(user.id, neutralUsername())
              .run();
          },
        },
      },
    },
    plugins: [
      anonymous({
        generateName: () => 'Invitado',
        onLinkAccount: async ({ anonymousUser, newUser }) => {
          await transferGuestTickets(env.DB, anonymousUser.user.id, newUser.user.id);
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

const instances = new WeakMap<Env, Auth>();

export function getAuth(env: Env): Auth {
  let auth = instances.get(env);
  if (!auth) {
    auth = createAuth(env);
    instances.set(env, auth);
  }
  return auth;
}

export interface SessionUser {
  id: string;
  isAnonymous: boolean;
}

export async function sessionUser(auth: Auth, request: Request): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  return { id: session.user.id, isAnonymous: Boolean((session.user as { isAnonymous?: boolean | null }).isAnonymous) };
}
