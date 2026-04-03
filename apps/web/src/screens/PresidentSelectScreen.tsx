import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
import { PixelPortrait } from '../components/illustrations/PixelPortrait.js';
import { useEntitlements } from '../hooks/useEntitlements.js';
import { PaywallModal } from '../components/PaywallModal.js';
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

const ARCHETYPES: Archetype[] = [
  {
    id: 'ingeniero',
    name: 'Javier',
    lastName: 'Milei',
    title: 'La Motosierra',
    description: '¡VIVA LA LIBERTAD, CARAJO! Economista austríaco, anarcocapitalista, enemigo del Banco Central. La motosierra en mano, promete destruir el Estado.',
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
    description: '"Estamos trabajando." Peronista pragmático, camaleón político, eterno candidato. Las plazas lo bancan, los mercados lo dudan.',
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
    description: '"Orden y trabajo, sin excusas." PRO de hierro, ministra de seguridad, candidata eterna. Fría, determinada, con cero tolerancia al caos.',
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
    description: '"Que paguen los que más tienen." FIT-Unidad, abogada, trotskista convencida. Las plazas la aclaman, los mercados la odian.',
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
    description: '"Córdoba primero." Tres veces gobernador, peronista disfrazado de independiente. Pragmático, cordobés hasta los huesos, distante de Buenos Aires.',
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
    description: '"Trabajar, trabajar y trabajar." Ex jefe de Gobierno porteño, tecnócrata del PRO, amante del PowerPoint. Gestión sin carisma, resultados sin pasión.',
    bonus: '+10 Confianza de Mercados, +5 Credibilidad Mediática',
    weakness: '-15 Popularidad inicial',
    bonusStat: 'marketConfidence',
    weaknessStat: 'popularity',
    color: 'border-sky-400',
    emoji: '📊',
  },
];

function ArchetypeCard({ archetype, selected, onSelect }: { archetype: Archetype; selected: boolean; onSelect: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`relative w-full text-left p-6 border-2 rounded-xl transition-all duration-200 ${archetype.color} ${
        selected
          ? 'bg-navy-700 ring-2 ring-gold-400 shadow-lg shadow-gold-500/20'
          : 'bg-navy-800 hover:bg-navy-750'
      }`}
    >
      {/* President caricature */}
      <div className="flex justify-center mb-3">
        <PixelPortrait id={archetype.id as import('../components/illustrations/PixelPortrait.js').PortraitId} mood={selected ? 'victory' : 'neutral'} px={120} />
      </div>

      {/* Name */}
      <div className="text-center mb-4">
        <p className="font-serif font-bold text-smoke-100 text-xl">{archetype.name} {archetype.lastName}</p>
        <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest mt-1">{archetype.title}</p>
      </div>

      {/* Description */}
      <p className="text-smoke-300 text-xs leading-relaxed mb-4 text-center italic">
        "{archetype.description}"
      </p>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 bg-emerald-900/30 border border-emerald-800 rounded px-3 py-2">
          <span className="text-emerald-400 font-mono text-xs font-bold">+</span>
          <span className="text-emerald-300 font-mono text-xs">{archetype.bonus}</span>
        </div>
        <div className="flex items-center gap-2 bg-crimson-900/30 border border-crimson-800 rounded px-3 py-2">
          <span className="text-crimson-400 font-mono text-xs font-bold">−</span>
          <span className="text-crimson-300 font-mono text-xs">{archetype.weakness}</span>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 bg-gold-400 text-navy-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
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
  const [paywall, setPaywall] = useState<{ entitlement: import('@republica/game-engine').EntitlementId; trigger: string } | null>(null);
  const { hasEntitlement } = useEntitlements();

  const canPlay = (archetypeId: string) => {
    if (archetypeId === 'ingeniero') return true;
    if (archetypeId === 'populista') return true;
    return hasEntitlement('presidents_pack') || hasEntitlement('full_access');
  };

  const canUseCrisisExpress = hasEntitlement('mode_crisis_express') || hasEntitlement('full_access');

  const handleSelect = (id: string) => {
    if (!canPlay(id)) { setPaywall({ entitlement: 'presidents_pack', trigger: 'president_select' }); return; }
    setSelected(id);
  };

  const handleToggleCrisisExpress = () => {
    if (!canUseCrisisExpress && !isCrisisExpress) { setPaywall({ entitlement: 'mode_crisis_express', trigger: 'president_select' }); return; }
    setCrisisExpress(!isCrisisExpress);
  };

  const handleConfirm = () => {
    setPresidentId(selected);
    navigate('/game');
  };

  const selectedArchetype = ARCHETYPES.find((a) => a.id === selected) ?? ARCHETYPES[1]!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-4xl w-full">
        {/* Historical scenario badge */}
        {scenarioId && (
          <div className="pixel-border-gold font-serif text-[8px] text-gold-400 bg-navy-800 px-3 py-2 mb-6 text-center tracking-wide">
            MODO HISTÓRICO: {t(HISTORICAL_SCENARIOS[scenarioId].labelKey)}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest mb-2">Elecciones presidenciales</p>
          <h1 className="font-serif text-4xl font-black text-smoke-100 mb-3">
            ¿Quién va a <span className="text-crimson-400">gobernar</span>?
          </h1>
          <p className="text-smoke-400 text-sm max-w-lg mx-auto">
            Cada presidente arranca con fortalezas y debilidades distintas. El país se acuerda de quién lo llevó a la gloria o al desastre.
          </p>
        </div>

        {/* Archetype grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
                  <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-navy-900/70 pointer-events-none">
                    <span className="text-3xl">🔒</span>
                    <span className="text-gold-400 font-mono text-xs mt-1">$2.99</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Crisis Express toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <button
            onClick={handleToggleCrisisExpress}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
              isCrisisExpress
                ? 'bg-crimson-900/50 border-crimson-500 shadow-lg shadow-crimson-500/20'
                : 'bg-navy-800 border-navy-600 hover:border-navy-400'
            }`}
          >
            <div className="text-left">
              <p className={`font-mono font-bold text-sm uppercase tracking-widest ${isCrisisExpress ? 'text-crimson-300' : 'text-smoke-400'}`}>
                ⚡ Crisis Express {!canUseCrisisExpress && <span className="ml-2 text-gold-400">🔒 $1.99</span>}
              </p>
              <p className="font-mono text-xs text-smoke-500 mt-0.5">
                45s por turno · 15 turnos · ×1.5 daño · ×2 puntaje
              </p>
            </div>
            <div className={`w-10 h-6 rounded-full border-2 flex items-center transition-all duration-200 ${
              isCrisisExpress ? 'bg-crimson-500 border-crimson-400 justify-end' : 'bg-navy-700 border-navy-500 justify-start'
            }`}>
              <div className="w-4 h-4 rounded-full bg-smoke-100 mx-0.5" />
            </div>
          </button>
        </motion.div>

        {/* Confirm button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={handleConfirm}
            className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-xl text-xl transition-colors uppercase tracking-wider shadow-lg"
          >
            {selectedArchetype
              ? `Asumir como ${selectedArchetype.name} ${selectedArchetype.lastName} →`
              : 'Seleccioná un presidente'}
          </button>
        </motion.div>

        <button
          onClick={() => { setScenario(null); navigate('/'); }}
          className="w-full mt-3 text-smoke-500 font-mono text-xs hover:text-smoke-300 py-2"
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
    </motion.div>
  );
}
