import { useId } from 'react';
import { MIN_USERNAME_LENGTH } from '../useUsernameAvailability.js';

interface UsernameFieldProps {
  value: string;
  onChange: (value: string) => void;
  available: boolean | null;
  checking: boolean;
}

function availabilityIndicator(checking: boolean, available: boolean | null) {
  if (checking) return { className: 'text-smoke-500', symbol: '...', text: 'Comprobando…' };
  if (available) return { className: 'text-emerald-400', symbol: '✓', text: 'Disponible' };
  return { className: 'text-crimson-400', symbol: '✗', text: 'No disponible' };
}

export function UsernameField({ value, onChange, available, checking }: UsernameFieldProps) {
  const inputId = useId();
  const statusId = useId();
  const indicator = availabilityIndicator(checking, available);
  const showStatus = value.length >= MIN_USERNAME_LENGTH;
  return (
    <div className="relative">
      <label htmlFor={inputId} className="sr-only">
        Nombre de usuario
      </label>
      <input
        id={inputId}
        type="text"
        autoComplete="username"
        placeholder="Nombre de usuario (mín. 3 caracteres)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={showStatus && !checking && !available}
        aria-describedby={statusId}
        className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 pr-8 font-mono text-sm text-smoke-100 focus:border-gold-500"
      />
      <span
        id={statusId}
        aria-live="polite"
        className={`absolute right-3 top-3.5 text-xs ${indicator.className}`}
      >
        {showStatus && (
          <>
            <span aria-hidden="true">{indicator.symbol}</span>
            <span className="sr-only">{indicator.text}</span>
          </>
        )}
      </span>
    </div>
  );
}
