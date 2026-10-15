import { Suspense, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { GameState } from '@republica/game-engine';
import imageManifest from '../../assets/image-manifest.json';
import { lbl } from './event-scenes/pixel.js';
import { ParticleLayer } from './event-scenes/ParticleLayer.js';
import { SceneAnimation } from './event-scenes/SceneAnimation.js';
import { CATEGORY_ANIMATIONS } from './event-scenes/sceneAnimations.js';
import { SCENES } from './event-scenes/scenes.js';
import { selectScene } from './event-scenes/selectScene.js';

gsap.registerPlugin(useGSAP);

interface Props {
  eventCategory: string;
  presidentId: string;
  eventId?: string;
  gameState?: GameState | null | undefined;
}

export function EventIllustration({ eventCategory, presidentId, eventId = '', gameState }: Props) {
  const scene = selectScene(eventCategory, eventId, gameState);
  const aiUrl = (imageManifest as Record<string, string>)[scene] ?? null;
  const Scene = SCENES[scene];
  const containerRef = useRef<HTMLDivElement>(null);

  // Left-to-right reveal wipe on every new scene, then the category particle loop.
  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out', immediateRender: false },
      );
      CATEGORY_ANIMATIONS[eventCategory]?.();
    },
    { scope: containerRef, dependencies: [scene, eventCategory] },
  );

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#1a1a2e' }}
    >
      {eventCategory === 'crisis' && (
        <div
          className="gsap-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: '#c62828',
            pointerEvents: 'none',
            zIndex: 2,
            opacity: 0,
          }}
        />
      )}

      <svg
        viewBox="0 0 320 180"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={`IlustraciÃ³n: ${eventCategory}`}
      >
        {aiUrl ? (
          <>
            <image
              href={aiUrl}
              x={0}
              y={0}
              width={320}
              height={180}
              preserveAspectRatio="xMidYMid slice"
              style={{ imageRendering: 'pixelated' as const }}
            />
            {lbl(scene.replace(/_/g, ' ').toUpperCase())}
            <SceneAnimation scene={scene} scope={containerRef} />
          </>
        ) : (
          Scene && (
            <Suspense fallback={null}>
              <Scene presidentId={presidentId} gameState={gameState ?? null} />
              <SceneAnimation scene={scene} scope={containerRef} />
            </Suspense>
          )
        )}
      </svg>

      <ParticleLayer category={eventCategory} />
    </div>
  );
}
