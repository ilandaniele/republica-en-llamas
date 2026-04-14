import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { EventCard, GameState, ChoiceEffect } from '@republica/game-engine';

// ── Types ────────────────────────────────────────────────────────────────────

type Phase = 'negotiation' | 'voting' | 'swing' | 'result';
type VoteStatus = 'pending' | 'yes' | 'no' | 'abstain';
type SeatBloc = 'hardOpposition' | 'proOpposition' | 'independent' | 'government';

interface Seat {
  x: number;
  y: number;
  bloc: SeatBloc;
  index: number;
}

interface SwingSen {
  id: string;
  name: string;
  province: string;
  bloc: string;
  demand: string;
  costLabel: string;
  effects: ChoiceEffect;
}

interface NegAction {
  id: string;
  icon: string;
  label: string;
  voteRange: [number, number];
  preview: string;
  costLabel: string;
  effects: ChoiceEffect;
  isDecree?: boolean;
}

interface Props {
  card: EventCard;
  gameState: GameState;
  presidentId: string;
  onComplete: (choiceIndex: number, negEffects: ChoiceEffect) => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const VISUAL_SEATS = 257;
const VISUAL_REQUIRED = 129; // Math.floor(257/2)+1
const ROW_COUNTS = [14, 20, 26, 32, 38, 44, 50, 33];
const ROW_RADII  = [80, 110, 140, 170, 200, 230, 260, 285];
const CX = 300, CY = 320;

const BLOC_COLORS: Record<SeatBloc, string> = {
  government:      '#9C27B0',
  hardOpposition:  '#1565C0',
  proOpposition:   '#FFD600',
  independent:     '#78909C',
};
const VOTE_COLORS: Record<VoteStatus, string | null> = {
  pending:  null,
  yes:      '#43A047',
  no:       '#E53935',
  abstain:  '#FFA726',
};

// ── Swing senators pool ──────────────────────────────────────────────────────

const SWING_POOL: SwingSen[] = [
  { id: 'urquiza',   name: 'Sen. Roberto Urquiza',     province: 'Chaco',          bloc: 'Interbloque Federal',    demand: '"Presidente, necesito que me garantice la obra del puente sobre el río Bermejo."',   costLabel: '+2% déficit',                    effects: { deficitDelta: 2 } },
  { id: 'ferreyra',  name: 'Dip. Graciela Ferreyra',   province: 'Salta',          bloc: 'Movimiento Popular',     demand: '"El sector minero salteño necesita ese subsidio. Sin él, no puedo acompañar."',      costLabel: '+2% déficit, −3 popularidad',   effects: { deficitDelta: 2, popularityDelta: -3 } },
  { id: 'dominguez', name: 'Sen. Carlos Domínguez',     province: 'Entre Ríos',     bloc: 'Federal Productivo',     demand: '"El campo entrerriano no aguanta más retenciones. Necesito una garantía escrita."',   costLabel: '+3% déficit',                    effects: { deficitDelta: 3 } },
  { id: 'paz',       name: 'Dip. Valeria Paz',          province: 'Neuquén',        bloc: 'MPN',                    demand: '"Las regalías petroleras de Neuquén tienen que actualizarse urgente."',              costLabel: '−4 reservas',                    effects: { foreignReservesDelta: -4 } },
  { id: 'villegas',  name: 'Sen. Matías Villegas',      province: 'Tucumán',        bloc: 'PJ Federal',             demand: '"El fondo universitario de Tucumán tiene que estar garantizado en el texto."',       costLabel: '+2% déficit, +5 popularidad',   effects: { deficitDelta: 2, popularityDelta: 5 } },
  { id: 'rios',      name: 'Dip. Adriana Ríos',         province: 'Corrientes',     bloc: 'Encuentro Liberal',      demand: '"La obra hídrica del Iberá no puede esperar. Es lo único que le pido."',              costLabel: '+2% déficit',                    effects: { deficitDelta: 2 } },
  { id: 'medina',    name: 'Sen. Jorge Medina',         province: 'San Juan',       bloc: 'Productivos del Centro', demand: '"Los beneficios al litio son innegociables para San Juan. Sin eso, no."',            costLabel: '+5 mercados, +1% déficit',       effects: { marketConfidenceDelta: 5, deficitDelta: 1 } },
  { id: 'torres',    name: 'Dip. Claudia Torres',       province: 'Tierra del Fuego', bloc: 'Fuerza Fueguina',     demand: '"La zona franca fueguina es lo único que sostenemos. Extiéndala."',                  costLabel: '+3% déficit',                    effects: { deficitDelta: 3 } },
  { id: 'blanco',    name: 'Sen. Ricardo Blanco',       province: 'La Rioja',       bloc: 'PJ Riojano',             demand: '"La ruta 40 cruza mi provincia. Sin plata para obras, no tengo cómo justificar mi voto."', costLabel: '+2% déficit',               effects: { deficitDelta: 2 } },
  { id: 'caceres',   name: 'Dip. Marta Cáceres',        province: 'Misiones',       bloc: 'Renovación Misionera',   demand: '"El turismo de Misiones necesita fondos ahora. Las Cataratas no pueden esperar."',  costLabel: '+1% déficit, +3 popularidad',   effects: { deficitDelta: 1, popularityDelta: 3 } },
];

// ── Negotiation actions ──────────────────────────────────────────────────────

const NEG_ACTIONS: NegAction[] = [
  {
    id: 'radical',
    icon: '📞',
    label: 'Llamar al bloque radical',
    voteRange: [8, 12],
    preview: 'Convocás a los radicales disidentes. Suman votos pero hay costos políticos.',
    costLabel: '−5 popularidad',
    effects: { popularityDelta: -5 },
  },
  {
    id: 'presupuesto',
    icon: '💰',
    label: 'Ofrecer partida presupuestaria',
    voteRange: [10, 15],
    preview: 'Comprás votos con fondos públicos. Efectivo pero costoso.',
    costLabel: '+3% déficit',
    effects: { deficitDelta: 3 },
  },
  {
    id: 'cadena',
    icon: '📺',
    label: 'Cadena nacional',
    voteRange: [3, 7],
    preview: 'Presión mediática sobre legisladores indecisos. Rinde menos de lo esperado.',
    costLabel: '−8 credibilidad mediática',
    effects: { mediaCredibilityDelta: -8 },
  },
  {
    id: 'gobernadores',
    icon: '🤝',
    label: 'Negociar con gobernadores',
    voteRange: [6, 10],
    preview: 'Alianza territorial a cambio de obra pública. Moderado pero real.',
    costLabel: '−2 reservas, −3 popularidad',
    effects: { foreignReservesDelta: -2, popularityDelta: -3 },
  },
  {
    id: 'decreto',
    icon: '⚡',
    label: 'Amenazar con decreto',
    voteRange: [0, 0],
    preview: 'Saltás el Congreso. La ley pasa pero la oposición y la prensa te destruyen.',
    costLabel: '+15 inestabilidad, −12 credibilidad',
    effects: { stabilityDelta: -15, mediaCredibilityDelta: -12, emergencyDecreeDelta: 1 },
    isDecree: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function mergeEffects(a: ChoiceEffect, b: ChoiceEffect): ChoiceEffect {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]) as Set<keyof ChoiceEffect>;
  const result: ChoiceEffect = {};
  for (const k of keys) {
    result[k] = ((a[k] as number) ?? 0) + ((b[k] as number) ?? 0);
  }
  return result;
}

function playTick(freq = 220) {
  try {
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch { /* ignore */ }
}

// ── Seat layout computation ──────────────────────────────────────────────────

function computeSeats(congress: GameState['congress']): Seat[] {
  const TOTAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;

  // Visual proportions (257 dots total)
  const visGov = Math.round(VISUAL_SEATS * congress.governmentSeats / TOTAL);
  const visOpp = congress.oppositionSeats > 0 ? Math.round(VISUAL_SEATS * congress.oppositionSeats / TOTAL) : 0;
  const visInd = VISUAL_SEATS - visGov - visOpp;
  const visHardOpp = Math.round(visOpp * 0.6);
  const visProOpp = visOpp - visHardOpp;

  // Compute raw positions
  const positions: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < ROW_COUNTS.length; row++) {
    const count = ROW_COUNTS[row]!;
    const r = ROW_RADII[row]!;
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * (1 - i / (count - 1));
      positions.push({ x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) });
    }
  }

  // Sort by x to assign blocs left (opposition) → right (government)
  const sorted = positions
    .map((pos, idx) => ({ ...pos, idx }))
    .sort((a, b) => a.x - b.x);

  // Bloc assignment
  const blocs: SeatBloc[] = [];
  for (let i = 0; i < visHardOpp; i++) blocs.push('hardOpposition');
  for (let i = 0; i < visProOpp; i++) blocs.push('proOpposition');
  for (let i = 0; i < visInd; i++) blocs.push('independent');
  for (let i = 0; i < visGov; i++) blocs.push('government');
  // fill any rounding leftover
  while (blocs.length < VISUAL_SEATS) blocs.push('government');

  const seats: Seat[] = new Array(VISUAL_SEATS);
  sorted.forEach((pos, sortedIdx) => {
    seats[pos.idx] = { x: pos.x, y: pos.y, bloc: blocs[sortedIdx] ?? 'independent', index: pos.idx };
  });
  return seats;
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export function CongressSession({ card, gameState, onComplete }: Props) {
  const { t } = useTranslation();
  const congress = gameState.congress;
  const TOTAL_REAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;
  const REQUIRED_REAL = Math.floor(TOTAL_REAL / 2) + 1;

  // ── Phase state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('negotiation');
  const [actionsUsed, setActionsUsed] = useState<string[]>([]);
  const [actionPoints, setActionPoints] = useState(3);
  const [negBonusVotes, setNegBonusVotes] = useState(0);    // extra YES votes (real count)
  const [negEffects, setNegEffects] = useState<ChoiceEffect>({});
  const [usedDecree, setUsedDecree] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Vote animation
  const [seatVotes, setSeatVotes] = useState<VoteStatus[]>(() => new Array(VISUAL_SEATS).fill('pending'));
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Swing senators (phase 4)
  const [swingSens, setSwingSens] = useState<SwingSen[]>([]);
  const [swingIdx, setSwingIdx] = useState(0);
  const [swingExtraYes, setSwingExtraYes] = useState(0);
  const [swingExtraNo, setSwingExtraNo] = useState(0);

  // Result
  const [finalYesReal, setFinalYesReal] = useState(0);

  // Seat layout (memoized)
  const seats = useMemo(() => computeSeats(congress), [congress.governmentSeats, congress.oppositionSeats, congress.independentSeats]);

  // ── Derived vote counts ────────────────────────────────────────────────────
  const indYesPercent = Math.min(100, (congress.independentSupportBonus ?? 0) + Math.round(negBonusVotes / Math.max(1, congress.independentSeats) * 100));
  const baseYesReal = congress.governmentSeats + Math.floor(congress.independentSeats * indYesPercent / 100);
  const projectedYes = baseYesReal;
  const projectedNo = TOTAL_REAL - projectedYes;

  // Current live vote count (from animated visual dots)
  const liveVisYes  = seatVotes.filter(v => v === 'yes').length;
  const liveVisNo   = seatVotes.filter(v => v === 'no').length;
  const liveRealYes = Math.round(liveVisYes * TOTAL_REAL / VISUAL_SEATS);
  const liveRealNo  = Math.round(liveVisNo  * TOTAL_REAL / VISUAL_SEATS);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => () => { timeoutsRef.current.forEach(clearTimeout); }, []);

  // ── Negotiation handler ────────────────────────────────────────────────────
  const handleAction = useCallback((action: NegAction) => {
    if (actionsUsed.includes(action.id) || actionPoints <= 0) return;

    if (action.isDecree) {
      setUsedDecree(true);
      setNegEffects(prev => mergeEffects(prev, action.effects));
      setActionsUsed(prev => [...prev, action.id]);
      // Skip to result immediately
      setPhase('result');
      setFinalYesReal(TOTAL_REAL); // decree passes regardless
      return;
    }

    const bonus = action.voteRange[0] + Math.floor(Math.random() * (action.voteRange[1] - action.voteRange[0] + 1));
    setNegBonusVotes(prev => prev + bonus);
    setNegEffects(prev => mergeEffects(prev, action.effects));
    setActionsUsed(prev => [...prev, action.id]);
    setActionPoints(prev => prev - 1);
  }, [actionsUsed, actionPoints, TOTAL_REAL]);

  // ── Start voting animation ─────────────────────────────────────────────────
  const startVoting = useCallback(() => {
    setPhase('voting');

    const oppSeats  = seats.filter(s => s.bloc === 'hardOpposition' || s.bloc === 'proOpposition');
    const indSeats  = seats.filter(s => s.bloc === 'independent');
    const govSeats  = seats.filter(s => s.bloc === 'government');

    // Compute how many visual independents vote yes
    const visIndYes = Math.round(indSeats.length * Math.min(100, indYesPercent) / 100);
    const indNoCount = Math.round(indSeats.length * 0.60) - visIndYes;
    // Build vote type array and shuffle so different seats abstain/no each session
    const voteTypes: VoteStatus[] = [
      ...Array(visIndYes).fill('yes' as VoteStatus),
      ...Array(Math.max(0, indNoCount)).fill('no' as VoteStatus),
      ...Array(Math.max(0, indSeats.length - visIndYes - Math.max(0, indNoCount))).fill('abstain' as VoteStatus),
    ];
    for (let i = voteTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = voteTypes[i]!;
      voteTypes[i] = voteTypes[j]!;
      voteTypes[j] = tmp;
    }
    const voteMap = new Map<number, VoteStatus>();
    indSeats.forEach((seat, i) => {
      voteMap.set(seat.index, voteTypes[i] ?? 'abstain');
    });

    let delay = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];

    // Wave 1 – opposition votes NO
    oppSeats.forEach(seat => {
      ts.push(setTimeout(() => {
        setSeatVotes(prev => { const n=[...prev]; n[seat.index]='no'; return n; });
        playTick(180);
      }, delay));
      delay += 12;
    });

    // 800ms gap
    delay += 800;

    // Wave 2 – independents (suspense)
    indSeats.forEach(seat => {
      const status = voteMap.get(seat.index) ?? 'abstain';
      ts.push(setTimeout(() => {
        setSeatVotes(prev => { const n=[...prev]; n[seat.index]=status; return n; });
        playTick(status === 'yes' ? 440 : 200);
      }, delay));
      delay += 55;
    });

    // 800ms gap
    delay += 800;

    // Wave 3 – government votes YES (rapid)
    govSeats.forEach(seat => {
      ts.push(setTimeout(() => {
        setSeatVotes(prev => { const n=[...prev]; n[seat.index]='yes'; return n; });
        playTick(440);
      }, delay));
      delay += 8;
    });

    // Compute final result
    ts.push(setTimeout(() => {
      const finalYes = baseYesReal + (negBonusVotes - congress.independentSeats * (congress.independentSupportBonus ?? 0) / 100);
      const realYes = Math.max(0, Math.round(baseYesReal));
      setFinalYesReal(realYes);
      const margin = Math.abs(realYes - REQUIRED_REAL);

      if (margin <= 5 && SWING_POOL.length > 0) {
        // Select 3 random swing senators
        const shuffled = [...SWING_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
        setSwingSens(shuffled);
        setSwingIdx(0);
        setPhase('swing');
      } else {
        setPhase('result');
      }
    }, delay + 600));

    timeoutsRef.current = ts;
  }, [seats, indYesPercent, baseYesReal, negBonusVotes, congress, REQUIRED_REAL]);

  // ── Swing senator decisions ────────────────────────────────────────────────
  const handleSwingChoice = useCallback((choice: 'accept' | 'refuse' | 'decide') => {
    const sen = swingSens[swingIdx];
    if (!sen) return;

    if (choice === 'accept') {
      setNegEffects(prev => mergeEffects(prev, sen.effects));
      setSwingExtraYes(prev => prev + 1);
    } else if (choice === 'refuse') {
      setSwingExtraNo(prev => prev + 1);
    } else {
      // Random 50/50
      if (Math.random() < 0.5) setSwingExtraYes(prev => prev + 1);
      else setSwingExtraNo(prev => prev + 1);
    }

    const next = swingIdx + 1;
    if (next >= swingSens.length) {
      setPhase('result');
    } else {
      setSwingIdx(next);
    }
  }, [swingSens, swingIdx]);

  // ── Result computation ─────────────────────────────────────────────────────
  const finalYes = finalYesReal + swingExtraYes - swingExtraNo;
  const lawPassed = usedDecree || finalYes >= REQUIRED_REAL;
  const resultChoiceIdx = usedDecree ? 2 : lawPassed ? 0 : 1;
  const margin = Math.abs(finalYes - REQUIRED_REAL);

  // ── Render helpers ─────────────────────────────────────────────────────────
  function seatColor(seat: Seat, vote: VoteStatus): string {
    const vc = VOTE_COLORS[vote];
    if (vc) return vc;
    return BLOC_COLORS[seat.bloc];
  }

  const barWidth = 360;
  const markerPct = REQUIRED_REAL / TOTAL_REAL;
  const noBarPct  = Math.min(1, liveRealNo / TOTAL_REAL);
  const yesBarPct = Math.min(1, liveRealYes / TOTAL_REAL);

  // ── Render: Negotiation ────────────────────────────────────────────────────
  const renderNegotiation = () => (
    <motion.div
      key="negotiation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest mb-1">Sesión ordinaria del Congreso</p>
        <h2 className="font-serif text-xl font-bold text-smoke-100">{t(card.titleKey)}</h2>
        <p className="text-smoke-400 text-sm mt-1 leading-relaxed max-w-lg mx-auto">{t(card.bodyKey)}</p>
      </div>

      {/* Seat count */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-purple-900/40 border border-purple-700 rounded-lg px-3 py-2">
          <p className="font-mono text-xs text-purple-400 uppercase">Oficialismo</p>
          <p className="font-mono font-bold text-purple-200 text-lg">{congress.governmentSeats}</p>
        </div>
        <div className="bg-navy-800 border border-navy-600 rounded-lg px-3 py-2">
          <p className="font-mono text-xs text-smoke-500 uppercase">Independientes</p>
          <p className="font-mono font-bold text-smoke-200 text-lg">{congress.independentSeats}</p>
        </div>
        <div className="bg-blue-900/40 border border-blue-700 rounded-lg px-3 py-2">
          <p className="font-mono text-xs text-blue-400 uppercase">Oposición</p>
          <p className="font-mono font-bold text-blue-200 text-lg">{congress.oppositionSeats}</p>
        </div>
      </div>

      {/* Projected votes */}
      <div className="bg-navy-800 border border-navy-600 rounded-lg px-4 py-3">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-mono text-xs text-smoke-500">Proyección actual</span>
            <p className="font-mono font-bold text-smoke-100">
              <span className="text-emerald-400">{projectedYes} SÍ</span>
              <span className="text-smoke-600 mx-2">|</span>
              <span className="text-crimson-400">{projectedNo} NO</span>
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-smoke-500">Se necesitan</span>
            <p className="font-mono font-bold text-gold-400 text-lg">{REQUIRED_REAL}</p>
          </div>
        </div>
        {projectedYes >= REQUIRED_REAL ? (
          <p className="text-emerald-400 font-mono text-xs mt-1">✓ Con votos suficientes para pasar</p>
        ) : (
          <p className="text-crimson-400 font-mono text-xs mt-1">⚠ Faltan {REQUIRED_REAL - projectedYes} votos para la mayoría</p>
        )}
      </div>

      {/* Action points */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-smoke-500">Acciones disponibles:</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full border ${i < actionPoints ? 'bg-gold-400 border-gold-300' : 'bg-navy-700 border-navy-600'}`} />
        ))}
        <span className="font-mono text-xs text-smoke-500 ml-1">({actionPoints} restantes)</span>
      </div>

      {/* Negotiation buttons */}
      <div className="space-y-2">
        {NEG_ACTIONS.map(action => {
          const used = actionsUsed.includes(action.id);
          const canUse = !used && (action.isDecree || actionPoints > 0);
          const isHovered = hoveredAction === action.id;

          return (
            <motion.button
              key={action.id}
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={!canUse}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${
                used
                  ? 'border-navy-700 bg-navy-800/40 opacity-40 cursor-not-allowed'
                  : action.isDecree
                    ? 'border-crimson-700 bg-crimson-900/30 hover:bg-crimson-900/50 cursor-pointer'
                    : 'border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-navy-700 cursor-pointer'
              } ${!canUse && !used ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={canUse ? { x: 2 } : {}}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0 mt-0.5">{action.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-mono font-bold text-sm ${used ? 'line-through text-smoke-600' : action.isDecree ? 'text-crimson-300' : 'text-smoke-200'}`}>
                      {action.label}
                    </span>
                    {!action.isDecree && !used && (
                      <span className="font-mono text-xs text-emerald-400 shrink-0">
                        +{action.voteRange[0]}–{action.voteRange[1]} votos
                      </span>
                    )}
                    {used && <span className="font-mono text-xs text-smoke-600">Utilizada</span>}
                  </div>
                  <AnimatePresence>
                    {isHovered && !used && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-smoke-400 text-xs mt-1">{action.preview}</p>
                        <p className="text-crimson-400 font-mono text-xs mt-0.5">Costo: {action.costLabel}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Go to vote button */}
      <button
        onClick={startVoting}
        className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-serif font-bold py-3 px-6 rounded-md transition-colors uppercase tracking-wider"
      >
        🏛 Llamar a votar →
      </button>
    </motion.div>
  );

  // ── Render: Hemiciclo + voting ─────────────────────────────────────────────
  const renderVoting = () => (
    <motion.div
      key="voting"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="text-center">
        <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest">{t(card.titleKey)}</p>
        <p className="font-mono text-sm text-smoke-400 mt-1">Hemiciclo en vivo</p>
      </div>

      {/* SVG Hemiciclo */}
      <div className="w-full overflow-hidden rounded-lg bg-navy-900 border border-navy-700">
        <svg
          viewBox="0 0 600 345"
          className="w-full h-auto"
          style={{ display: 'block', maxHeight: '340px' }}
        >
          {/* Arc guide lines (subtle) */}
          {ROW_RADII.map(r => (
            <path
              key={r}
              d={`M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
          ))}

          {/* Seats */}
          {seats.map(seat => {
            const vote = seatVotes[seat.index] ?? 'pending';
            const color = seatColor(seat, vote);
            const isPending = vote === 'pending';
            return (
              <circle
                key={seat.index}
                cx={seat.x}
                cy={seat.y}
                r={5}
                fill={color}
                opacity={isPending ? 0.5 : 1}
                style={{ transition: 'fill 0.15s ease, opacity 0.15s ease' }}
              />
            );
          })}

          {/* Center label */}
          <text x={CX} y={CY + 16} textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace">
            {REQUIRED_REAL} votos para mayoría
          </text>

          {/* Pixel CHORI vendor — Argentine congress culture */}
          <g transform="translate(510,285)">
            {/* Body */}
            <rect x="2" y="8" width="12" height="14" fill="#8B4513" />
            {/* Head */}
            <rect x="4" y="2" width="8" height="8" fill="#F5C8A0" />
            {/* Hat */}
            <rect x="2" y="0" width="12" height="4" fill="#4A3728" />
            {/* Wheelbarrow */}
            <rect x="-4" y="16" width="20" height="6" fill="#888" />
            <rect x="6" y="22" width="4" height="4" fill="#555" />
            {/* Sausages on barrow */}
            <rect x="0" y="14" width="6" height="3" fill="#CC6633" />
            <rect x="7" y="14" width="6" height="3" fill="#CC5522" />
          </g>
        </svg>
      </div>

      {/* Live vote counter bar */}
      <div className="px-2">
        <div className="flex justify-between font-mono text-xs text-smoke-400 mb-1">
          <span className="text-crimson-400">NO: {liveRealNo}</span>
          <span className="text-smoke-500">— {REQUIRED_REAL} necesarios —</span>
          <span className="text-emerald-400">SÍ: {liveRealYes}</span>
        </div>
        <div className="relative h-4 bg-navy-800 border border-navy-600 rounded-full overflow-hidden" style={{ width: '100%' }}>
          {/* NO fill from left */}
          <div
            className="absolute left-0 top-0 h-full bg-crimson-600 transition-all duration-100"
            style={{ width: `${noBarPct * 100}%` }}
          />
          {/* YES fill from right */}
          <div
            className="absolute right-0 top-0 h-full bg-emerald-600 transition-all duration-100"
            style={{ width: `${yesBarPct * 100}%` }}
          />
          {/* Required marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-gold-400 z-10"
            style={{ left: `${markerPct * 100}%` }}
          />
        </div>
        <div className="flex justify-between font-mono text-xs text-smoke-600 mt-1">
          <span>Oposición</span>
          <span className="text-gold-500">← mayoría →</span>
          <span>Oficialismo</span>
        </div>
      </div>

      {/* Bloc legend */}
      <div className="flex flex-wrap gap-3 justify-center font-mono text-xs text-smoke-500">
        {([ ['#9C27B0', 'Oficialismo'], ['#1565C0', 'UxP'], ['#FFD600', 'PRO'], ['#78909C', 'Independientes'], ['#43A047', 'SÍ'], ['#E53935', 'NO'], ['#FFA726', 'Abstención'] ] as const).map(([color, label]) => (
          <span key={label} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );

  // ── Render: Swing senator ──────────────────────────────────────────────────
  const renderSwing = () => {
    const sen = swingSens[swingIdx];
    if (!sen) return null;

    return (
      <motion.div
        key={`swing-${swingIdx}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="space-y-4"
      >
        {/* Hemiciclo (smaller, frozen) */}
        <div className="w-full overflow-hidden rounded-lg bg-navy-900 border border-navy-700">
          <svg viewBox="0 0 600 345" className="w-full h-auto" style={{ display: 'block', maxHeight: '200px' }}>
            {seats.map(seat => {
              const vote = seatVotes[seat.index] ?? 'pending';
              const color = seatColor(seat, vote);
              const isPending = vote === 'pending';
              return (
                <circle key={seat.index} cx={seat.x} cy={seat.y} r={5} fill={color} opacity={isPending ? 0.4 : 1} />
              );
            })}
          </svg>
        </div>

        {/* Current count */}
        <div className="text-center font-mono text-sm">
          <span className="text-emerald-400">{finalYesReal + swingExtraYes} SÍ</span>
          <span className="text-smoke-600 mx-2">—</span>
          <span className="text-crimson-400">{TOTAL_REAL - finalYesReal - swingExtraYes + swingExtraNo} NO</span>
          <span className="text-smoke-500 ml-3 text-xs">({REQUIRED_REAL} para mayoría)</span>
        </div>

        {/* Senator card */}
        <div className="bg-navy-800 border-2 border-gold-600 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center text-xl shrink-0">
              🏛
            </div>
            <div>
              <p className="font-serif font-bold text-smoke-100">{sen.name}</p>
              <p className="font-mono text-xs text-smoke-500">{sen.bloc} · {sen.province}</p>
            </div>
            <div className="ml-auto bg-gold-900/40 border border-gold-700 rounded px-2 py-1">
              <p className="font-mono text-xs text-gold-400">⚡ VOTO SORPRESA</p>
              <p className="font-mono text-xs text-smoke-500">{swingIdx + 1}/{swingSens.length}</p>
            </div>
          </div>

          <p className="text-smoke-300 text-sm italic border-l-2 border-gold-700 pl-3">{sen.demand}</p>

          <div className="space-y-2">
            <button
              onClick={() => handleSwingChoice('accept')}
              className="w-full bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-600 text-emerald-200 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors"
            >
              <span>✅ Acepto la demanda</span>
              <span className="text-xs text-emerald-400">{sen.costLabel} · +1 voto</span>
            </button>
            <button
              onClick={() => handleSwingChoice('refuse')}
              className="w-full bg-crimson-900/40 hover:bg-crimson-800/40 border border-crimson-700 text-crimson-200 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors"
            >
              <span>❌ Me niego</span>
              <span className="text-xs text-crimson-400">−1 voto</span>
            </button>
            <button
              onClick={() => handleSwingChoice('decide')}
              className="w-full bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-300 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors"
            >
              <span>🎲 Dejarlo decidir solo</span>
              <span className="text-xs text-smoke-500">50/50</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // ── Render: Result ────────────────────────────────────────────────────────
  const renderResult = () => {
    const anibalQuotes = {
      pass: `Zafaron por ${margin} votos. La próxima no van a tener tanta suerte.`,
      fail: `El gobierno perdió en el Congreso. ¿Alguien avisó al Presidente?`,
      decree: `Gobernar por decreto. Clásico argentino. Alguien dígale que esto tiene consecuencias.`,
    };
    const mode = usedDecree ? 'decree' : lawPassed ? 'pass' : 'fail';

    return (
      <motion.div
        key="result"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        {/* Result banner */}
        <div className={`rounded-xl border-2 p-6 text-center ${
          usedDecree
            ? 'border-orange-600 bg-orange-900/30'
            : lawPassed
              ? 'border-emerald-600 bg-emerald-900/20'
              : 'border-crimson-600 bg-crimson-900/20'
        }`}>
          <p className="text-4xl mb-3">{usedDecree ? '📋' : lawPassed ? '✅' : '❌'}</p>
          <h2 className={`font-serif text-2xl font-black mb-2 ${usedDecree ? 'text-orange-300' : lawPassed ? 'text-emerald-300' : 'text-crimson-300'}`}>
            {usedDecree
              ? 'DECRETO DE NECESIDAD Y URGENCIA'
              : lawPassed
                ? 'LEY APROBADA'
                : 'LEY RECHAZADA'}
          </h2>
          <p className="font-serif text-lg text-smoke-100 mb-1">{t(card.titleKey)}</p>
          {!usedDecree && (
            <p className="font-mono text-sm text-smoke-400">
              {finalYes} votos a favor — {TOTAL_REAL - finalYes} en contra
              {lawPassed
                ? ` — aprobada por ${margin} votos`
                : ` — faltaron ${margin} para la mayoría`}
            </p>
          )}
          {usedDecree && (
            <p className="font-mono text-sm text-orange-400">Promulgada sin votación parlamentaria</p>
          )}
        </div>

        {/* Effect preview */}
        <div className="bg-navy-800 border border-navy-600 rounded-lg px-4 py-3">
          <p className="font-mono text-sm text-smoke-500 uppercase tracking-widest mb-2">Consecuencias inmediatas</p>
          <div className="font-mono text-sm text-smoke-300">
            {(() => {
              const choice = card.choices[resultChoiceIdx];
              if (!choice) return null;
              const e = choice.effects;
              return (
                <div className="space-y-1">
                  {e.popularityDelta !== undefined && <p>{e.popularityDelta >= 0 ? '▲' : '▼'} Popularidad {e.popularityDelta > 0 ? '+' : ''}{e.popularityDelta}</p>}
                  {e.stabilityDelta !== undefined && <p>{e.stabilityDelta >= 0 ? '▲' : '▼'} Estabilidad {e.stabilityDelta > 0 ? '+' : ''}{e.stabilityDelta}</p>}
                  {e.marketConfidenceDelta !== undefined && <p>{e.marketConfidenceDelta >= 0 ? '▲' : '▼'} Mercados {e.marketConfidenceDelta > 0 ? '+' : ''}{e.marketConfidenceDelta}</p>}
                  {e.deficitDelta !== undefined && <p>{e.deficitDelta <= 0 ? '▲' : '▼'} Déficit {e.deficitDelta > 0 ? '+' : ''}{e.deficitDelta}%</p>}
                  {e.lawsPassedDelta !== undefined && e.lawsPassedDelta > 0 && <p>✓ Ley promulgada</p>}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Aníbal quote */}
        <div className="bg-navy-800/60 border border-navy-700 rounded px-4 py-3 flex items-start gap-2">
          <span className="text-gold-500 font-mono text-xs shrink-0 mt-0.5">📻</span>
          <p className="text-smoke-400 font-mono text-xs italic">
            "{anibalQuotes[mode]}" — <span className="text-smoke-500">El Gordo Aníbal, Radio AM 1010</span>
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={() => onComplete(resultChoiceIdx, negEffects)}
          className={`w-full font-serif font-bold py-3 px-6 rounded-md uppercase tracking-wider transition-colors ${
            lawPassed || usedDecree
              ? 'bg-gold-500 hover:bg-gold-400 text-navy-900'
              : 'bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-200'
          }`}
        >
          Continuar con el gobierno →
        </button>
      </motion.div>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="event-card border-l-4 border-l-[#1a237e]">
      <div className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3 text-blue-400`}>
        <span className="text-base">🏛</span>
        <span>SESIÓN PARLAMENTARIA</span>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'negotiation' && renderNegotiation()}
        {phase === 'voting' && renderVoting()}
        {phase === 'swing' && renderSwing()}
        {phase === 'result' && renderResult()}
      </AnimatePresence>
    </div>
  );
}
