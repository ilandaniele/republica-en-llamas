import { useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import {
  drawNextCard,
  calculateScore,
  endTurn,
  initGame,
  PRESIDENT_IDS,
  PRESIDENT_LABELS,
  resolveTurn,
  type GameState,
} from '@republica/game-engine';
import { isPlaytestMode } from '../../../lib/playtest.js';
import { DebateCard } from './DebateCard.js';
import { DebateSummary } from './DebateSummary.js';
import { ElectionCard } from './ElectionCard.js';

function practiceState(id: string, turn = 37): GameState {
  const state = initGame('normal', 42, 'es', undefined, id);
  const practice = {
    ...state,
    turn,
    political: { ...state.political, popularity: 50, mediaCredibility: 60, socialStability: 70 },
    economic: {
      ...state.economic,
      inflation: 20,
      publicDeficit: 30,
      marketConfidence: 60,
      foreignReserves: 70,
      currencyStrength: 70,
    },
  };
  return { ...practice, score: calculateScore(practice) };
}

export default function DebatePracticeScreen() {
  const [searchParams, setSearchParams] = useSearchParams();
  const electionOnly = searchParams.get('view') === 'elecciones';
  const [candidate, setCandidate] = useState('milei');
  const [state, setState] = useState(() => practiceState('milei', electionOnly ? 40 : 37));
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const committed = useRef(false);
  if (!isPlaytestMode) return <Navigate to="/" replace />;
  const card = drawNextCard(state);
  function reset(id: string) {
    setCandidate(id);
    setState(practiceState(id, electionOnly ? 40 : 37));
    setSelected(null);
    setShowResult(false);
    committed.current = false;
  }
  function confirm() {
    if (selected === null || committed.current) return;
    committed.current = true;
    setState(
      endTurn(resolveTurn(state, card, { kind: 'choice', cardId: card.id, choiceIndex: selected }).state),
    );
    setSelected(null);
    setShowResult(true);
  }
  return (
    <main className="mx-auto max-w-4xl p-4">
      <Link to="/" className="text-celeste-light">
        ← Volver al juego
      </Link>
      <h1 className="my-4 text-3xl text-gold-400">Prueba del debate presidencial</h1>
      <p className="mb-4 text-lg">
        Práctica local: tres cruces y escrutinio. No modifica tu partida ni envía puntajes.
      </p>
      <label className="mb-4 block text-lg">
        Personaje
        <select
          className="ml-3 border-2 border-celeste-dark bg-navy-800 p-2"
          value={candidate}
          onChange={(event) => reset(event.target.value)}
        >
          {PRESIDENT_IDS.map((id) => (
            <option key={id} value={id}>
              {PRESIDENT_LABELS[id]}
            </option>
          ))}
        </select>
      </label>
      <p className="mb-4 text-xl">
        Popularidad: {state.political.popularity.toFixed(1)} · Puntaje: {state.score}
      </p>
      {state.turn < 40 && (
        <button
          type="button"
          className="election-skip"
          onClick={() => {
            setState(practiceState(candidate, 40));
            setSearchParams({ view: 'elecciones' });
            setSelected(null);
            setShowResult(false);
            committed.current = false;
          }}
        >
          Probar solo el escrutinio
        </button>
      )}
      {showResult ? (
        <>
          {state.debate && <DebateSummary debate={state.debate} />}
          {state.isGameOver || state.lameDuckMode ? (
            <p className="mb-4 text-2xl">
              {state.lameDuckMode
                ? 'Derrota electoral: comienza la transición.'
                : 'Victoria electoral: nuevo mandato.'}
            </p>
          ) : (
            <button
              type="button"
              className="debate-confirm"
              onClick={() => {
                setShowResult(false);
                committed.current = false;
              }}
            >
              {state.turn === 40 ? 'Ir a las elecciones' : 'Siguiente cruce'}
            </button>
          )}
          <button
            type="button"
            className="mt-4 min-h-11 border-2 border-celeste p-3"
            onClick={() => reset(candidate)}
          >
            Reiniciar práctica
          </button>
        </>
      ) : card.id === 'pol_election_result' ? (
        <ElectionCard
          state={state}
          card={card}
          selectedIndex={selected}
          onSelect={(_, index) => setSelected(index)}
          onConfirm={confirm}
        />
      ) : (
        <DebateCard
          state={state}
          card={card}
          selectedIndex={selected}
          onSelect={(_, index) => setSelected(index)}
          onConfirm={confirm}
        />
      )}
    </main>
  );
}
