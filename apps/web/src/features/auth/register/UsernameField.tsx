import { MIN_USERNAME_LENGTH } from '../useUsernameAvailability.js';

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  available: boolean | null;
  checking: boolean;
}

function availabilityIndicator(checking: boolean, available: boolean | null) {
  if (checking) return { className: 'text-smoke-500', symbol: '...' };
  if (available) return { className: 'text-emerald-400', symbol: '✓' };
  return { className: 'text-crimson-400', symbol: '✗' };
}

export function UsernameField({ value, onChange, available, checking }: UsernameFieldProps) {
  const indicator = availabilityIndicator(checking, available);
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Nombre de usuario (mín. 3 caracteres)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 pr-8 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
      />
      {value.length >= MIN_USERNAME_LENGTH && (
        <span className={`absolute right-3 top-3.5 text-xs ${indicator.className}`}>{indicator.symbol}</span>
      )}
    </div>
  );
}
