import { useGameStore } from '../../stores/gameStore.js';
import { useEntitlements } from '../../hooks/useEntitlements.js';
import { BuyButton } from '../../components/BuyButton.js';

// The server owns the daily cap: start-run answers 429 'daily_cap' once it is reached.
export function DailyCapBanner() {
  const dailyCapReached = useGameStore((s) => s.runTicketError === 'daily_cap');
  const { hasPremium } = useEntitlements();
  if (!dailyCapReached || hasPremium) return null;

  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-crimson-700 bg-crimson-900/40 p-4 text-center"
    >
      <p className="mb-1 font-mono text-sm font-bold text-crimson-300">⏰ Límite diario alcanzado</p>
      <p className="mb-3 font-mono text-xs text-smoke-400">
        Las próximas partidas se juegan sin guardar. Volvé más tarde o desbloqueá acceso total.
      </p>
      <BuyButton entitlement="full_access" label="Acceso Total — $5.99" className="mx-auto" />
    </div>
  );
}
