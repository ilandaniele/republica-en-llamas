import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { useSaveRun } from '../hooks/useSupabase.js';
import { getFatalDecision, getCounterfactual, getBestMomentTurn, getAnibalLine } from '@republica/game-engine';
import { PixelPortrait } from '../components/illustrations/PixelPortrait.js';
import { trackGameOver, trackShareClicked } from '../lib/analytics.js';
import { ShareImageCard } from '../components/ShareImageCard.js';

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
      <span className="text-smoke-500 text-sm" style={{ fontFamily: "'VT323', monospace" }}>{label}</span>
      <span className={`font-bold ${color}`} style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>{value}</span>
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
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [sharingImage, setSharingImage] = useState(false);

  useEffect(() => {
    updatePersonalBest();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (gameState) {
      trackGameOver({
        turns_survived: gameState.turn,
        reason: gameState.gameOverReason ?? 'hyperinflation',
        score: gameState.score,
        difficulty: gameState.difficulty,
        president: presidentId,
      });
    }
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
    trackShareClicked({ share_type: 'game_over' });
  };

  const handleShareX = () => {
    const encoded = encodeURIComponent(viralText.substring(0, 280));
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
    trackShareClicked({ share_type: 'score' });
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(viralText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
    trackShareClicked({ share_type: 'game_over' });
  };

  const handleShareImage = async () => {
    if (!shareCardRef.current) return;
    setSharingImage(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(shareCardRef.current, { useCORS: true, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'republica-en-llamas.png', { type: 'image/png' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: 'República en Llamas', text: '¿Podés hacerlo mejor?' });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'republica-en-llamas.png';
          a.click();
          URL.revokeObjectURL(url);
        }
        trackShareClicked({ share_type: 'image' });
      }, 'image/png');
    } finally {
      setSharingImage(false);
    }
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  return (
    <>
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6 flex items-center justify-center"
      style={{ background: 'var(--night-blue)' }}
    >
      <div className="max-w-2xl w-full">
        {/* Newspaper layout */}
        <div className="pixel-border bg-[#f4f4f0] text-smoke-900 overflow-hidden">
          {/* Masthead */}
          <div className="border-b-2 border-smoke-400 px-6 pt-4 pb-2 text-center" style={{ background: '#e8e4d0' }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#444', letterSpacing: '0.15em', marginBottom: '4px' }}>
              LA GACETA DE LA REPÚBLICA
            </div>
            <div style={{ fontFamily: "'VT323', monospace", fontSize: '14px', color: '#666' }}>
              Turno {gameState.turn} &mdash; Edición especial
            </div>
          </div>

          {/* Portrait + Headline row */}
          <div className="flex gap-4 px-6 pt-4 items-start">
            <div className="shrink-0 pixel-border">
              <PixelPortrait
                id={presidentId as import('../components/illustrations/PixelPortrait.js').PortraitId}
                mood={isWin ? 'victory' : 'panic'}
                px={96}
              />
            </div>
            <div className="flex-1">
              {/* Headline */}
              <div className="pixel-border bg-[#e8e4d0] p-2 mb-2">
                <div style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: headline.replace(/[^a-zA-Z ]/g, '').length <= 40 ? '8px' : '6px',
                  lineHeight: 1.6,
                  color: isWin ? '#2a6e00' : '#8b0000',
                }}>
                  {headline}
                </div>
              </div>
              {/* Sub-headline */}
              <div style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#555', fontStyle: 'italic', lineHeight: 1.3 }}>
                {subHeadline}
              </div>
            </div>
          </div>

          {/* Stat boxes */}
          <div className="grid grid-cols-3 gap-3 px-6 py-4">
            <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', marginBottom: '4px' }}>TURNOS</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: '#222' }}>{gameState.turn}/50</div>
            </div>
            <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', marginBottom: '4px' }}>SCORE</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: isWin ? '#2a6e00' : '#8b0000' }}>{gameState.score.toLocaleString()}</div>
            </div>
            <div className="pixel-border p-2 text-center" style={{ background: '#e8e4d0' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666', marginBottom: '4px' }}>INF FINAL</div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px', color: gameState.economic.inflation > 30 ? '#8b0000' : '#2a6e00' }}>{gameState.economic.inflation.toFixed(0)}%</div>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="px-6 pb-4">
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#444', marginBottom: '8px', letterSpacing: '0.1em' }}>INFORME FINAL DEL MANDATO</div>
            <div className="space-y-1">
              <ScoreRow label="Dificultad" value={DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty} />
              <ScoreRow label="Popularidad final" value={`${Math.round(gameState.political.popularity)}%`} color={gameState.political.popularity < 25 ? 'text-red-700' : 'text-smoke-700'} />
              <ScoreRow label="Estabilidad social" value={`${Math.round(gameState.political.socialStability)}%`} />
              <ScoreRow label="Déficit público" value={`${Math.round(gameState.economic.publicDeficit)}%`} />
              <ScoreRow label="Leyes aprobadas" value={String(gameState.congress.lawsPassedThisRun)} color="text-blue-700" />
              <ScoreRow label="Decretos de emergencia" value={String(gameState.political.emergencyDecreesUsed)} color={gameState.political.emergencyDecreesUsed > 2 ? 'text-red-700' : 'text-smoke-700'} />
              {bestMomentTurn && (
                <ScoreRow label="Mejor momento" value={`Turno ${bestMomentTurn}`} color="text-emerald-700" />
              )}
            </div>

            {/* Fatal decision block */}
            {fatalDecision && !isWin && (
              <div className="mt-4 pixel-border-crisis p-3" style={{ background: '#fff0f0' }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#8b0000', marginBottom: '4px' }}>ERROR FATAL</div>
                <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#555' }}>
                  Turno {fatalDecision.turn} &mdash; la decisión más dañina del mandato.
                </div>
                {counterfactual && (
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: '14px', color: '#888', marginTop: '4px', fontStyle: 'italic' }}>
                    Si hubieras... {counterfactual}
                  </div>
                )}
              </div>
            )}

            {/* Personal best */}
            {personalBest && !isWin && (
              <div className="mt-3 pixel-border p-2 flex items-center justify-between" style={{ background: '#e8e4d0' }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#666' }}>
                  {isNewRecord ? '🏆 NUEVO RECORD' : 'TU RECORD'}
                </span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#444' }}>
                  {personalBest.turns} turnos · {personalBest.score.toLocaleString()} pts
                </span>
              </div>
            )}

            {/* Final score */}
            <div className="flex justify-between items-center py-2 mt-3 px-3 pixel-border" style={{ background: '#d4d0c0' }}>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: '#444' }}>PUNTAJE FINAL</span>
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px', color: isWin ? '#2a6e00' : '#8b0000' }}>
                {gameState.score.toLocaleString()}
              </span>
            </div>

            {/* Aníbal final quote */}
            {anibalLine && (
              <div className="mt-3" style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#666', fontStyle: 'italic' }}>
                📻 &ldquo;{anibalLine}&rdquo; &mdash; Gordo Aníbal, AM1010
              </div>
            )}
          </div>
        </div>

        {/* Viral share section */}
        <div className="mt-6 pixel-border p-4" style={{ background: 'var(--night-blue)', borderColor: 'var(--celeste-dark)' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--peso-grey)', letterSpacing: '0.1em', marginBottom: '8px' }}>CONTALE AL MUNDO</div>
          <div style={{ fontFamily: "'VT323', monospace", fontSize: '15px', color: '#aaa', fontStyle: 'italic', lineHeight: 1.4, marginBottom: '12px', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
            "{viralText}"
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopyText}
              className="pixel-border bg-navy-700 hover:bg-navy-600 text-smoke-200 py-2 px-4 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
            >
              {copied ? '✓ COPIADO' : '📋 COPIAR'}
            </button>
            <button
              onClick={handleShareX}
              className="pixel-border hover:bg-[#333] text-white py-2 px-4 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', background: '#1a1a1a' }}
            >
              𝕏 COMPARTIR EN X
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="pixel-border text-white py-2 px-4 transition-colors"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', background: '#128C7E' }}
            >
              📱 WHATSAPP
            </button>
            <button
              onClick={() => void handleShareImage()}
              disabled={sharingImage}
              className="pixel-border py-2 px-4 transition-colors disabled:opacity-50"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', background: 'var(--celeste-dark)', color: 'white' }}
            >
              {sharingImage ? '...' : '🖼 IMAGEN'}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <button
            onClick={handlePlayAgain}
            className="flex-1 pixel-border-crisis py-3 px-6 transition-colors"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', background: 'var(--crisis-red)', color: 'white' }}
          >
            UNA MÁS ▶
          </button>
          {user && (
            <button
              onClick={handleSaveScore}
              disabled={isSaving}
              className="pixel-border-gold py-3 px-6 transition-colors disabled:opacity-50"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', background: 'var(--gold)', color: 'var(--night-blue)' }}
            >
              {isSaving ? 'GUARDANDO...' : '💾 GUARDAR'}
            </button>
          )}
          <button
            onClick={() => navigate('/history')}
            className="pixel-border py-3 px-6 transition-colors hover:bg-navy-800"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: '#aaa', borderColor: 'var(--celeste-dark)' }}
          >
            📊 HISTORIAL
          </button>
        </div>
      </div>
    </motion.div>

      <ShareImageCard
        ref={shareCardRef}
        gameState={gameState}
        presidentId={presidentId}
        score={gameState.score}
      />
    </>
  );
}
