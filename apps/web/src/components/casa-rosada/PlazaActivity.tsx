import type { CSSProperties } from 'react';
import { AnimatedSprite } from './AnimatedSprite.js';
import { Sprite } from './Sprite.js';
import type { PlazaActivity } from './getPlazaActivity.js';
import './plaza-activity.css';

export function PlazaProps({ activity }: { activity: PlazaActivity }) {
  return (
    <g data-plaza-props="true">
      {activity.vendors && <Sprite id="cr_food_cart" box={{ x: 107, y: 49, w: 13, h: 14 }} fallback={null} />}
      {activity.press && !activity.vendors && !activity.medical && !activity.waterCannon && (
        <Sprite id="cr_news_van" box={{ x: 112, y: 48, w: 17, h: 11 }} fallback={null} />
      )}
      {activity.medical && (
        <g className="cr-emergency-arrival">
          <Sprite id="cr_ambulance" box={{ x: 31, y: 52, w: 21, h: 11 }} fallback={null} />
          <rect className="cr-beacon" x={39} y={53} width={3} height={1} fill="#e55848" />
        </g>
      )}
      {activity.aidStation && (
        <Sprite
          id="cr_aid_tent"
          box={{ x: activity.waterCannon ? 84 : 105, y: 47, w: 17, h: 15 }}
          fallback={null}
        />
      )}
      {activity.roadworks && (
        <Sprite id="cr_construction_barrier" box={{ x: 90, y: 60, w: 13, h: 7 }} fallback={null} />
      )}
      {activity.waterCannon && (
        <g className="cr-emergency-arrival">
          <Sprite id="cr_water_cannon" box={{ x: 103, y: 51, w: 23, h: 12 }} fallback={null} />
          <rect className="cr-beacon" x={115} y={52} width={2} height={1} fill="#74acdf" />
        </g>
      )}
      {activity.motorcade && (
        <g className="cr-motorcade">
          <Sprite id="cr_limousine" box={{ x: 45, y: 49, w: 23, h: 9 }} fallback={null} />
        </g>
      )}
      {activity.barricade && (
        <Sprite id="cr_barricade_solid" box={{ x: 60, y: 62, w: 17, h: 8 }} fallback={null} />
      )}
    </g>
  );
}

export function PlazaPerformers({ activity }: { activity: PlazaActivity }) {
  return (
    <g data-plaza-performers="true">
      {activity.vendors && (
        <>
          <AnimatedSprite id="cr_vendor_serve" box={{ x: 101, y: 57, w: 5, h: 8 }} duration={1.4} />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className="cr-food-steam"
              x={110 + i}
              y={58}
              width={1}
              height={1}
              fill="#d5d9d4"
              style={{ '--activity-delay': `${-i * 0.6}s` } as CSSProperties}
            />
          ))}
        </>
      )}
      {activity.press && !activity.vendors && !activity.medical && !activity.waterCannon && (
        <g>
          <AnimatedSprite id="cr_photographer" box={{ x: 93, y: 56, w: 6, h: 8 }} duration={4.8} />
          <rect className="cr-camera-flash" x={93} y={58} width={2} height={2} fill="#fff3cb" />
        </g>
      )}
      {activity.drummers &&
        [41, 72, 100].map((x, i) => (
          <AnimatedSprite
            key={x}
            id="cr_drummer"
            box={{ x, y: 60, w: 6, h: 8 }}
            delay={-i * 0.19}
            duration={0.7}
          />
        ))}
      {activity.medical &&
        [57, 88].map((x, i) => (
          <g key={x} transform={`translate(${x} 58)`}>
            <g
              className="cr-person-route"
              style={
                {
                  '--travel': '5px',
                  '--route-cycle': '9s',
                  '--route-delay': `${-i * 2}s`,
                } as CSSProperties
              }
            >
              <g className="cr-person-facing">
                <AnimatedSprite id="cr_medic_walk" box={{ x: 0, y: 0, w: 5, h: 8 }} locomotion />
              </g>
            </g>
          </g>
        ))}
      {activity.roadworks && (
        <AnimatedSprite id="cr_worker" box={{ x: 92, y: 54, w: 6, h: 9 }} duration={1.2} />
      )}
      {activity.waterSpray &&
        Array.from({ length: 5 }, (_, i) => (
          <rect
            key={i}
            className="cr-water-drop"
            x={109 - i * 2}
            y={54 + Math.floor((i * i) / 6)}
            width={2}
            height={1}
            fill="#a8d7ec"
            style={{ '--activity-delay': `${-i * 0.2}s` } as CSSProperties}
          />
        ))}
    </g>
  );
}
