import { Suspense, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOOD_ANIMATIONS } from './portraits/moodAnimations.js';
import { PORTRAITS } from './portraits/portraits.js';
import type { PortraitId, PortraitMood } from './portraits/types.js';

export type { PortraitId, PortraitMood } from './portraits/types.js';

gsap.registerPlugin(useGSAP);

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
}

export function PixelPortrait({ id, mood = 'neutral', px = 96 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMood = useRef<PortraitMood>(mood);
  const Portrait = PORTRAITS[id];
  const svgH = Math.round((px * 240) / 200);

  // Idle: subtle float animation
  useGSAP(
    () => {
      gsap.to(containerRef.current, {
        y: -3,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef },
  );

  useGSAP(
    () => {
      if (prevMood.current === mood) return;
      prevMood.current = mood;
      MOOD_ANIMATIONS[mood](containerRef.current);
    },
    { scope: containerRef, dependencies: [mood] },
  );

  return (
    <div ref={containerRef} style={{ display: 'inline-block', width: px, height: svgH, lineHeight: 0 }}>
      <svg
        width={px}
        height={svgH}
        viewBox="0 0 200 240"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        role="img"
        aria-label={'Retrato de ' + id}
      >
        {Portrait && (
          <Suspense fallback={null}>
            <Portrait mood={mood} />
          </Suspense>
        )}
      </svg>
    </div>
  );
}
