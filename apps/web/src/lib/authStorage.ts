const PERSISTENCE_KEY = 'rel-remember-session';
let persistence: boolean | undefined;

function read(storage: 'localStorage' | 'sessionStorage', key: string): string | null {
  try {
    return window[storage].getItem(key);
  } catch {
    return null;
  }
}

function write(storage: 'localStorage' | 'sessionStorage', key: string, value: string | null) {
  try {
    if (value === null) window[storage].removeItem(key);
    else window[storage].setItem(key, value);
  } catch {
    // Never fall back from blocked tab storage to persistent storage.
  }
}

export function rememberSession(): boolean {
  persistence ??= read('localStorage', PERSISTENCE_KEY) !== 'false';
  return persistence;
}

export function setRememberSession(remember: boolean) {
  persistence = remember;
  write('localStorage', PERSISTENCE_KEY, String(remember));
}

export const authStorage = {
  getItem(key: string): string | null {
    return read(rememberSession() ? 'localStorage' : 'sessionStorage', key);
  },
  setItem(key: string, value: string) {
    const selected = rememberSession() ? 'localStorage' : 'sessionStorage';
    write(selected, key, value);
    write(selected === 'localStorage' ? 'sessionStorage' : 'localStorage', key, null);
  },
  removeItem(key: string) {
    write('localStorage', key, null);
    write('sessionStorage', key, null);
  },
};
