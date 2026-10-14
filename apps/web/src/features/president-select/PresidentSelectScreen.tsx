import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore.js';
import { useEntitlements } from '../../hooks/useEntitlements.js';
import imageManifest from '../../assets/image-manifest.json';
import { PaywallModal } from '../../components/PaywallModal.js';
import { HISTORICAL_SCENARIOS } from '@republica/game-engine';
import { useTranslation } from 'react-i18next';

interface Archetype {
  id: string;
  name: string;
  lastName: string;
  title: string;
  description: string;
  bonus: string;
  weakness: string;
  bonusStat: string;
  weaknessStat: string;
  color: string;
  emoji: string;
}

const ARCHETYPE_CHAR: Record<string, string> = {
  ingeniero: 'char_milei',
  populista: 'char_massa',
  tecnocrata: 'char_bullrich',
  izquierda: 'char_bregman',
  federal: 'char_schiaretti',
  corporativo: 'char_larreta',
};

const ARCHETYPES: Archetype[] = [
  {
    id: 'ingeniero',
    name: 'Javier',
    lastName: 'Milei',
    title: 'La Motosierra',
    description:
      '¡VIVA LA LIBERTAD, CARAJO! Economista austríaco, anarcocapitalista, enemigo del Banco Central. La motosierra en mano, promete destruir el Estado.',
    bonus: '+15 Confianza de Mercados inicial',
    weakness: '-10 Popularidad inicial',
    bonusStat: 'marketConfidence',
    weaknessStat: 'popularity',
    color: 'border-blue-500',
    emoji: '⚡',
  },
  {
    id: 'populista',
    name: 'Sergio',
    lastName: 'Massa',
    title: 'El Candidato',
    description:
      '"Estamos trabajando." Peronista pragmático, camaleón político, eterno candidato. Las plazas lo bancan, los mercados lo dudan.',
    bonus: '+15 Popularidad inicial',
    weakness: '-10 Confianza de Mercados inicial',
    bonusStat: 'popularity',
    weaknessStat: 'marketConfidence',
    color: 'border-crimson-500',
    emoji: '🎙',
  },
  {
    id: 'tecnocrata',
    name: 'Patricia',
    lastName: 'Bullrich',
    title: 'La Mano Dura',
    description:
      '"Orden y trabajo, sin excusas." PRO de hierro, ministra de seguridad, candidata eterna. Fría, determinada, con cero tolerancia al caos.',
    bonus: '+10 Estabilidad Social, +5 Credibilidad Mediática',
    weakness: '-10 Popularidad inicial',
    bonusStat: 'socialStability',
    weaknessStat: 'popularity',
    color: 'border-yellow-500',
    emoji: '🦅',
  },
  {
    id: 'izquierda',
    name: 'Myriam',
    lastName: 'Bregman',
    title: 'La Tribuna',
    description:
      '"Que paguen los que más tienen." FIT-Unidad, abogada, trotskista convencida. Las plazas la aclaman, los mercados la odian.',
    bonus: '+15 Estabilidad Social inicial',
    weakness: '-15 Confianza de Mercados inicial',
    bonusStat: 'socialStability',
    weaknessStat: 'marketConfidence',
    color: 'border-red-600',
    emoji: '✊',
  },
  {
    id: 'federal',
    name: 'Juan',
    lastName: 'Schiaretti',
    title: 'El Federal',
    description:
      '"Córdoba primero." Tres veces gobernador, peronista disfrazado de independiente. Pragmático, cordobés hasta los huesos, distante de Buenos Aires.',
    bonus: '+10 Credibilidad Mediática, +5 Estabilidad',
    weakness: '-10 Popularidad nacional inicial',
    bonusStat: 'mediaCredibility',
    weaknessStat: 'popularity',
    color: 'border-blue-400',
    emoji: '🌾',
  },
  {
    id: 'corporativo',
    name: 'Horacio',
    lastName: 'Larreta',
    title: 'El Gestor',
    description:
      '"Trabajar, trabajar y trabajar." Ex jefe de Gobierno porteño, tecnócrata del PRO, amante del PowerPoint. Gestión sin carisma, resultados sin pasión.',
    bonus: '+10 Confianza de Mercados, +5 Credibilidad Mediática',
    weakness: '-15 Popularidad inicial',
    bonusStat: 'marketConfidence',
    weaknessStat: 'popularity',
    color: 'border-sky-400',
    emoji: '📊',
  },
];

function ArchetypeCard({
  archetype,
  selected,
  onSelect,
}: {
  archetype: Archetype;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <m.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative w-full rounded-xl border-2 p-6 text-left transition-all duration-200 ${archetype.color} ${
        selected
          ? 'bg-navy-700 shadow-lg shadow-gold-500/20 ring-2 ring-gold-400'
          : 'hover:bg-navy-750 bg-navy-800'
      }`}
    >
      {/* President portrait */}
      <div className="mb-3 flex justify-center">
        {(() => {
          const charKey = ARCHETYPE_CHAR[archetype.id];
          const charUrl = charKey ? (imageManifest as Record<string, string>)[charKey] : null;
          return charUrl ? (
            <img
              src={charUrl}
              width={120}
              height={120}
              style={{ imageRendering: 'pixelated', display: 'block' }}
              alt={archetype.name}
            />
          ) : (
            <span className="text-5xl">{archetype.emoji}</span>
          );
        })()}
      </div>

      {/* Name */}
      <div className="mb-4 text-center">
        <p className="font-serif text-xl font-bold text-smoke-100">
          {archetype.name} {archetype.lastName}
        </p>
        <p className="text-smoke-500 mt-1 font-mono text-xs uppercase tracking-widest">{archetype.title}</p>
      </div>

      {/* Description */}
      <p className="text-smoke-300 mb-4 text-center text-xs italic leading-relaxed">
        "{archetype.description}"
      </p>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 rounded border border-emerald-800 bg-emerald-900/30 px-3 py-2">
          <span className="font-mono text-xs font-bold text-emerald-400">+</span>
          <span className="font-mono text-xs text-emerald-300">{archetype.bonus}</span>
        </div>
        <div className="bg-crimson-900/30 flex items-center gap-2 rounded border border-crimson-800 px-3 py-2">
          <span className="font-mono text-xs font-bold text-crimson-400">−</span>
          <span className="text-crimson-300 font-mono text-xs">{archetype.weakness}</span>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <m.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-navy-900"
        >
          ✓
        </m.div>
      )}
    </m.button>
  );
}

export default function PresidentSelectScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setPresidentId = useGameStore((s) => s.setPresidentId);
  const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
  const setCrisisExpress = useGameStore((s) => s.setCrisisExpress);
  const scenarioId = useGameStore((s) => s.scenarioId);
  const setScenario = useGameStore((s) => s.setScenario);
  const [selected, setSelected] = useState<string>('populista');
  const [paywall, setPaywall] = useState<{
    entitlement: import('@republica/game-engine').EntitlementId;
    trigger: string;
  } | null>(null);
  const { hasEntitlement } = useEntitlements();

  const canPlay = (archetypeId: string) => {
    if (archetypeId === 'ingeniero') return true;
    if (archetypeId === 'populista') return true;
    return hasEntitlement('presidents_pack') || hasEntitlement('full_access');
  };

  const canUseCrisisExpress = hasEntitlement('mode_crisis_express') || hasEntitlement('full_access');

  const handleSelect = (id: string) => {
    if (!canPlay(id)) {
      setPaywall({ entitlement: 'presidents_pack', trigger: 'president_select' });
      return;
    }
    setSelected(id);
  };

  const handleToggleCrisisExpress = () => {
    if (!canUseCrisisExpress && !isCrisisExpress) {
      setPaywall({ entitlement: 'mode_crisis_express', trigger: 'president_select' });
      return;
    }
    setCrisisExpress(!isCrisisExpress);
  };

  const handleConfirm = () => {
    setPresidentId(selected);
    navigate('/game');
  };

  const selectedArchetype = ARCHETYPES.find((a) => a.id === selected) ?? ARCHETYPES[1]!;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-4xl">
        {/* Historical scenario badge */}
        {scenarioId && (
          <div className="pixel-border-gold mb-6 bg-navy-800 px-3 py-2 text-center font-serif text-[8px] tracking-wide text-gold-400">
            MODO HISTÓRICO: {t(HISTORICAL_SCENARIOS[scenarioId].labelKey)}
          </div>
        )}

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="text-smoke-500 mb-2 font-mono text-xs uppercase tracking-widest">
            Elecciones presidenciales
          </p>
          <h1 className="mb-3 font-serif text-4xl font-black text-smoke-100">
            ¿Quién va a <span className="text-crimson-400">gobernar</span>?
          </h1>
          <p className="mx-auto max-w-lg text-sm text-smoke-400">
            Cada presidente arranca con fortalezas y debilidades distintas. El país se acuerda de quién lo
            llevó a la gloria o al desastre.
          </p>
        </div>

        {/* Archetype grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {ARCHETYPES.map((a) => {
            const locked = !canPlay(a.id);
            return (
              <div key={a.id} className="relative">
                <ArchetypeCard
                  archetype={a}
                  selected={selected === a.id}
                  onSelect={() => handleSelect(a.id)}
                />
                {locked && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-navy-900/70">
                    <span className="text-3xl">🔒</span>
                    <span className="mt-1 font-mono text-xs text-gold-400">$2.99</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Crisis Express toggle */}
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <button
            onClick={handleToggleCrisisExpress}
            className={`flex w-full items-center justify-between rounded-xl border-2 px-5 py-4 transition-all duration-200 ${
              isCrisisExpress
                ? 'bg-crimson-900/50 border-crimson-500 shadow-lg shadow-crimson-500/20'
                : 'hover:border-navy-400 border-navy-600 bg-navy-800'
            }`}
          >
            <div className="text-left">
              <p
                className={`font-mono text-sm font-bold uppercase tracking-widest ${isCrisisExpress ? 'text-crimson-300' : 'text-smoke-400'}`}
              >
                ⚡ Crisis Express{' '}
                {!canUseCrisisExpress && <span className="ml-2 text-gold-400">🔒 $1.99</span>}
              </p>
              <p className="text-smoke-500 mt-0.5 font-mono text-xs">
                45s por turno · 15 turnos · ×1.5 daño · ×2 puntaje
              </p>
            </div>
            <div
              className={`flex h-6 w-10 items-center rounded-full border-2 transition-all duration-200 ${
                isCrisisExpress
                  ? 'justify-end border-crimson-400 bg-crimson-500'
                  : 'justify-start border-navy-500 bg-navy-700'
              }`}
            >
              <div className="mx-0.5 h-4 w-4 rounded-full bg-smoke-100" />
            </div>
          </button>
        </m.div>

        {/* Confirm button */}
        <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button
            onClick={handleConfirm}
            className="w-full rounded-xl bg-crimson-600 px-8 py-4 font-serif text-xl font-bold uppercase tracking-wider text-smoke-100 shadow-lg transition-colors hover:bg-crimson-500"
          >
            {selectedArchetype
              ? `Asumir como ${selectedArchetype.name} ${selectedArchetype.lastName} →`
              : 'Seleccioná un presidente'}
          </button>
        </m.div>

        <button
          onClick={() => {
            setScenario(null);
            navigate('/');
          }}
          className="text-smoke-500 hover:text-smoke-300 mt-3 w-full py-2 font-mono text-xs"
        >
          ← Volver al inicio
        </button>
      </div>

      {/* Paywall modal */}
      {paywall && (
        <PaywallModal
          entitlement={paywall.entitlement}
          triggerPoint={paywall.trigger}
          onClose={() => setPaywall(null)}
        />
      )}
    </m.div>
  );
}
