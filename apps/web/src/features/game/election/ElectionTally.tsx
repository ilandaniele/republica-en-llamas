import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PARTIES,
  PRESIDENT_LABELS,
  type ElectionNight,
  type ElectionCountFrame,
} from '@republica/game-engine';
import { ArgentinaElectionMap } from './ArgentinaElectionMap.js';
import { PARTY_COLORS, NO_RESULTS_COLOR } from './palette.js';
import './election.css';
import { votePercent as percent } from './countFormat.js';
import { DistrictResults } from './DistrictResults.js';
import { downloadElectionCsv } from './electionCsv.js';

export function ElectionTally({ night, frame }: { night: ElectionNight; frame: ElectionCountFrame }) {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState('06');
  const [downloadFailed, setDownloadFailed] = useState(false);
  const district = frame.districts.find((item) => item.id === selected)!;
  const ranked = [...night.contenders].sort((a, b) => frame.votes[b.party] - frame.votes[a.party]);
  const number = new Intl.NumberFormat(i18n.language === 'en' ? 'en' : 'es-AR');
  const progress = Math.round((frame.counted / frame.total) * 100);
  return (
    <div className="election-tally">
      <div className="election-count-progress">
        <p>
          <strong>{progress}%</strong> {t('count.counted')} · {number.format(frame.counted)}{' '}
          {t('count.gameVotes')}
        </p>
        <div
          className="election-progress"
          role="progressbar"
          aria-label={t('count.counted')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div style={{ width: `${progress}%` }} />
        </div>
        <p className="election-simulation">{t('count.simulation')}</p>
      </div>
      <div className="election-count-layout">
        <ArgentinaElectionMap frame={frame} selected={selected} onSelect={setSelected} />
        <div className="election-returns">
          <h3>{t('count.national')}</h3>
          <ol className="election-party-results">
            {ranked.map((contender) => (
              <li key={contender.party} style={{ borderColor: PARTY_COLORS[contender.party] }}>
                <div className="election-party-title">
                  <span style={{ color: PARTY_COLORS[contender.party] }}>
                    {PARTIES[contender.party].label}
                  </span>
                  <strong>{percent(frame.votes[contender.party], frame.counted)}%</strong>
                </div>
                <p>
                  {PRESIDENT_LABELS[contender.presidentId]}
                  {contender.party === night.playerParty ? ` · ${t('debate.you')}` : ''}
                </p>
                <div className="election-vote-bar" aria-hidden="true">
                  <div
                    style={{
                      width: `${percent(frame.votes[contender.party], frame.counted)}%`,
                      background: PARTY_COLORS[contender.party],
                    }}
                  />
                </div>
              </li>
            ))}
          </ol>
          <label className="election-district-picker">
            {t('count.district')}
            <select value={selected} onChange={(event) => setSelected(event.target.value)}>
              {frame.districts.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <section className="election-district-detail" aria-label={t('count.districtDetail')}>
            <h4>{district.name}</h4>
            <p>
              {percent(district.counted, district.total)}% {t('count.counted')}
            </p>
            <p style={{ color: district.leader ? PARTY_COLORS[district.leader] : NO_RESULTS_COLOR }}>
              {district.leader
                ? `${t('count.leading')}: ${PARTIES[district.leader].label}`
                : t('count.noLeader')}
            </p>
            {night.contenders.map((contender) => (
              <p key={contender.party} className="election-local-result">
                <span>{PARTIES[contender.party].label}</span>
                <strong>{percent(district.votes[contender.party], district.counted)}%</strong>
              </p>
            ))}
          </section>
        </div>
      </div>
      <DistrictResults frame={frame} selected={selected} onSelect={setSelected} />
      {frame.counted === frame.total && (
        <button
          type="button"
          className="election-skip"
          onClick={() => {
            setDownloadFailed(false);
            try {
              downloadElectionCsv(frame, {
                district: t('count.districtName'),
                total: t('count.totalVotes'),
                leader: t('count.leading'),
                national: t('count.national'),
                simulated: t('count.simulatedColumn'),
              });
            } catch {
              setDownloadFailed(true);
            }
          }}
        >
          {t('count.download')}
        </button>
      )}
      {downloadFailed && <p role="alert">{t('count.downloadFailed')}</p>}
      <p className="election-map-note">{t('count.mapNote')}</p>
    </div>
  );
}
