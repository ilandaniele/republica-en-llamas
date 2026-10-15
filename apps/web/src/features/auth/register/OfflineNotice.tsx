import { missingEnvVars } from '../../../lib/supabase.js';

export function OfflineNotice({ onPlayOffline }: { onPlayOffline: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-navy-600 bg-navy-800 p-8 text-center">
        <p className="mb-3 font-serif text-xl font-bold text-crimson-400">⚠ Sin conexión a Supabase</p>
        <p className="mb-4 font-mono text-xs text-smoke-400">
          Faltan variables de entorno en <code className="text-gold-400">.env</code>:
        </p>
        {missingEnvVars.url && <p className="text-smoke-300 mb-1 font-mono text-xs">• VITE_SUPABASE_URL</p>}
        {missingEnvVars.key && (
          <p className="text-smoke-300 mb-1 font-mono text-xs">• VITE_SUPABASE_ANON_KEY</p>
        )}
        <button onClick={onPlayOffline} className="mt-6 font-mono text-sm text-gold-400 underline">
          Jugar en modo offline →
        </button>
      </div>
    </div>
  );
}
