import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { useSaveRun } from '../hooks/useSupabase.js';
import { getFatalDecision, getCounterfactual, getBestMomentTurn, getAnibalLine } from '@republica/game-engine';
import { GameOverNewspaper } from '../components/illustrations/GameOverNewspaper.js';

const HEADLINES: Record<string, string> = {
  hyperinflation: 'LA HIPERINFLACIÓN DERRUMBA LA REPÚBLICA',
  popularityCollapse: 'EL PUEBLO ABANDONA AL PRESIDENTE',
  socialCollapse: 'COLAPSO TOTAL: LA REPÚBLICA EN ANARQUÍA',
  bankrupt: 'BANCARROTA SOBERANA: SIN RESERVAS',
  impeachment: 'EL CONGRESO DESTITUYE AL PRESIDENTE',
  term_complete: '¡MANDATO CUMPLIDO! LA REPÚBLICA SOBREVIVE',
};

const SUB_HEADLINES: Record<string, string> = {
  hyperinflation: 'El precio del pan supera los ingresos mensuales. La gente llena carretillas con billetes inútiles.',
  popularityCollapse: 'Sin apoyo ciudadano, el gobierno pierde toda legitimidad democrática.',
  socialCollapse: 'El orden institucional se disuelve. La anarquía reemplaza al estado.',
  bankrupt: 'Sin divisas ni crédito, el país no puede importar ni pagar deudas.',
  impeachment: 'El Congreso ejerció su poder constitucional. Un capítulo oscuro cierra.',
  term_complete: 'Contra todo pronóstico, la república sobrevivió. La historia te recordará.',
};

function ScoreRow({ label, value, color = 'text-smoke-700' }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-smoke-200">
      <span className="text-smoke-500 font-mono text-sm">{label}</span>
      <span className={`font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'Fácil', normal: 'Normal', hard: 'Difícil', crisis: 'Crisis',
};

export default function GameOverScreen() {
  const navigate = useNavigate();
  const gameState = useGameStore((s) => s.gameState);
  const resetGame = useGameStore((s) => s.resetGame);
  const personalBest = useGameStore((s) => s.personalBest);
  const updatePersonalBest = useGameStore((s) => s.updatePersonalBest);
  const presidentId = useGameStore((s) => s.presidentId);
  const { user } = useAuth();
  const { mutate: saveRun, isPending: isSaving } = useSaveRun();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updatePersonalBest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!gameState) { navigate('/'); return null; }

  const reason = gameState.gameOverReason ?? 'hyperinflation';
  const isWin = reason === 'term_complete';
  const headline = HEADLINES[reason] ?? 'EL GOBIERNO HA CAÍDO';
  const subHeadline = SUB_HEADLINES[reason] ?? '';

  const fatalDecision = getFatalDecision(gameState.history, reason);
  const counterfactual = getCounterfactual(fatalDecision);
  const bestMomentTurn = getBestMomentTurn(gameState.history);
  const anibalLine = getAnibalLine(gameState);

  const isNewRecord = !isWin && (!personalBest || gameState.score > personalBest.score);

  const PRESIDENT_NAMES: Record<string, string> = {
    ingeniero: 'Hernán Botta',
    populista: 'Néstor "Neco" Paz',
    tecnocrata: 'Dra. Clara Vidal',
  };
  const presidentName = PRESIDENT_NAMES[presidentId] ?? 'El Presidente';

  const REASON_LABELS: Record<string, string> = {
    hyperinflation: 'hiperinflación',
    popularityCollapse: 'impopularidad',
    socialCollapse: 'colapso social',
    bankrupt: 'bancarrota',
    impeachment: 'juicio político',
    term_complete: 'mandato completo',
  };
  const reasonLabel = REASON_LABELS[reason] ?? reason;

  const viralText = [
    `Bajo el gobierno de ${presidentName}, Argentina sobrevivió ${gameState.turn} turnos antes de colapsar por ${reasonLabel}.`,
    `La inflación llegó al ${Math.round(gameState.economic.inflation)}%.`,
    anibalLine ? `El Gordo Aníbal lo resumió mejor: "${anibalLine}"` : '',
    `\nPuntaje: ${gameState.score.toLocaleString()} | Dificultad: ${gameState.difficulty}`,
    `\n¡Jugá República en Llamas!`,
  ].filter(Boolean).join(' ');

  const handleSaveScore = () => {
    if (!user) return;
    saveRun({ state: gameState, userId: user.id });
  };

  const handleCopyText = () => {
    void navigator.clipboard.writeText(viralText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareX = () => {
    const encoded = encodeURIComponent(viralText.substring(0, 280));
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(viralText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 flex items-center justify-center"
    >
      <div className="max-w-2xl w-full">
        {/* Newspaper layout */}
        <div className="bg-smoke-50 text-smoke-900 rounded-xl overflow-hidden shadow-2xl">
          {/* Newspaper header SVG */}
          <GameOverNewspaper title={headline} isWin={isWin} />
          {/* Sub-headline */}
          <div className="text-center text-sm text-smoke-600 px-6 py-3 italic font-serif border-b border-smoke-300">
            {subHeadline}
          </div>

          {/* Score breakdown */}
          <div className="p-6 bg-smoke-50">
            <h3 className="font-serif font-bold text-smoke-800 text-lg mb-3 border-b border-smoke-300 pb-2">
              Informe Final del Mandato
            </h3>
            <div className="space-y-1">
              <ScoreRow label="Dificultad" value={DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty} />
              <ScoreRow label="Turnos sobrevividos" value={`${gameState.turn}/50`} />
              <ScoreRow label="Popularidad final" value={`${Math.round(gameState.political.popularity)}%`} color={gameState.political.popularity < 25 ? 'text-red-700' : 'text-smoke-700'} />
              <ScoreRow label="Estabilidad social" value={`${Math.round(gameState.political.socialStability)}%`} />
              <ScoreRow label="Inflación final" value={`${gameState.economic.inflation.toFixed(1)}%`} color={gameState.economic.inflation > 30 ? 'text-red-700' : 'text-green-700'} />
              <ScoreRow label="Déficit público" value={`${Math.round(gameState.economic.publicDeficit)}%`} />
              <ScoreRow label="Leyes aprobadas" value={String(gameState.congress.lawsPassedThisRun)} color="text-blue-700" />
              <ScoreRow label="Decretos de emergencia" value={String(gameState.political.emergencyDecreesUsed)} color={gameState.political.emergencyDecreesUsed > 2 ? 'text-red-700' : 'text-smoke-700'} />
              {bestMomentTurn && (
                <ScoreRow label="Mejor momento" value={`Turno ${bestMomentTurn}`} color="text-emerald-700" />
              )}
            </div>

            {/* Fatal decision block */}
            {fatalDecision && !isWin && (
              <div className="mt-4 bg-crimson-50 border border-crimson-200 rounded-lg p-4">
                <p className="font-mono text-xs text-crimson-600 font-bold uppercase tracking-wider mb-1">
                  Error fatal
                </p>
                <p className="text-smoke-700 text-sm font-serif">
                  Turno {fatalDecision.turn} — la decisión más dañina del mandato.
                </p>
                {counterfactual && (
                  <p className="text-smoke-500 text-xs mt-2 italic">
                    Si hubieras... {counterfactual}
                  </p>
                )}
              </div>
            )}

            {/* Personal best block */}
            {personalBest && !isWin && (
              <div className="mt-3 bg-smoke-100 border border-smoke-300 rounded-lg p-3 flex items-center justify-between">
                <span className="font-mono text-xs text-smoke-500">
                  {isNewRecord ? '🏆 ¡Nuevo récord!' : 'Tu récord'}
                </span>
                <span className="font-mono font-bold text-smoke-700 text-sm">
                  {personalBest.turns} turnos · {personalBest.score.toLocaleString()} pts
                </span>
              </div>
            )}

            {/* Final score */}
            <div className="flex justify-between items-center py-2 mt-3 bg-smoke-200 px-3 rounded">
              <span className="font-serif font-bold text-smoke-800 text-lg">PUNTAJE FINAL</span>
              <span className={`font-mono font-black text-2xl ${isWin ? 'text-emerald-700' : 'text-crimson-700'}`}>
                {gameState.score.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Viral share section */}
        <div className="mt-6 bg-navy-800 border border-navy-600 rounded-xl p-4">
          <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest mb-2">Contale al mundo</p>
          <p className="text-smoke-300 text-xs font-mono italic leading-relaxed mb-4 bg-navy-900/50 p-3 rounded border border-navy-700">
            "{viralText}"
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-200 font-mono py-2 px-4 rounded-lg transition-colors text-xs"
            >
              {copied ? '✓ Copiado!' : '📋 Copiar texto'}
            </button>
            <button
              onClick={handleShareX}
              className="bg-[#1a1a1a] hover:bg-[#333] border border-[#444] text-white font-mono py-2 px-4 rounded-lg transition-colors text-xs"
            >
              𝕏 Compartir en X
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="bg-[#128C7E] hover:bg-[#075E54] text-white font-mono py-2 px-4 rounded-lg transition-colors text-xs"
            >
              📱 WhatsApp
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            onClick={handlePlayAgain}
            className="flex-1 bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors text-lg"
          >
            🔄 UNA MÁS
          </button>
          {user && (
            <button
              onClick={handleSaveScore}
              disabled={isSaving}
              className="bg-gold-600 hover:bg-gold-500 text-navy-900 font-mono font-bold py-3 px-6 rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isSaving ? 'Guardando...' : '💾 Guardar'}
            </button>
          )}
          <button
            onClick={() => navigate('/history')}
            className="bg-transparent border border-navy-600 text-smoke-400 font-mono py-3 px-6 rounded-lg transition-colors text-sm hover:bg-navy-800"
          >
            📊 Historial
          </button>
        </div>
      </div>
    </motion.div>
  );
}
