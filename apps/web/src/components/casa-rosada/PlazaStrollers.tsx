import type { CSSProperties } from 'react';
import { AnimatedSprite } from './AnimatedSprite.js';

interface Lane {
  y: number;
  from: number;
  to: number;
  people: number;
}

const LANES: Lane[] = [
  { y: 52.6, from: 40, to: 120, people: 12 },
  { y: 55.4, from: 37, to: 67, people: 5 },
  { y: 55.4, from: 92, to: 123, people: 5 },
  { y: 58.6, from: 39, to: 66, people: 5 },
  { y: 58.6, from: 94, to: 122, people: 5 },
  { y: 61.8, from: 54, to: 67, people: 3 },
  { y: 61.8, from: 93, to: 106, people: 3 },
  { y: 66.4, from: 54, to: 106, people: 10 },
];

const BACK_Y = 52;
const FRONT_Y = 67;

function variation(seed: number): number {
  return ((seed * 37 + 11) % 101) / 100;
}

function personScale(y: number): number {
  return 0.5 + ((y - BACK_Y) / (FRONT_Y - BACK_Y)) * 0.2;
}

function Stroller({ lane, index, seed }: { lane: Lane; index: number; seed: number }) {
  const v = variation(seed);
  const scale = personScale(lane.y);
  const width = 4 * scale;
  const height = 6 * scale;
  const span = lane.to - lane.from - width;
  const travel = Math.min(span, 10 + v * 18);
  const slot = span / lane.people;
  const outbound = index % 2 === 0 ? 1 : -1;
  const start = lane.from + Math.min(slot * index + v * slot, span - travel) + (outbound < 0 ? travel : 0);
  const woman = seed % 3 === 0;
  const cycle = travel * 0.55 + 4 + v * 3;
  const style = {
    '--travel': `${outbound * travel}px`,
    '--route-cycle': `${cycle}s`,
    '--route-delay': `${-v * cycle}s`,
    '--outbound-facing': outbound * (woman ? -1 : 1),
    '--turn-origin': `${width / 2}px ${height / 2}px`,
  } as CSSProperties;
  return (
    <g transform={`translate(${start} ${lane.y - height})`}>
      <g className="cr-person-route" style={style}>
        <g className="cr-person-bounce">
          <g className="cr-person-facing">
            <AnimatedSprite
              id={woman ? 'cr_woman_walk' : 'cr_citizen_walk'}
              box={{ x: 0, y: 0, w: width, h: height }}
              delay={-v * 3}
              duration={0.45 + v * 0.2}
              locomotion
            />
          </g>
        </g>
      </g>
    </g>
  );
}

const STROLLERS = LANES.flatMap((lane) =>
  Array.from({ length: lane.people }, (_, index) => ({ lane, index })),
);

export function PlazaStrollers() {
  return (
    <g data-plaza-strollers="true">
      {STROLLERS.map(({ lane, index }, i) => (
        <Stroller key={i} lane={lane} index={index} seed={i + 1} />
      ))}
    </g>
  );
}
