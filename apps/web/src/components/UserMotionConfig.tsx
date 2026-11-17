import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { usePreferencesStore } from '../stores/preferencesStore.js';

export function UserMotionConfig({ children }: { children: ReactNode }) {
  const reduceMotion = usePreferencesStore((s) => s.reduceMotion);
  return <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>{children}</MotionConfig>;
}
