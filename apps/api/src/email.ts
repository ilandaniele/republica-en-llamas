import type { Env } from './env.js';

export async function sendPasswordResetEmail(env: Env, to: string, url: string): Promise<void> {
  if (!env.EMAIL || !env.RESET_EMAIL_FROM) {
    console.warn('Password reset email skipped: EMAIL binding not configured');
    return;
  }
  await env.EMAIL.send({
    from: env.RESET_EMAIL_FROM,
    to,
    subject: 'República en Llamas: restablecer contraseña',
    text: `Usá este enlace para restablecer tu contraseña: ${url}\n\nSi no lo pediste, ignorá este mensaje.`,
  });
}
