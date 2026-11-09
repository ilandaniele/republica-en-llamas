import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PARTIES, type ElectionCountFrame } from '@republica/game-engine';
import { districtMargin, votePercent } from './countFormat.js';
import { PARTY_COLORS } from './palette.js';

export function DistrictResults({
  frame,
  selected,
  onSelect,
}: {
  frame: ElectionCountFrame;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [order, setOrder] = useState('name');
  const districts = [...frame.districts].sort((a, b) =>
    order === 'close'
      ? districtMargin(a) - districtMargin(b) || a.name.localeCompare(b.name, i18n.language)
      : a.name.localeCompare(b.name, i18n.language),
  );
  return (
    <details className="election-districts">
      <summary>{t('count.allDistricts')}</summary>
      <label>
        {t('count.order')}
        <select value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="name">{t('count.alphabetical')}</option>
          <option value="close">{t('count.closest')}</option>
        </select>
      </label>
      <p className="election-simulation">{t('count.marginHelp')}</p>
      <div className="election-table-scroll">
        <table>
          <caption className="sr-only">{t('count.allDistricts')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('count.districtName')}</th>
              <th scope="col">{t('count.leading')}</th>
              <th scope="col">{t('count.margin')}</th>
              <th scope="col">{t('count.progress')}</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district) => (
              <tr key={district.id}>
                <th scope="row">
                  <button
                    type="button"
                    aria-pressed={district.id === selected}
                    onClick={() => onSelect(district.id)}
                  >
                    {district.name}
                  </button>
                </th>
                <td
                  style={{ color: district.leader ? PARTY_COLORS[district.leader] : 'var(--celeste-light)' }}
                >
                  {district.leader ? PARTIES[district.leader].label : t('count.noLeader')}
                </td>
                <td>{district.counted ? `${districtMargin(district).toFixed(1)} pp` : '—'}</td>
                <td>{votePercent(district.counted, district.total)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
