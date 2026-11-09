import type { CSSProperties } from 'react';
import { Sprite, type SpriteBox } from './Sprite.js';
import './diorama-animation.css';
import './locomotion.css';

interface Props {
  id: string;
  box: SpriteBox;
  delay?: number;
  duration?: number;
  locomotion?: boolean;
}

export function AnimatedSprite({ id, box, delay = 0, duration = 0.6, locomotion = false }: Props) {
  const style = { '--pose-duration': `${duration}s`, '--pose-delay': `${delay}s` } as CSSProperties;
  // Enlarge around the feet so routes and contact with the plaza stay aligned.
  const actorBox = {
    x: box.x - box.w * 0.15,
    y: box.y - box.h * 0.3,
    w: box.w * 1.3,
    h: box.h * 1.3,
  };
  return (
    <g className={`cr-poses ${locomotion ? 'cr-locomotion' : ''}`} style={style} data-actor={id}>
      <g className="cr-pose cr-pose-a">
        <Sprite id={`${id}_a`} box={actorBox} fallback={null} />
      </g>
      <g className="cr-pose cr-pose-b">
        <Sprite id={`${id}_b`} box={actorBox} fallback={null} />
      </g>
    </g>
  );
}
