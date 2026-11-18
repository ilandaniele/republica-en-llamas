import { Suspense, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MOOD_ANIMATIONS } from './portraits/moodAnimations.js';
import { PORTRAITS, politicianFor } from './portraits/portraits.js';
import { useGameImage } from '../../hooks/useGameImage.js';
import type { PortraitId, PortraitMood } from './portraits/types.js';
import { imageA11yProps } from './imageA11yProps.js';
import { prefersReducedMotion } from '../../lib/reducedMotion.js';
import './event-scenes/raster-effects.css';

export type { PortraitId, PortraitMood } from './portraits/types.js';

gsap.registerPlugin(useGSAP);

interface Props {
  id: PortraitId;
  mood?: PortraitMood;
  px?: number;
  label?: string;
}

export function PixelPortrait({ id, mood = 'neutral', px = 96, label }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevMood = useRef<PortraitMood>(mood);
  const Portrait = PORTRAITS[id];
  const svgH = Math.round((px * 240) / 200);
  const imageUrl = useGameImage(`portrait_${politicianFor(id)}_${mood}`);

  // Idle: subtle float animation
  useGSAP(
    () => {
      if (imageUrl || prefersReducedMotion()) return;
      gsap.to(containerRef.current, {
        y: -3,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    },
    { scope: containerRef, dependencies: [imageUrl], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (prevMood.current === mood) return;
      prevMood.current = mood;
      if (imageUrl || prefersReducedMotion()) return;
      MOOD_ANIMATIONS[mood](containerRef.current);
    },
    { scope: containerRef, dependencies: [mood, imageUrl], revertOnUpdate: true },
  );

  return (
    <div
      ref={containerRef}
      className={imageUrl ? 'pixel-portrait-frame' : undefined}
      style={{ display: 'inline-block', width: px, height: svgH, lineHeight: 0 }}
    >
      {imageUrl ? (
        <img
          className={`pixel-portrait-image pixel-portrait-image--${mood}`}
          src={imageUrl}
          width={px}
          height={svgH}
          alt={label ?? ''}
          style={{ imageRendering: 'pixelated', display: 'block', objectFit: 'cover' }}
        />
      ) : (
        <svg
          width={px}
          height={svgH}
          viewBox="0 0 200 240"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated', display: 'block' }}
          {...imageA11yProps(label)}
        >
          {Portrait && (
            <Suspense fallback={null}>
              <Portrait mood={mood} />
            </Suspense>
          )}
        </svg>
      )}
    </div>
  );
}
