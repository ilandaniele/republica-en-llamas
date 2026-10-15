import { MIN_PASSWORD_LENGTH } from './validateRegistration.js';

export function PasswordField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const isTooShort = value.length > 0 && value.length < MIN_PASSWORD_LENGTH;
  return (
    <div>
      <input
        type="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className={`w-full rounded-lg border bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:outline-none ${
          isTooShort ? 'border-crimson-600' : 'border-navy-600 focus:border-gold-500'
        }`}
      />
      {isTooShort && (
        <p className="mt-1 font-mono text-xs text-crimson-400">
          {'▓'.repeat(value.length)}
          {'░'.repeat(MIN_PASSWORD_LENGTH - value.length)} {value.length}/{MIN_PASSWORD_LENGTH}
        </p>
      )}
    </div>
  );
}
