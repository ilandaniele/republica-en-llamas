import { useTranslation } from 'react-i18next';
import type { AchievementTier, ScenarioAchievement } from '@republica/game-engine';

const TIER_STYLE: Record<AchievementTier, { icon: string; label: string; className: string }> = {
  locked: { icon: '🔒', label: 'Sin jugar', className: 'border-navy-700 text-smoke-600' },
  played: { icon: '🎖️', label: 'Jugado', className: 'border-smoke-600 text-smoke-300' },
  won: { icon: '🏆', label: 'Superado', className: 'border-gold-500 text-gold-400' },
};

export function ScenarioAchievements({ achievements }: { achievements: ScenarioAchievement[] }) {
  const { t } = useTranslation();
  const won = achievements.filter((achievement) => achievement.tier === 'won').length;

  return (
    <section className="mb-8" aria-labelledby="scenario-achievements-title">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 id="scenario-achievements-title" className="font-serif text-xl font-bold text-gold-400">
          Logros por escenario
        </h2>
        <p className="font-mono text-xs text-smoke-500">
          {won}/{achievements.length} superados
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {achievements.map((achievement) => {
          const tier = TIER_STYLE[achievement.tier];
          return (
            <li
              key={achievement.scenarioId}
              className={`rounded-lg border bg-navy-800 p-3 ${tier.className}`}
            >
              <p className="font-serif text-sm font-bold">
                <span aria-hidden="true">{tier.icon} </span>
                {t(achievement.labelKey)}
              </p>
              <p className="mt-1 font-mono text-xs">
                {tier.label}
                {achievement.bestScore > 0 && ` · ${achievement.bestScore.toLocaleString()}`}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
