export function OfflineNotice({ onPlayOffline }: { onPlayOffline: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-navy-600 bg-navy-800 p-8 text-center">
        <p className="mb-3 font-serif text-xl font-bold text-crimson-400">⚠ Modo offline</p>
        <p className="mb-4 font-mono text-xs text-smoke-400">
          Las cuentas no están disponibles en esta versión del juego.
        </p>
        <button onClick={onPlayOffline} className="mt-6 font-mono text-sm text-gold-400 underline">
          Jugar en modo offline →
        </button>
      </div>
    </div>
  );
}
