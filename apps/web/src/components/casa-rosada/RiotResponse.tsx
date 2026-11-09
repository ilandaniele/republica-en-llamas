import type { CSSProperties } from 'react';
import { AnimatedSprite } from './AnimatedSprite.js';
import type { RiotResponse as Response } from './getRiotResponse.js';
import './riot-response.css';

export function RiotOfficers({ response }: { response: Response }) {
  if (response.phase !== 'dispersal') return null;
  return (
    <g data-riot-officers="true">
      {[48, 58, 68].map((x, i) => (
        <g key={x} style={{ '--riot-delay': `${-i * 0.7}s` } as CSSProperties}>
          <AnimatedSprite
            id="cr_riot_officer"
            box={{ x, y: 53, w: 7, h: 9 }}
            duration={2.8}
            delay={-i * 0.7}
          />
        </g>
      ))}
    </g>
  );
}

export function RiotEffects({ response }: { response: Response }) {
  return (
    <g data-riot-phase={response.phase} pointerEvents="none" aria-hidden="true">
      {response.rubberRounds && (
        <g data-effect="rubber-rounds">
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className="cr-rubber-round"
              x={55 + i * 10}
              y={58}
              width={1}
              height={1}
              fill="#66717d"
              style={{ '--riot-delay': `${-i * 0.7}s` } as CSSProperties}
            />
          ))}
        </g>
      )}
      {response.tearGas && (
        <g data-effect="tear-gas">
          {[0, 1].map((i) => (
            <rect
              key={i}
              className="cr-gas-canister"
              x={57 + i * 15}
              y={57}
              width={1}
              height={2}
              fill="#b6bfc6"
              style={{ '--riot-delay': `${-i * 2}s` } as CSSProperties}
            />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <g
              key={i}
              className="cr-tear-gas"
              style={{ '--riot-delay': `${-i * 0.53}s`, '--gas-drift': `${5 + (i % 4)}px` } as CSSProperties}
            >
              <rect
                x={69 + (i % 6) * 7}
                y={60 + Math.floor(i / 6) * 3}
                width={6 + (i % 3)}
                height={3}
                fill="#dce3d7"
              />
              <rect x={71 + (i % 6) * 7} y={58 + Math.floor(i / 6) * 3} width={4} height={3} fill="#c7d0c4" />
            </g>
          ))}
        </g>
      )}
      {response.phase === 'dialogue' && (
        <g data-dialogue="true">
          <rect x={75} y={61} width={7} height={2} fill="#b89664" />
          <rect x={76} y={63} width={1} height={2} fill="#6e5941" />
          <rect x={80} y={63} width={1} height={2} fill="#6e5941" />
        </g>
      )}
    </g>
  );
}
