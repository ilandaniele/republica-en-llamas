import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PARTIES, type ElectionCountFrame } from '@republica/game-engine';
import geography from '../../../assets/argentina-pixel-map.json';
import { NO_RESULTS_COLOR, PARTY_COLORS } from './palette.js';

const ProvincePixels = memo(function ProvincePixels({ index }: { index: number }) {
  return (
    <>
      {geography.provinces[index]!.runs.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </>
  );
});
const Borders = memo(function Borders() {
  return (
    <g fill="#17283f" pointerEvents="none">
      {geography.borders.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </g>
  );
});

export function ArgentinaElectionMap({
  frame,
  selected,
  onSelect,
}: {
  frame: ElectionCountFrame;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <figure className="election-map">
      <svg
        viewBox={`0 0 ${geography.width} ${geography.height}`}
        xmlns="http://www.w3.org/2000/svg"
        role="group"
        aria-label={t('count.mapLabel')}
        shapeRendering="crispEdges"
      >
        <g className="election-insets" fill="none" stroke="#2e6da4" strokeWidth={1}>
          <rect x={136} y={44} width={80} height={20} />
          <rect x={136} y={99} width={80} height={45} />
          <rect x={136} y={174} width={80} height={66} />
        </g>
        <g fill="#627c9b" pointerEvents="none">
          {Array.from({ length: 15 }, (_, i) => (
            <rect key={`h${i}`} x={84 + i * 4} y={88} width={1} height={1} />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={`v${i}`} x={142} y={52 + i * 4} width={1} height={1} />
          ))}
        </g>
        {geography.provinces.map((province, index) => {
          const district = frame.districts.find((item) => item.id === province.id)!;
          const leader = district.leader;
          return (
            <g
              key={province.id}
              role="button"
              tabIndex={0}
              aria-pressed={selected === province.id}
              aria-label={`${district.name}: ${leader ? PARTIES[leader].label : t('count.noLeader')}`}
              data-district={province.id}
              data-party={leader ?? 'pending'}
              className={`election-province ${selected === province.id ? 'is-selected' : ''}`}
              fill={leader ? PARTY_COLORS[leader] : NO_RESULTS_COLOR}
              onClick={() => onSelect(province.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect(province.id);
                }
              }}
            >
              <title>{district.name}</title>
              <ProvincePixels index={index} />
            </g>
          );
        })}
        <Borders />
        <g className="election-map-labels" fill="#b8d9f0" pointerEvents="none">
          <text x={136} y={38}>
            {t('count.cabaInset')}
          </text>
          <text x={136} y={93}>
            {t('count.islandsInset')}
          </text>
          <text x={136} y={168}>
            {t('count.antarcticInset')}
          </text>
        </g>
      </svg>
      <figcaption>
        {t('count.geography')}{' '}
        <a
          href="https://www.argentina.gob.ar/georef/descarga-de-la-base-completa"
          target="_blank"
          rel="noreferrer"
        >
          Georef / IGN
        </a>{' '}
        ·{' '}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
          CC BY 4.0
        </a>
      </figcaption>
    </figure>
  );
}
