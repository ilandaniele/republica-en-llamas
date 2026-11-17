import { useId } from 'react';
import { MIN_PASSWORD_LENGTH } from './validateRegistration.js';

export function PasswordField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputId = useId();
  const hintId = useId();
  const isTooShort = value.length > 0 && value.length < MIN_PASSWORD_LENGTH;
  return (
    <div>
      <label htmlFor={inputId} className="sr-only">
        Contraseña
      </label>
      <input
        id={inputId}
        type="password"
        autoComplete="new-password"
        placeholder={`Contraseña (mínimo ${MIN_PASSWORD_LENGTH} caracteres)`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={isTooShort}
        aria-describedby={isTooShort ? hintId : undefined}
        className={`w-full rounded-lg border bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 ${
          isTooShort ? 'border-crimson-600' : 'border-navy-600 focus:border-gold-500'
        }`}
      />
      {isTooShort && (
        <p id={hintId} className="mt-1 font-mono text-xs text-crimson-400">
          <span aria-hidden="true">
            {'▓'.repeat(value.length)}
            {'░'.repeat(MIN_PASSWORD_LENGTH - value.length)}{' '}
          </span>
          {value.length}/{MIN_PASSWORD_LENGTH}
          <span className="sr-only"> caracteres</span>
        </p>
      )}
    </div>
  );
}
