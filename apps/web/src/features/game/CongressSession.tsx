import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CONGRESS_ACTIONS, resolveCongressSession } from '@republica/game-engine';
import type {
  EventCard,
  GameState,
  CongressActionId,
  CongressDecisions,
  SwingChoice,
  SwingLegislatorId,
} from '@republica/game-engine';

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
  id: SwingLegislatorId;
  name: string;
  province: string;
  bloc: string;
  demand: string;
  costLabel: string;
}

interface NegActionText {
  id: CongressActionId;
  icon: string;
  label: string;
  preview: string;
  costLabel: string;
}

interface Props {
  card: EventCard;
  gameState: GameState;
  presidentId: string;
  onComplete: (decisions: CongressDecisions) => void;
}

// ── Constants ────────────────────────────────────────────────────────────────

const VISUAL_SEATS = 257;
const ROW_COUNTS = [14, 20, 26, 32, 38, 44, 50, 33];
const ROW_RADII = [80, 110, 140, 170, 200, 230, 260, 285];
const CX = 300,
  CY = 320;

const BLOC_COLORS: Record<SeatBloc, string> = {
  government: '#9C27B0',
  hardOpposition: '#1565C0',
  proOpposition: '#FFD600',
  independent: '#78909C',
};
const VOTE_COLORS: Record<VoteStatus, string | null> = {
  pending: null,
  yes: '#43A047',
  no: '#E53935',
  abstain: '#FFA726',
};

// ── Swing senators pool ──────────────────────────────────────────────────────

const SWING_POOL: SwingSen[] = [
  {
    id: 'urquiza',
    name: 'Sen. Roberto Urquiza',
    province: 'Chaco',
    bloc: 'Interbloque Federal',
    demand: '"Presidente, necesito que me garantice la obra del puente sobre el río Bermejo."',
    costLabel: '+2% déficit',
  },
  {
    id: 'ferreyra',
    name: 'Dip. Graciela Ferreyra',
    province: 'Salta',
    bloc: 'Movimiento Popular',
    demand: '"El sector minero salteño necesita ese subsidio. Sin él, no puedo acompañar."',
    costLabel: '+2% déficit, −3 popularidad',
  },
  {
    id: 'dominguez',
    name: 'Sen. Carlos Domínguez',
    province: 'Entre Ríos',
    bloc: 'Federal Productivo',
    demand: '"El campo entrerriano no aguanta más retenciones. Necesito una garantía escrita."',
    costLabel: '+3% déficit',
  },
  {
    id: 'paz',
    name: 'Dip. Valeria Paz',
    province: 'Neuquén',
    bloc: 'MPN',
    demand: '"Las regalías petroleras de Neuquén tienen que actualizarse urgente."',
    costLabel: '−4 reservas',
  },
  {
    id: 'villegas',
    name: 'Sen. Matías Villegas',
    province: 'Tucumán',
    bloc: 'PJ Federal',
    demand: '"El fondo universitario de Tucumán tiene que estar garantizado en el texto."',
    costLabel: '+2% déficit, +5 popularidad',
  },
  {
    id: 'rios',
    name: 'Dip. Adriana Ríos',
    province: 'Corrientes',
    bloc: 'Encuentro Liberal',
    demand: '"La obra hídrica del Iberá no puede esperar. Es lo único que le pido."',
    costLabel: '+2% déficit',
  },
  {
    id: 'medina',
    name: 'Sen. Jorge Medina',
    province: 'San Juan',
    bloc: 'Productivos del Centro',
    demand: '"Los beneficios al litio son innegociables para San Juan. Sin eso, no."',
    costLabel: '+5 mercados, +1% déficit',
  },
  {
    id: 'torres',
    name: 'Dip. Claudia Torres',
    province: 'Tierra del Fuego',
    bloc: 'Fuerza Fueguina',
    demand: '"La zona franca fueguina es lo único que sostenemos. Extiéndala."',
    costLabel: '+3% déficit',
  },
  {
    id: 'blanco',
    name: 'Sen. Ricardo Blanco',
    province: 'La Rioja',
    bloc: 'PJ Riojano',
    demand: '"La ruta 40 cruza mi provincia. Sin plata para obras, no tengo cómo justificar mi voto."',
    costLabel: '+2% déficit',
  },
  {
    id: 'caceres',
    name: 'Dip. Marta Cáceres',
    province: 'Misiones',
    bloc: 'Renovación Misionera',
    demand: '"El turismo de Misiones necesita fondos ahora. Las Cataratas no pueden esperar."',
    costLabel: '+1% déficit, +3 popularidad',
  },
];

// ── Negotiation actions ──────────────────────────────────────────────────────

const NEG_ACTION_TEXT: NegActionText[] = [
  {
    id: 'radical',
    icon: '📞',
    label: 'Llamar al bloque radical',
    preview: 'Convocás a los radicales disidentes. Suman votos pero hay costos políticos.',
    costLabel: '−5 popularidad',
  },
  {
    id: 'presupuesto',
    icon: '💰',
    label: 'Ofrecer partida presupuestaria',
    preview: 'Comprás votos con fondos públicos. Efectivo pero costoso.',
    costLabel: '+3% déficit',
  },
  {
    id: 'cadena',
    icon: '📺',
    label: 'Cadena nacional',
    preview: 'Presión mediática sobre legisladores indecisos. Rinde menos de lo esperado.',
    costLabel: '−8 credibilidad mediática',
  },
  {
    id: 'gobernadores',
    icon: '🤝',
    label: 'Negociar con gobernadores',
    preview: 'Alianza territorial a cambio de obra pública. Moderado pero real.',
    costLabel: '−2 reservas, −3 popularidad',
  },
  {
    id: 'decreto',
    icon: '⚡',
    label: 'Amenazar con decreto',
    preview: 'Saltás el Congreso. La ley pasa pero la oposición y la prensa te destruyen.',
    costLabel: '+15 inestabilidad, −12 credibilidad',
  },
];

const NEG_ACTIONS = NEG_ACTION_TEXT.map((text) => ({ ...text, ...CONGRESS_ACTIONS[text.id] }));

// ── Helpers ──────────────────────────────────────────────────────────────────

function playTick(freq = 220) {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  } catch {
    /* ignore */
  }
}

// ── Seat layout computation ──────────────────────────────────────────────────

function computeSeats(congress: GameState['congress']): Seat[] {
  const TOTAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;

  // Visual proportions (257 dots total)
  const visGov = Math.round((VISUAL_SEATS * congress.governmentSeats) / TOTAL);
  const visOpp =
    congress.oppositionSeats > 0 ? Math.round((VISUAL_SEATS * congress.oppositionSeats) / TOTAL) : 0;
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
  const sorted = positions.map((pos, idx) => ({ ...pos, idx })).sort((a, b) => a.x - b.x);

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

  // ── Phase state ────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('negotiation');
  const [decisions, setDecisions] = useState<CongressDecisions>({ actions: [], swingChoices: [] });
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  // Vote animation
  const [seatVotes, setSeatVotes] = useState<VoteStatus[]>(() => new Array(VISUAL_SEATS).fill('pending'));
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const outcome = useMemo(() => resolveCongressSession(gameState, decisions), [gameState, decisions]);
  const TOTAL_REAL = outcome.totalSeats;
  const REQUIRED_REAL = outcome.requiredVotes;
  const actionsUsed = decisions.actions;
  const actionPoints = outcome.actionPointsLeft;
  const swingSens = useMemo(
    () => outcome.swingCandidates.flatMap((id) => SWING_POOL.filter((sen) => sen.id === id)),
    [outcome.swingCandidates],
  );
  const swingIdx = decisions.swingChoices.length;

  // Seat layout (memoized)
  const seats = useMemo(
    () => computeSeats(congress),
    [congress.governmentSeats, congress.oppositionSeats, congress.independentSeats],
  );

  // ── Derived vote counts ────────────────────────────────────────────────────
  const indYesPercent = outcome.independentYesPercent;
  const projectedYes = outcome.votingYes;
  const projectedNo = TOTAL_REAL - projectedYes;

  // Current live vote count (from animated visual dots)
  const liveVisYes = seatVotes.filter((v) => v === 'yes').length;
  const liveVisNo = seatVotes.filter((v) => v === 'no').length;
  const liveRealYes = Math.round((liveVisYes * TOTAL_REAL) / VISUAL_SEATS);
  const liveRealNo = Math.round((liveVisNo * TOTAL_REAL) / VISUAL_SEATS);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(
    () => () => {
      timeoutsRef.current.forEach(clearTimeout);
    },
    [],
  );

  // ── Negotiation handler ────────────────────────────────────────────────────
  const handleAction = useCallback(
    (action: (typeof NEG_ACTIONS)[number]) => {
      if (actionsUsed.includes(action.id) || actionPoints <= 0) return;
      setDecisions((prev) => ({ ...prev, actions: [...prev.actions, action.id] }));
      if (action.isDecree) setPhase('result');
    },
    [actionsUsed, actionPoints],
  );

  // ── Start voting animation ─────────────────────────────────────────────────
  const startVoting = useCallback(() => {
    setPhase('voting');

    const oppSeats = seats.filter((s) => s.bloc === 'hardOpposition' || s.bloc === 'proOpposition');
    const indSeats = seats.filter((s) => s.bloc === 'independent');
    const govSeats = seats.filter((s) => s.bloc === 'government');

    // Compute how many visual independents vote yes
    const visIndYes = Math.round((indSeats.length * Math.min(100, indYesPercent)) / 100);
    const indNoCount = Math.round(indSeats.length * 0.6) - visIndYes;
    // Build vote type array and shuffle so different seats abstain/no each session
    const voteTypes: VoteStatus[] = [
      ...Array(visIndYes).fill('yes' as VoteStatus),
      ...Array(Math.max(0, indNoCount)).fill('no' as VoteStatus),
      ...Array(Math.max(0, indSeats.length - visIndYes - Math.max(0, indNoCount))).fill(
        'abstain' as VoteStatus,
      ),
    ];
    for (let i = voteTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = voteTypes[i] as VoteStatus;
      voteTypes[i] = voteTypes[j] as VoteStatus;
      voteTypes[j] = tmp;
    }
    const voteMap = new Map<number, VoteStatus>();
    indSeats.forEach((seat, i) => {
      voteMap.set(seat.index, voteTypes[i] ?? 'abstain');
    });

    let delay = 0;
    const ts: ReturnType<typeof setTimeout>[] = [];

    // Wave 1 – opposition votes NO
    oppSeats.forEach((seat) => {
      ts.push(
        setTimeout(() => {
          setSeatVotes((prev) => {
            const n = [...prev];
            n[seat.index] = 'no';
            return n;
          });
          playTick(180);
        }, delay),
      );
      delay += 12;
    });

    // 800ms gap
    delay += 800;

    // Wave 2 – independents (suspense)
    indSeats.forEach((seat) => {
      const status = voteMap.get(seat.index) ?? 'abstain';
      ts.push(
        setTimeout(() => {
          setSeatVotes((prev) => {
            const n = [...prev];
            n[seat.index] = status;
            return n;
          });
          playTick(status === 'yes' ? 440 : 200);
        }, delay),
      );
      delay += 55;
    });

    // 800ms gap
    delay += 800;

    // Wave 3 – government votes YES (rapid)
    govSeats.forEach((seat) => {
      ts.push(
        setTimeout(() => {
          setSeatVotes((prev) => {
            const n = [...prev];
            n[seat.index] = 'yes';
            return n;
          });
          playTick(440);
        }, delay),
      );
      delay += 8;
    });

    // Compute final result
    ts.push(
      setTimeout(() => {
        setPhase(outcome.swingCandidates.length > 0 ? 'swing' : 'result');
      }, delay + 600),
    );

    timeoutsRef.current = ts;
  }, [seats, indYesPercent, outcome.swingCandidates]);

  // ── Swing senator decisions ────────────────────────────────────────────────
  const handleSwingChoice = useCallback(
    (choice: SwingChoice) => {
      if (swingIdx >= swingSens.length) return;
      setDecisions((prev) => ({ ...prev, swingChoices: [...prev.swingChoices, choice] }));
      if (swingIdx + 1 >= swingSens.length) setPhase('result');
    },
    [swingSens, swingIdx],
  );

  // ── Result computation ─────────────────────────────────────────────────────
  const { finalYes, usedDecree, passed: lawPassed, choiceIndex: resultChoiceIdx } = outcome;
  const margin = Math.abs(finalYes - REQUIRED_REAL);

  // ── Render helpers ─────────────────────────────────────────────────────────
  function seatColor(seat: Seat, vote: VoteStatus): string {
    const vc = VOTE_COLORS[vote];
    if (vc) return vc;
    return BLOC_COLORS[seat.bloc];
  }

  const markerPct = REQUIRED_REAL / TOTAL_REAL;
  const noBarPct = Math.min(1, liveRealNo / TOTAL_REAL);
  const yesBarPct = Math.min(1, liveRealYes / TOTAL_REAL);

  // ── Render: Negotiation ────────────────────────────────────────────────────
  const renderNegotiation = () => (
    <m.div
      key="negotiation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <p className="text-smoke-500 mb-1 font-mono text-xs uppercase tracking-widest">
          Sesión ordinaria del Congreso
        </p>
        <h2 className="font-serif text-xl font-bold text-smoke-100">{t(card.titleKey)}</h2>
        <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-smoke-400">{t(card.bodyKey)}</p>
      </div>

      {/* Seat count */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-purple-700 bg-purple-900/40 px-3 py-2">
          <p className="font-mono text-xs uppercase text-purple-400">Oficialismo</p>
          <p className="font-mono text-lg font-bold text-purple-200">{congress.governmentSeats}</p>
        </div>
        <div className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2">
          <p className="text-smoke-500 font-mono text-xs uppercase">Independientes</p>
          <p className="font-mono text-lg font-bold text-smoke-200">{congress.independentSeats}</p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/40 px-3 py-2">
          <p className="font-mono text-xs uppercase text-blue-400">Oposición</p>
          <p className="font-mono text-lg font-bold text-blue-200">{congress.oppositionSeats}</p>
        </div>
      </div>

      {/* Projected votes */}
      <div className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-smoke-500 font-mono text-xs">Proyección actual</span>
            <p className="font-mono font-bold text-smoke-100">
              <span className="text-emerald-400">{projectedYes} SÍ</span>
              <span className="mx-2 text-smoke-600">|</span>
              <span className="text-crimson-400">{projectedNo} NO</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-smoke-500 font-mono text-xs">Se necesitan</span>
            <p className="font-mono text-lg font-bold text-gold-400">{REQUIRED_REAL}</p>
          </div>
        </div>
        {projectedYes >= REQUIRED_REAL ? (
          <p className="mt-1 font-mono text-xs text-emerald-400">✓ Con votos suficientes para pasar</p>
        ) : (
          <p className="mt-1 font-mono text-xs text-crimson-400">
            ⚠ Faltan {REQUIRED_REAL - projectedYes} votos para la mayoría
          </p>
        )}
      </div>

      {/* Action points */}
      <div className="flex items-center gap-2">
        <span className="text-smoke-500 font-mono text-xs">Acciones disponibles:</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full border ${i < actionPoints ? 'border-gold-300 bg-gold-400' : 'border-navy-600 bg-navy-700'}`}
          />
        ))}
        <span className="text-smoke-500 ml-1 font-mono text-xs">({actionPoints} restantes)</span>
      </div>

      {/* Negotiation buttons */}
      <div className="space-y-2">
        {NEG_ACTIONS.map((action) => {
          const used = actionsUsed.includes(action.id);
          const canUse = !used && (action.isDecree || actionPoints > 0);
          const isHovered = hoveredAction === action.id;

          return (
            <m.button
              key={action.id}
              onClick={() => handleAction(action)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={!canUse}
              className={`w-full rounded-lg border px-4 py-3 text-left transition-all duration-150 ${
                used
                  ? 'cursor-not-allowed border-navy-700 bg-navy-800/40 opacity-40'
                  : action.isDecree
                    ? 'bg-crimson-900/30 hover:bg-crimson-900/50 cursor-pointer border-crimson-700'
                    : 'cursor-pointer border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-navy-700'
              } ${!canUse && !used ? 'cursor-not-allowed opacity-50' : ''}`}
              whileHover={canUse ? { x: 2 } : {}}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-lg">{action.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-sm font-bold ${used ? 'text-smoke-600 line-through' : action.isDecree ? 'text-crimson-300' : 'text-smoke-200'}`}
                    >
                      {action.label}
                    </span>
                    {!action.isDecree && !used && (
                      <span className="shrink-0 font-mono text-xs text-emerald-400">
                        +{action.voteRange[0]}–{action.voteRange[1]} votos
                      </span>
                    )}
                    {used && <span className="font-mono text-xs text-smoke-600">Utilizada</span>}
                  </div>
                  <AnimatePresence>
                    {isHovered && !used && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-1 text-xs text-smoke-400">{action.preview}</p>
                        <p className="mt-0.5 font-mono text-xs text-crimson-400">Costo: {action.costLabel}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </m.button>
          );
        })}
      </div>

      {/* Go to vote button */}
      <button
        onClick={startVoting}
        className="w-full rounded-md bg-gold-500 px-6 py-3 font-serif font-bold uppercase tracking-wider text-navy-900 transition-colors hover:bg-gold-400"
      >
        🏛 Llamar a votar →
      </button>
    </m.div>
  );

  // ── Render: Hemiciclo + voting ─────────────────────────────────────────────
  const renderVoting = () => (
    <m.div key="voting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="text-center">
        <p className="text-smoke-500 font-mono text-xs uppercase tracking-widest">{t(card.titleKey)}</p>
        <p className="mt-1 font-mono text-sm text-smoke-400">Hemiciclo en vivo</p>
      </div>

      {/* SVG Hemiciclo */}
      <div className="w-full overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
        <svg viewBox="0 0 600 345" className="h-auto w-full" style={{ display: 'block', maxHeight: '340px' }}>
          {/* Arc guide lines (subtle) */}
          {ROW_RADII.map((r) => (
            <path
              key={r}
              d={`M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`}
              fill="none"
              stroke="#1e293b"
              strokeWidth="0.5"
            />
          ))}

          {/* Seats */}
          {seats.map((seat) => {
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
        <div className="mb-1 flex justify-between font-mono text-xs text-smoke-400">
          <span className="text-crimson-400">NO: {liveRealNo}</span>
          <span className="text-smoke-500">— {REQUIRED_REAL} necesarios —</span>
          <span className="text-emerald-400">SÍ: {liveRealYes}</span>
        </div>
        <div
          className="relative h-4 overflow-hidden rounded-full border border-navy-600 bg-navy-800"
          style={{ width: '100%' }}
        >
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
            className="absolute bottom-0 top-0 z-10 w-0.5 bg-gold-400"
            style={{ left: `${markerPct * 100}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-xs text-smoke-600">
          <span>Oposición</span>
          <span className="text-gold-500">← mayoría →</span>
          <span>Oficialismo</span>
        </div>
      </div>

      {/* Bloc legend */}
      <div className="text-smoke-500 flex flex-wrap justify-center gap-3 font-mono text-xs">
        {(
          [
            ['#9C27B0', 'Oficialismo'],
            ['#1565C0', 'UxP'],
            ['#FFD600', 'PRO'],
            ['#78909C', 'Independientes'],
            ['#43A047', 'SÍ'],
            ['#E53935', 'NO'],
            ['#FFA726', 'Abstención'],
          ] as const
        ).map(([color, label]) => (
          <span key={label} className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </m.div>
  );

  // ── Render: Swing senator ──────────────────────────────────────────────────
  const renderSwing = () => {
    const sen = swingSens[swingIdx];
    if (!sen) return null;

    return (
      <m.div
        key={`swing-${swingIdx}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="space-y-4"
      >
        {/* Hemiciclo (smaller, frozen) */}
        <div className="w-full overflow-hidden rounded-lg border border-navy-700 bg-navy-900">
          <svg
            viewBox="0 0 600 345"
            className="h-auto w-full"
            style={{ display: 'block', maxHeight: '200px' }}
          >
            {seats.map((seat) => {
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
                  opacity={isPending ? 0.4 : 1}
                />
              );
            })}
          </svg>
        </div>

        {/* Current count */}
        <div className="text-center font-mono text-sm">
          <span className="text-emerald-400">{finalYes} SÍ</span>
          <span className="mx-2 text-smoke-600">—</span>
          <span className="text-crimson-400">{TOTAL_REAL - finalYes} NO</span>
          <span className="text-smoke-500 ml-3 text-xs">({REQUIRED_REAL} para mayoría)</span>
        </div>

        {/* Senator card */}
        <div className="space-y-3 rounded-xl border-2 border-gold-600 bg-navy-800 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-navy-500 bg-navy-700 text-xl">
              🏛
            </div>
            <div>
              <p className="font-serif font-bold text-smoke-100">{sen.name}</p>
              <p className="text-smoke-500 font-mono text-xs">
                {sen.bloc} · {sen.province}
              </p>
            </div>
            <div className="bg-gold-900/40 border-gold-700 ml-auto rounded border px-2 py-1">
              <p className="font-mono text-xs text-gold-400">⚡ VOTO SORPRESA</p>
              <p className="text-smoke-500 font-mono text-xs">
                {swingIdx + 1}/{swingSens.length}
              </p>
            </div>
          </div>

          <p className="text-smoke-300 border-gold-700 border-l-2 pl-3 text-sm italic">{sen.demand}</p>

          <div className="space-y-2">
            <button
              onClick={() => handleSwingChoice('accept')}
              className="flex w-full items-center justify-between rounded-lg border border-emerald-600 bg-emerald-800/60 px-4 py-2 text-left font-mono text-sm text-emerald-200 transition-colors hover:bg-emerald-700/60"
            >
              <span>✅ Acepto la demanda</span>
              <span className="text-xs text-emerald-400">{sen.costLabel} · +1 voto</span>
            </button>
            <button
              onClick={() => handleSwingChoice('refuse')}
              className="bg-crimson-900/40 text-crimson-200 flex w-full items-center justify-between rounded-lg border border-crimson-700 px-4 py-2 text-left font-mono text-sm transition-colors hover:bg-crimson-800/40"
            >
              <span>❌ Me niego</span>
              <span className="text-xs text-crimson-400">−1 voto</span>
            </button>
            <button
              onClick={() => handleSwingChoice('decide')}
              className="text-smoke-300 flex w-full items-center justify-between rounded-lg border border-navy-500 bg-navy-700 px-4 py-2 text-left font-mono text-sm transition-colors hover:bg-navy-600"
            >
              <span>🎲 Dejarlo decidir solo</span>
              <span className="text-smoke-500 text-xs">50/50</span>
            </button>
          </div>
        </div>
      </m.div>
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
      <m.div
        key="result"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        {/* Result banner */}
        <div
          className={`rounded-xl border-2 p-6 text-center ${
            usedDecree
              ? 'border-orange-600 bg-orange-900/30'
              : lawPassed
                ? 'border-emerald-600 bg-emerald-900/20'
                : 'bg-crimson-900/20 border-crimson-600'
          }`}
        >
          <p className="mb-3 text-4xl">{usedDecree ? '📋' : lawPassed ? '✅' : '❌'}</p>
          <h2
            className={`mb-2 font-serif text-2xl font-black ${usedDecree ? 'text-orange-300' : lawPassed ? 'text-emerald-300' : 'text-crimson-300'}`}
          >
            {usedDecree ? 'DECRETO DE NECESIDAD Y URGENCIA' : lawPassed ? 'LEY APROBADA' : 'LEY RECHAZADA'}
          </h2>
          <p className="mb-1 font-serif text-lg text-smoke-100">{t(card.titleKey)}</p>
          {!usedDecree && (
            <p className="font-mono text-sm text-smoke-400">
              {finalYes} votos a favor — {TOTAL_REAL - finalYes} en contra
              {lawPassed ? ` — aprobada por ${margin} votos` : ` — faltaron ${margin} para la mayoría`}
            </p>
          )}
          {usedDecree && (
            <p className="font-mono text-sm text-orange-400">Promulgada sin votación parlamentaria</p>
          )}
        </div>

        {/* Effect preview */}
        <div className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-3">
          <p className="text-smoke-500 mb-2 font-mono text-sm uppercase tracking-widest">
            Consecuencias inmediatas
          </p>
          <div className="text-smoke-300 font-mono text-sm">
            {(() => {
              const choice = card.choices[resultChoiceIdx];
              if (!choice) return null;
              const e = choice.effects;
              return (
                <div className="space-y-1">
                  {e.popularityDelta !== undefined &&
                    (() => {
                      const good = e.popularityDelta > 0;
                      return (
                        <p className={good ? 'text-green-400' : 'text-crimson-400'}>
                          {good ? '▲' : '▼'} Popularidad {good ? '+' : '-'}
                          {Math.abs(e.popularityDelta)}
                        </p>
                      );
                    })()}
                  {e.stabilityDelta !== undefined &&
                    (() => {
                      const good = e.stabilityDelta > 0;
                      return (
                        <p className={good ? 'text-green-400' : 'text-crimson-400'}>
                          {good ? '▲' : '▼'} Estabilidad {good ? '+' : '-'}
                          {Math.abs(e.stabilityDelta)}
                        </p>
                      );
                    })()}
                  {e.marketConfidenceDelta !== undefined &&
                    (() => {
                      const good = e.marketConfidenceDelta > 0;
                      return (
                        <p className={good ? 'text-green-400' : 'text-crimson-400'}>
                          {good ? '▲' : '▼'} Mercados {good ? '+' : '-'}
                          {Math.abs(e.marketConfidenceDelta)}
                        </p>
                      );
                    })()}
                  {e.deficitDelta !== undefined &&
                    (() => {
                      const good = e.deficitDelta < 0;
                      return (
                        <p className={good ? 'text-green-400' : 'text-crimson-400'}>
                          {good ? '▲' : '▼'} Déficit {good ? '-' : '+'}
                          {Math.abs(e.deficitDelta)}%
                        </p>
                      );
                    })()}
                  {e.foreignReservesDelta !== undefined &&
                    (() => {
                      const good = e.foreignReservesDelta > 0;
                      return (
                        <p className={good ? 'text-green-400' : 'text-crimson-400'}>
                          {good ? '▲' : '▼'} Reservas {good ? '+' : '-'}
                          {Math.abs(e.foreignReservesDelta)}
                        </p>
                      );
                    })()}
                  {e.lawsPassedDelta !== undefined && e.lawsPassedDelta > 0 && (
                    <p className="text-green-400">✓ Ley promulgada</p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Aníbal quote */}
        <div className="flex items-start gap-2 rounded border border-navy-700 bg-navy-800/60 px-4 py-3">
          <span className="mt-0.5 shrink-0 font-mono text-xs text-gold-500">📻</span>
          <p className="font-mono text-xs italic text-smoke-400">
            "{anibalQuotes[mode]}" — <span className="text-smoke-500">El Gordo Aníbal, Radio AM 1010</span>
          </p>
        </div>

        {/* Continue button */}
        <button
          onClick={() => onComplete(decisions)}
          className={`w-full rounded-md px-6 py-3 font-serif font-bold uppercase tracking-wider transition-colors ${
            lawPassed || usedDecree
              ? 'bg-gold-500 text-navy-900 hover:bg-gold-400'
              : 'border border-navy-500 bg-navy-700 text-smoke-200 hover:bg-navy-600'
          }`}
        >
          Continuar con el gobierno →
        </button>
      </m.div>
    );
  };

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div className="event-card border-l-4 border-l-[#1a237e]">
      <div
        className={`mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-blue-400`}
      >
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
