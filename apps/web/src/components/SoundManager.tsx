import React, { useRef, useState, useCallback, useEffect } from 'react';
import { SoundContext } from '../hooks/useSounds.js';
import { browserStorage } from '../lib/browserStorage.js';
import { vibrate } from '../lib/haptics.js';
import { usePreferencesStore } from '../stores/preferencesStore.js';

function getCtx(ref: React.MutableRefObject<AudioContext | null>): AudioContext | null {
  try {
    if (!ref.current) {
      ref.current = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
    }
    if (ref.current.state === 'suspended') void ref.current.resume().catch(() => {});
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
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => browserStorage.getItem('soundEnabled') !== 'false');
  const haptics = usePreferencesStore((s) => s.haptics);
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(
    () => () => {
      const ctx = ctxRef.current;
      ctxRef.current = null;
      if (ctx && ctx.state !== 'closed') void ctx.close().catch(() => {});
    },
    [],
  );

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      browserStorage.setItem('soundEnabled', String(next));
      return next;
    });
  }, []);

  const cue = useCallback(
    (pattern: number | number[], play: (ctx: AudioContext) => void) => {
      if (haptics) vibrate(pattern);
      if (!soundEnabled) return;
      const ctx = getCtx(ctxRef);
      if (ctx) play(ctx);
    },
    [soundEnabled, haptics],
  );

  const playCardFlip = useCallback(
    () =>
      cue(10, (ctx) => {
        tone(ctx, 'square', 440, 0.05, 0.12);
        tone(ctx, 'square', 660, 0.05, 0.08, ctx.currentTime + 0.06);
      }),
    [cue],
  );

  const playCrisisAlert = useCallback(
    () =>
      cue([80, 40, 80], (ctx) => {
        tone(ctx, 'sawtooth', 80, 0.35, 0.4);
        tone(ctx, 'sawtooth', 55, 0.35, 0.3, ctx.currentTime + 0.04);
      }),
    [cue],
  );

  const playGameOver = useCallback(
    () =>
      cue(300, (ctx) =>
        [440, 370, 311, 261, 220].forEach((f, i) =>
          tone(ctx, 'triangle', f, 0.3, 0.3, ctx.currentTime + i * 0.22),
        ),
      ),
    [cue],
  );

  const playVictoryTick = useCallback(
    () =>
      cue([40, 30, 40, 30, 80], (ctx) =>
        [523, 659, 784, 1047].forEach((f, i) => tone(ctx, 'sine', f, 0.12, 0.22, ctx.currentTime + i * 0.1)),
      ),
    [cue],
  );

  const playVoteTick = useCallback(
    (frequency: number) => {
      if (!soundEnabled) return;
      const ctx = getCtx(ctxRef);
      if (ctx) tone(ctx, 'sine', frequency, 0.04, 0.06);
    },
    [soundEnabled],
  );

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        playCardFlip,
        playCrisisAlert,
        playGameOver,
        playVictoryTick,
        playVoteTick,
      }}
    >
      {children}
      <button
        type="button"
        onClick={toggleSound}
        aria-label="Sonido"
        aria-pressed={soundEnabled}
        className="fixed right-14 top-2 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-navy-600 bg-navy-800/80 text-sm transition-colors hover:bg-navy-700"
        title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
      >
        <span aria-hidden="true">{soundEnabled ? '🔊' : '🔇'}</span>
      </button>
    </SoundContext.Provider>
  );
}
