import { isGoogleSignInEnabled, signInWithGoogle } from '../../lib/auth.js';
import { GoogleIcon } from './GoogleIcon.js';

interface GoogleSignInProps {
  dividerLabel: string;
  className?: string;
}

export function GoogleSignIn({ dividerLabel, className = '' }: GoogleSignInProps) {
  if (!isGoogleSignInEnabled) return null;
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => {
          void signInWithGoogle();
        }}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50"
      >
        <GoogleIcon />
        Continuar con Google
      </button>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-navy-600" />
        <span className="font-mono text-xs text-smoke-400">{dividerLabel}</span>
        <div className="h-px flex-1 bg-navy-600" />
      </div>
    </div>
  );
}
