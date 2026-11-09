import type { CSSProperties } from 'react';
import type { CasaRosadaMood } from './getCasaRosadaMood.js';
import type { DioramaSituation } from './getDioramaSituation.js';
import { AnimatedSprite } from './AnimatedSprite.js';
import { Sprite } from './Sprite.js';
import { politicianFor } from '../illustrations/portraits/portraits.js';
import { ArgentineFlag } from './ArgentineFlag.js';

interface Props {
  mood: CasaRosadaMood;
  situation: DioramaSituation;
  presidentId: string;
}

export function AnimatedPeople({ mood, situation }: Omit<Props, 'presidentId'>) {
  if (mood.ruins || mood.graves || situation.vacant) return null;
  const celebrating = situation.inauguration || mood.celebration;
  const running = situation.combat || mood.crowd === 3;
  const count = celebrating ? 72 : running ? 42 : [6, 20, 36, 42][mood.crowd]!;
  const pose = celebrating ? 'cr_supporter_cheer' : running ? 'cr_protester_run' : 'cr_citizen_walk';
  return (
    <g data-plaza-people={count}>
      {Array.from({ length: count }, (_, i) => {
        const columns = celebrating ? 18 : running ? 14 : 12;
        const row = Math.floor(i / columns);
        const x = count === 6 ? 36 + i * 14 : (running ? 42 : 32) + (i % columns) * (celebrating ? 5 : 6);
        const y = 53 + row * 3 + (i % 2);
        const variation = ((i * 37 + 11) % 101) / 100;
        const cycle = running ? 4.2 + variation * 1.8 : 9 + variation * 5;
        const woman = !celebrating && !running && i % 3 === 0;
        const style = {
          '--travel': `${(running ? -1 : 1) * (6 + Math.round(variation * 3))}px`,
          '--route-cycle': `${cycle}s`,
          '--route-delay': `${-variation * cycle}s`,
          '--outbound-facing': woman ? -1 : 1,
          '--turn-origin': '2px 3px',
          '--pose-duration': `${0.65 + variation * 0.3}s`,
          '--pose-delay': `${-variation * 3}s`,
        } as CSSProperties;
        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            <g className={`cr-person-route ${celebrating ? 'cr-cheering-route' : ''}`} style={style}>
              <rect x={1} y={6} width={2} height={1} fill="#1c2a27" opacity={0.18} />
              <g className="cr-person-bounce">
                <g className={celebrating ? undefined : 'cr-person-facing'}>
                  <AnimatedSprite
                    id={woman ? 'cr_woman_walk' : pose}
                    box={{ x: 0, y: 0, w: 4, h: 6 }}
                    delay={-variation * 3}
                    duration={0.65 + variation * 0.3}
                    locomotion={!celebrating}
                  />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function Inauguration({ presidentId }: Pick<Props, 'presidentId'>) {
  return (
    <g data-inauguration="true">
      <g className="cr-balcony-president">
        <Sprite
          id={`cr_president_${politicianFor(presidentId)}`}
          box={{ x: 77.25, y: 34.9, w: 6.5, h: 9.1 }}
          fallback={null}
        />
      </g>
      {[34, 118].map((x, i) => (
        <ArgentineFlag key={x} x={x} y={53} phase={-i * 0.25} />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <rect
          key={i}
          className="cr-confetti"
          x={24 + ((i * 17) % 112)}
          y={45 + (i % 8)}
          width={1}
          height={1}
          fill={['#74acdf', '#fff3d6', '#f6b40e'][i % 3]}
          style={{ '--fall-delay': `${-i * 0.17}s` } as CSSProperties}
        />
      ))}
    </g>
  );
}

export function BritishArrival({ situation }: Pick<Props, 'situation'>) {
  return (
    <g data-british-arrival={situation.landing ? 'landing' : 'fleet'}>
      <g className="cr-fleet">
        <Sprite id="cr_british_ship" box={{ x: 0, y: 40, w: 48, h: 20 }} fallback={null} />
      </g>
    </g>
  );
}

export function CombatActors({ situation }: Pick<Props, 'situation'>) {
  return (
    <g data-combat={situation.combat ? 'true' : 'false'}>
      {situation.landing && (
        <>
          <g className="cr-transport">
            <Sprite id="cr_helicopter_transport" box={{ x: 112, y: 30, w: 32, h: 16 }} fallback={null} />
            <rect className="cr-rotor" x={112} y={31} width={30} height={1} fill="#d6e0d9" />
          </g>
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              className="cr-downwash"
              x={113 + i * 4}
              y={47 + (i % 2)}
              width={2}
              height={1}
              fill="#d6c8a4"
              style={
                {
                  '--dust-direction': `${i < 3 ? -4 : 4}px`,
                  '--dust-delay': `${3 + i * 0.12}s`,
                } as CSSProperties
              }
            />
          ))}
          <g className="cr-deploy">
            {Array.from({ length: 8 }, (_, i) => (
              <g key={i} transform={`translate(${104 + i * 3} ${57 + (i % 2) * 3})`}>
                <g
                  className="cr-person-route"
                  style={
                    {
                      '--travel': '-12px',
                      '--route-cycle': `${9 + i * 0.3}s`,
                      '--route-delay': `${-i * 0.4}s`,
                    } as CSSProperties
                  }
                >
                  <g className="cr-person-facing">
                    <AnimatedSprite id="cr_british_marine" box={{ x: 0, y: 0, w: 5, h: 8 }} locomotion />
                  </g>
                </g>
              </g>
            ))}
          </g>
        </>
      )}
      {situation.combat &&
        [34, 46, 58].map((x, i) => (
          <g key={x} style={{ '--shot-delay': `${-i * 0.21}s` } as CSSProperties}>
            <AnimatedSprite
              id="cr_guard_fire"
              box={{ x, y: 56 + (i % 2) * 3, w: 6, h: 8 }}
              delay={-i * 0.21}
              duration={0.8}
            />
            <rect className="cr-muzzle" x={x + 6} y={60 + (i % 2) * 3} width={2} height={1} fill="#ffd668" />
            <rect className="cr-tracer" x={x + 12} y={60 + (i % 2) * 3} width={5} height={1} fill="#fff1ba" />
          </g>
        ))}
    </g>
  );
}
