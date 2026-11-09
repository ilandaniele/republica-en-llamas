import { betterAuth } from 'better-auth';
import { anonymous } from 'better-auth/plugins';
import type { Env } from './env.js';
import { allowedOrigins } from './http.js';
import { neutralUsername } from './policy.js';
import { transferGuestTickets } from './tickets.js';
import { sendPasswordResetEmail } from './email.js';

function googleProvider(env: Env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return {};
  return { google: { clientId: env.GOOGLE_CLIENT_ID, clientSecret: env.GOOGLE_CLIENT_SECRET } };
}

const MIN_SECRET_LENGTH = 32;

export function createAuth(env: Env) {
  if ((env.BETTER_AUTH_SECRET?.length ?? 0) < MIN_SECRET_LENGTH) throw new Error('BETTER_AUTH_SECRET is not configured');
  return betterAuth({
    appName: 'República en Llamas',
    baseURL: env.WEB_URL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    database: env.DB,
    trustedOrigins: allowedOrigins(env.WEB_URL, env.ALLOWED_ORIGINS),
    rateLimit: { enabled: true, storage: 'database' },
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: ({ user, url }) => sendPasswordResetEmail(env, user.email, url),
    },
    socialProviders: googleProvider(env),
    advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
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

export interface SessionUser {
  id: string;
  isAnonymous: boolean;
}

export async function sessionUser(auth: Auth, request: Request): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;
  return { id: session.user.id, isAnonymous: Boolean((session.user as { isAnonymous?: boolean | null }).isAnonymous) };
}
