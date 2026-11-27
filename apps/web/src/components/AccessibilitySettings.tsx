import { usePreferencesStore } from '../stores/preferencesStore.js';
import type { PreferenceKey } from '../stores/preferencesStore.js';

const OPTIONS: { key: PreferenceKey; label: string }[] = [
  { key: 'reduceMotion', label: 'Reducir animaciones' },
  { key: 'hotkeysEnabled', label: 'Atajos de teclado (1-4, A-D)' },
  { key: 'extendedTime', label: 'Tiempo extendido en Crisis Express (90 s)' },
  { key: 'haptics', label: 'Vibración en el celular' },
];

function PreferenceToggle({ preference, label }: { preference: PreferenceKey; label: string }) {
  const enabled = usePreferencesStore((s) => s[preference]);
  const toggle = usePreferencesStore((s) => s.toggle);
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={() => toggle(preference)}
      className="flex min-h-[44px] w-full items-center justify-between gap-3 border border-navy-600 bg-navy-800 px-3 py-2 text-left font-mono text-sm text-smoke-200 hover:bg-navy-700"
    >
      <span>{label}</span>
      <span aria-hidden="true" className={enabled ? 'text-gold-400' : 'text-smoke-400'}>
        {enabled ? 'SÍ' : 'NO'}
      </span>
    </button>
  );
}

export function AccessibilitySettings() {
  return (
    <details className="mt-6 text-left">
      <summary className="inline-flex min-h-[44px] cursor-pointer items-center font-mono text-sm text-smoke-300">
        Accesibilidad
      </summary>
      <div className="mt-2 space-y-2">
        {OPTIONS.map(({ key, label }) => (
          <PreferenceToggle key={key} preference={key} label={label} />
        ))}
      </div>
    </details>
  );
}
