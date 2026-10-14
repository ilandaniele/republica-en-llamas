export function ConfirmationSent({ email, onGoToLogin }: { email: string; onGoToLogin: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 text-5xl">📬</div>
        <h2 className="mb-3 font-serif text-2xl font-bold text-smoke-100">Revisá tu email</h2>
        <p className="mb-6 font-mono text-sm text-smoke-400">
          Te enviamos un link de confirmación a <strong className="text-gold-400">{email}</strong>. Confirmá
          tu cuenta y volvé a iniciar sesión.
        </p>
        <button
          onClick={onGoToLogin}
          className="rounded-lg bg-crimson-600 px-6 py-3 font-serif font-bold text-smoke-100 transition-colors hover:bg-crimson-500"
        >
          Ir al login →
        </button>
      </div>
    </div>
  );
}
