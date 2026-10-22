import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { GameState } from '@republica/game-engine';
import { PixelPortrait } from '../../../components/illustrations/PixelPortrait.js';
import type { PortraitId, PortraitMood } from '../../../components/illustrations/PixelPortrait.js';
import { UserMenu } from '../../../components/UserMenu.js';
import { StatStrip } from './StatStrip.js';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil',
  normal: 'Normal',
  hard: 'Difícil',
  crisis: 'Crisis',
};

interface GameHeaderProps {
  gameState: GameState;
  presidentId: string;
  presidentMood: PortraitMood;
  isCrisisExpress: boolean;
  crisisTimeLeft: number;
  onOpenDiary: () => void;
}

function CrisisTimer({ timeLeft }: { timeLeft: number }) {
  return (
    <div
      className={`pixel-border flex flex-col items-center px-3 py-1 font-mono ${
        timeLeft <= 10
          ? 'bg-crimson-900/70 text-crimson-300 animate-[shake_0.3s_ease-in-out_infinite]'
          : 'text-smoke-300 bg-navy-800'
      }`}
    >
      <p className="text-sm">⚡ EXPRESS</p>
      <p className="text-lg font-bold leading-none">{timeLeft}s</p>
    </div>
  );
}

export function GameHeader({
  gameState,
  presidentId,
  presidentMood,
  isCrisisExpress,
  crisisTimeLeft,
  onOpenDiary,
}: GameHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <m.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-4 border-4 border-[#111] bg-[#111]/80 p-3"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="pixel-border h-12 w-12 overflow-hidden">
            <PixelPortrait id={presidentId as PortraitId} mood={presidentMood} px={48} />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold uppercase leading-tight text-gold-400">
              República en Llamas
            </h1>
            <span className="bg-navy-800 px-2 py-0.5 font-mono text-sm text-smoke-400">
              {DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <UserMenu />
          {/* Diary button */}
          <button
            onClick={onOpenDiary}
            className="flex items-center gap-1 rounded border border-navy-600 bg-navy-800 px-3 py-2 font-mono text-sm text-smoke-400 hover:bg-navy-700"
            title="Diario de Gestión"
          >
            Diario
          </button>
          {isCrisisExpress && <CrisisTimer timeLeft={crisisTimeLeft} />}
          <div className="text-right">
            <p className="text-smoke-500 font-mono text-sm">Turno</p>
            <p className="font-mono font-bold text-gold-400">
              {gameState.turn}/{isCrisisExpress ? 15 : 50}
            </p>
          </div>
          {gameState.currentMonth != null && gameState.currentYear != null && (
            <div className="text-right">
              <p className="text-smoke-500 font-mono text-sm">{t(`month.${gameState.currentMonth}`)}</p>
              <p className="font-mono font-bold text-celeste">{gameState.currentYear}</p>
            </div>
          )}
          <div className="text-right">
            <p className="text-smoke-500 font-mono text-sm">Puntaje</p>
            <p className="font-mono font-bold text-gold-400">{gameState.score.toLocaleString()}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-xs text-smoke-600 hover:text-smoke-400"
          >
            ← Salir
          </button>
        </div>
      </div>
      <StatStrip gameState={gameState} />
    </m.header>
  );
}
