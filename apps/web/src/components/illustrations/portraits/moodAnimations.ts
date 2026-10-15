import { gsap } from 'gsap';
import type { PortraitMood } from './types.js';

type MoodAnimation = (target: HTMLDivElement | null) => void;

export const MOOD_ANIMATIONS: Record<PortraitMood, MoodAnimation> = {
  panic: (target) => {
    gsap.killTweensOf(target, 'x,rotation');
    gsap
      .timeline()
      .to(target, { x: -5, rotation: -3, duration: 0.06, ease: 'none' })
      .to(target, { x: 5, rotation: 3, duration: 0.06, ease: 'none' })
      .to(target, { x: -4, rotation: -2, duration: 0.06, ease: 'none' })
      .to(target, { x: 4, rotation: 2, duration: 0.06, ease: 'none' })
      .to(target, { x: 0, rotation: 0, duration: 0.08, ease: 'none' });
  },
  victory: (target) => {
    gsap.killTweensOf(target, 'scale,y');
    gsap
      .timeline()
      .to(target, {
        scale: 1.18,
        duration: 0.18,
        ease: 'back.out(3)',
        transformOrigin: '50% 100%',
        immediateRender: false,
      })
      .to(target, {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)',
        transformOrigin: '50% 100%',
      });
  },
  neutral: (target) => {
    gsap.to(target, { x: 0, rotation: 0, scale: 1, duration: 0.2 });
  },
};
