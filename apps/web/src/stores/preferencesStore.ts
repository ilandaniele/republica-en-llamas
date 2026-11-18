import { create } from 'zustand';
import { browserStorage } from '../lib/browserStorage.js';
import { REDUCE_MOTION_CLASS } from '../lib/reducedMotion.js';

export type PreferenceKey = 'reduceMotion' | 'hotkeysEnabled' | 'extendedTime';
type Preferences = Record<PreferenceKey, boolean>;

const storageKey = (key: PreferenceKey) => `pref.${key}`;

function loadPreferences(): Preferences {
  const stored = (key: PreferenceKey) => browserStorage.getItem(storageKey(key));
  return {
    reduceMotion: stored('reduceMotion') === 'true',
    hotkeysEnabled: stored('hotkeysEnabled') !== 'false',
    extendedTime: stored('extendedTime') === 'true',
  };
}

function applyReduceMotion(enabled: boolean) {
  document.documentElement.classList.toggle(REDUCE_MOTION_CLASS, enabled);
}

interface PreferencesState extends Preferences {
  toggle: (key: PreferenceKey) => void;
}

const initial = loadPreferences();
applyReduceMotion(initial.reduceMotion);

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...initial,
  toggle: (key) => {
    const next = !get()[key];
    browserStorage.setItem(storageKey(key), String(next));
    if (key === 'reduceMotion') applyReduceMotion(next);
    set({ [key]: next });
  },
}));
