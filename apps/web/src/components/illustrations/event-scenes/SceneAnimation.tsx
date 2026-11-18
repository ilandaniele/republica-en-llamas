import type { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import { ANIMATIONS_BY_SCENE } from './sceneAnimations.js';
import { prefersReducedMotion } from '../../../lib/reducedMotion.js';

interface SceneAnimationProps {
  scene: string;
  scope: RefObject<HTMLDivElement | null>;
}

// Rendered next to the scene so the tweens start once its (lazy) SVG nodes are mounted.
export function SceneAnimation({ scene, scope }: SceneAnimationProps) {
  useGSAP(() => (prefersReducedMotion() ? undefined : ANIMATIONS_BY_SCENE[scene]?.()), {
    scope,
    dependencies: [scene],
  });
  return null;
}
