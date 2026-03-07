import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface SoundCtx {
  soundEnabled: boolean;
  toggleSound: () => void;
  playCardFlip: () => void;
  playCrisisAlert: () => void;
  playGameOver: () => void;
  playVictoryTick: () => void;
}

const SoundContext = createContext<SoundCtx>({
  soundEnabled: false,
  toggleSound: () => {},
  playCardFlip: () => {},
  playCrisisAlert: () => {},
  playGameOver: () => {},
  playVictoryTick: () => {},
});

export function useSounds() {
  return useContext(SoundContext);
}

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  try {
    if (!ref.current) {
      ref.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (ref.current.state === 'suspended') ref.current.resume();
    return ref.current;
  } catch {
    return null;
  }
}

function tone(ctx: AudioContext, type: OscillatorType, freq: number, dur: number, vol = 0.25, t?: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  const start = t ?? ctx.currentTime;
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
  osc.start(start);
  osc.stop(start + dur + 0.01);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() =>
    localStorage.getItem('soundEnabled') !== 'false'
  );
  const ctxRef = useRef<AudioContext | null>(null);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('soundEnabled', String(next));
      return next;
    });
  }, []);

  const playCardFlip = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    tone(ctx, 'square', 440, 0.05, 0.12);
    tone(ctx, 'square', 660, 0.05, 0.08, ctx.currentTime + 0.06);
  }, [soundEnabled]);

  const playCrisisAlert = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    tone(ctx, 'sawtooth', 80, 0.35, 0.4);
    tone(ctx, 'sawtooth', 55, 0.35, 0.3, ctx.currentTime + 0.04);
  }, [soundEnabled]);

  const playGameOver = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    [440, 370, 311, 261, 220].forEach((f, i) => tone(ctx, 'triangle', f, 0.3, 0.3, ctx.currentTime + i * 0.22));
  }, [soundEnabled]);

  const playVictoryTick = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getCtx(ctxRef);
    if (!ctx) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(ctx, 'sine', f, 0.12, 0.22, ctx.currentTime + i * 0.1));
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playCardFlip, playCrisisAlert, playGameOver, playVictoryTick }}>
      {children}
      <button
        onClick={toggleSound}
        className="fixed top-3 right-14 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-navy-800/80 border border-navy-600 text-sm hover:bg-navy-700 transition-colors"
        title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </SoundContext.Provider>
  );
}
