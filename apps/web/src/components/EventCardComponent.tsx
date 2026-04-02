import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { EventCard, GameState } from '@republica/game-engine';
import { getSafestChoiceIndex } from '@republica/game-engine';
import { CharacterPortrait } from './illustrations/characters/CharacterPortrait.js';
import { EventIllustration } from './illustrations/EventIllustration.js';
import { PixelPortrait } from './illustrations/PixelPortrait.js';
import type { PortraitId } from './illustrations/PixelPortrait.js';

const PRESIDENT_IDS = new Set<string>(['milei', 'massa', 'bullrich', 'ingeniero', 'populista', 'tecnocrata']);

interface Props {
  card: EventCard;
  selectedIndex: number | null;
  onSelect: (cardId: string, choiceIndex: number) => void;
  onConfirm: () => void;
  disabled?: boolean;
  contextPrefix?: string | null;
  presidentId?: string;
  gameState?: GameState | null;
}

// Category styles: left border color, badge color, icon
const CATEGORY_STYLES: Record<string, { border: string; badge: string; icon: string }> = {
  political: { border: 'border-l-[#1a237e]', badge: 'text-blue-400', icon: '🏛' },
  economic:  { border: 'border-l-[#1b5e20]', badge: 'text-yellow-400', icon: '💰' },
  social:    { border: 'border-l-[#e65100]', badge: 'text-emerald-400', icon: '✊' },
  international: { border: 'border-l-[#b71c1c]', badge: 'text-purple-400', icon: '🌐' },
  crisis:    { border: 'border-l-crimson-500', badge: 'text-crimson-400', icon: '⚠' },
};

const CATEGORY_LABELS: Record<string, string> = {
  political: 'POLÍTICO',
  economic: 'ECONÓMICO',
  social: 'SOCIAL',
  international: 'INTERNACIONAL',
  crisis: '⚠ CRISIS',
};

export function EventCardComponent({ card, selectedIndex, onSelect, onConfirm, disabled, contextPrefix, presidentId = 'ingeniero', gameState }: Props) {
  const { t } = useTranslation();
  const style = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES['crisis']!;
  const isCrisis = card.category === 'crisis';
  const isEasy = gameState?.difficulty === 'easy';
  const safestIndex = isEasy ? getSafestChoiceIndex(card) : -1;
  const [ripplingChoice, setRipplingChoice] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || disabled) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 50) return;
    const n = card.choices.length;
    const current = selectedIndex ?? -1;
    if (dx < 0) {
      onSelect(card.id, (current + 1 + n) % n);
    } else {
      onSelect(card.id, ((current < 0 ? 0 : current) - 1 + n) % n);
    }
  }, [card.choices.length, card.id, disabled, onSelect, selectedIndex]);

  const handleChoiceClick = useCallback((idx: number) => {
    if (disabled) return;
    onSelect(card.id, idx);
    setRipplingChoice(idx);
    setTimeout(() => setRipplingChoice(null), 400);
  }, [disabled, onSelect, card.id]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`event-card border-l-4 ${style.border}`}
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.015) 24px)',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Context prefix */}
      {contextPrefix && (
        <p className="text-smoke-500 font-mono text-xs italic mb-2">{contextPrefix}</p>
      )}

      {/* Category badge with icon */}
      <div className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3 ${style.badge}`}>
        <span className="text-base">{style.icon}</span>
        <span>{CATEGORY_LABELS[card.category] ?? card.category.toUpperCase()}</span>
      </div>

      {/* Title */}
      <h2
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: isCrisis ? '9px' : '10px', lineHeight: '1.6' }}
        className={`mb-3 uppercase ${isCrisis ? 'text-crimson-400 text-shadow-crimson' : 'text-smoke-100'}`}
      >
        {t(card.titleKey)}
      </h2>

      {/* Character portrait or large scene illustration */}
      <div className="mb-4 overflow-hidden h-[280px] md:h-[380px]">
        {card.characterId && PRESIDENT_IDS.has(card.characterId) ? (
          <div className="flex items-center justify-center bg-navy-800/60 border border-navy-700 h-full">
            <PixelPortrait id={card.characterId as PortraitId} mood="neutral" px={220} />
          </div>
        ) : card.characterId ? (
          <div className="flex items-center gap-3 bg-navy-800/60 border border-navy-600 rounded-lg px-3 py-2">
            <CharacterPortrait characterId={card.characterId} size={72} />
            <div className="text-smoke-400 font-mono text-xs italic opacity-70">
              Personaje recurrente
            </div>
          </div>
        ) : (
          <EventIllustration
            eventCategory={card.category}
            presidentId={presidentId}
            eventId={card.id}
            gameState={gameState}
          />
        )}
      </div>

      {/* Body */}
      <p className="text-smoke-300 leading-relaxed mb-6" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
        {t(card.bodyKey)}
      </p>

      {/* Choices — all remain visible; can switch until Confirmar is pressed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {card.choices.map((choice, index) => {
          const isSelected = selectedIndex === index;
          const letter = String.fromCharCode(65 + index);

          return (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              onClick={() => handleChoiceClick(index)}
              className={`pixel-choice-card w-full text-left ${isSelected ? 'selected' : ''}`}
            >
              {ripplingChoice === index && <span className="choice-ripple" />}
              {/* Letter badge */}
              <div className="flex items-start gap-2 mb-2">
                <span
                  style={{
                    background: isSelected ? 'var(--gold)' : 'var(--celeste-dark)',
                    color: isSelected ? '#0D1B2A' : 'white',
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '8px',
                    padding: '3px 5px',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                >
                  {letter}
                </span>
                <span
                  style={{ fontFamily: "'VT323', monospace", fontSize: '16px', lineHeight: '1.3' }}
                  className={isSelected ? 'text-smoke-100' : 'text-smoke-300'}
                >
                  {t(choice.textKey)}
                </span>
                {isEasy && index === safestIndex && (
                  <span className="ml-auto shrink-0 text-xs text-gold-400" title="Opción más segura">⭐</span>
                )}
              </div>
              {choice.requiresVote && (
                <div
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                  className="text-smoke-500 flex items-center gap-1 mt-1"
                >
                  <span>🗳</span>
                  <span>REQUIERE CONGRESO</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Confirm button */}
      {selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <button
            onClick={onConfirm}
            disabled={disabled}
            className="w-full pixel-border-gold bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 px-6 transition-colors duration-200 disabled:opacity-50"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
          >
            CONFIRMAR TURNO ▶
          </button>
          <p
            style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
            className="text-smoke-600 text-center mt-1"
          >
            Podés cambiar tu opción antes de confirmar
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
