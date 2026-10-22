import React, { useCallback, useRef } from 'react';
import { useTransientValue } from '../../hooks/useTransientValue.js';
import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { EventCard, GameState } from '@republica/game-engine';
import { getSafestChoiceIndex } from '@republica/game-engine';
import { CharacterPortrait } from '../../components/illustrations/characters/CharacterPortrait.js';
import { EventIllustration } from '../../components/illustrations/EventIllustration.js';
import { CardParticles } from './event-card/CardParticles.js';
import { PixelPortrait } from '../../components/illustrations/PixelPortrait.js';
import type { PortraitId } from '../../components/illustrations/PixelPortrait.js';

gsap.registerPlugin(useGSAP);

const PRESIDENT_IDS = new Set<string>(['milei', 'massa', 'bullrich', 'ingeniero', 'populista', 'tecnocrata']);

const ARCHETYPE_LABEL: Record<string, string> = {
  ingeniero: 'Pres. Milei',
  populista: 'Pres. Massa',
  tecnocrata: 'Min. Bullrich',
  izquierda: 'Dip. Bregman',
  federal: 'Gob. Schiaretti',
  corporativo: 'Jefe Larreta',
};

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

interface CategoryStyle {
  badge: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  political: { badge: 'bg-[#1a237e]' },
  economic: { badge: 'bg-[#1b5e20]' },
  social: { badge: 'bg-[#a33f00]' },
  international: { badge: 'bg-[#5b2a86]' },
  crisis: { badge: 'bg-[#8B0000]' },
};

const CHOICE_COLORS = ['choice-orange', 'choice-blue', 'choice-pink', 'choice-purple'];

const CATEGORY_LABELS: Record<string, string> = {
  political: 'POLÍTICO',
  economic: 'ECONÓMICO',
  social: 'SOCIAL',
  international: 'INTERNACIONAL',
  crisis: 'CRISIS',
};

interface CardHeadingProps {
  card: EventCard;
  contextPrefix: string | null | undefined;
  style: CategoryStyle;
}

function CardHeading({ card, contextPrefix, style }: CardHeadingProps) {
  const { t } = useTranslation();
  const isCrisis = card.category === 'crisis';
  return (
    <div className="px-6 pb-3 pt-5">
      {contextPrefix && <p className="mb-2 text-sm italic text-[#444]">{contextPrefix}</p>}
      {card.requiredFlags && card.requiredFlags.length > 0 && (
        <div
          className="mb-2 flex items-center gap-1 border-2 border-[#111] px-2 py-1 text-[#111]"
          style={{ fontFamily: "'Press Start 2P'", fontSize: '6px', display: 'inline-flex' }}
        >
          <span>↩</span>
          <span>CONSECUENCIA DE DECISIÓN PREVIA</span>
        </div>
      )}
      <span
        className={`mb-3 inline-block px-2 py-1 text-white ${style.badge}`}
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
      >
        {CATEGORY_LABELS[card.category] ?? card.category.toUpperCase()}
      </span>
      <h2
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: isCrisis ? '9px' : '10px',
          lineHeight: '1.6',
        }}
        className={`uppercase ${isCrisis ? 'text-[#8B0000]' : 'text-[#111]'}`}
      >
        {t(card.titleKey)}
      </h2>
    </div>
  );
}

export function EventCardComponent({
  card,
  selectedIndex,
  onSelect,
  onConfirm,
  disabled,
  contextPrefix,
  presidentId = 'ingeniero',
  gameState,
}: Props) {
  const { t } = useTranslation();
  const style = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES['crisis']!;
  const isCrisis = card.category === 'crisis';
  const isEasy = gameState?.difficulty === 'easy';
  const safestIndex = isEasy ? getSafestChoiceIndex(card) : -1;
  const [ripplingChoice, showRipplingChoice] = useTransientValue<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── GSAP: category-specific ambient particle effects on the card ────────────
  useGSAP(
    () => {
      if (!cardRef.current) return;

      if (isCrisis) {
        // Crimson border glow pulses on the whole card
        gsap.fromTo(
          '.card-glow-overlay',
          { autoAlpha: 0 },
          { autoAlpha: 0.12, duration: 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut' },
        );
      } else if (card.category === 'economic') {
        // $ symbols rain down through the card body
        gsap.fromTo(
          '.card-particle',
          { y: 0, autoAlpha: 0.55 },
          {
            y: 90,
            autoAlpha: 0,
            duration: 2.2,
            ease: 'power1.in',
            stagger: { each: 0.55, repeat: -1, from: 'random' },
          },
        );
      } else if (card.category === 'social') {
        // Smoke wisps drift upward
        gsap.fromTo(
          '.card-particle',
          { y: 0, x: 0, scale: 1, autoAlpha: 0.35 },
          {
            y: -50,
            x: 10,
            scale: 1.8,
            autoAlpha: 0,
            duration: 2.8,
            ease: 'power1.out',
            stagger: { each: 1.1, repeat: -1 },
          },
        );
      } else if (card.category === 'international') {
        // Radar pulse ring expands and fades
        gsap.fromTo(
          '.card-radar',
          { scale: 0.6, autoAlpha: 0.7 },
          { scale: 2.2, autoAlpha: 0, duration: 1.8, ease: 'power1.out', repeat: -1, repeatDelay: 0.6 },
        );
      }
    },
    { scope: cardRef, dependencies: [card.category] },
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
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
    },
    [card.choices.length, card.id, disabled, onSelect, selectedIndex],
  );

  const handleChoiceClick = useCallback(
    (idx: number) => {
      if (disabled) return;
      onSelect(card.id, idx);
      showRipplingChoice(idx, 400);
    },
    [disabled, onSelect, card.id, showRipplingChoice],
  );

  return (
    <m.div
      ref={cardRef}
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="event-card relative overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Crisis glow overlay */}
      {isCrisis && (
        <div
          className="card-glow-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--crisis-red)',
            pointerEvents: 'none',
            zIndex: 1,
            opacity: 0,
          }}
        />
      )}

      <CardParticles category={card.category} />
      <CardHeading card={card} contextPrefix={contextPrefix} style={style} />

      {/* Full-bleed illustration — no horizontal padding */}
      <div className="relative h-[180px] w-full overflow-hidden border-y-4 border-[#111] md:h-[260px] xl:h-[360px]">
        {card.characterId && PRESIDENT_IDS.has(card.characterId) ? (
          <div className="absolute inset-0 flex items-center justify-center border-y border-navy-700 bg-navy-800/60">
            <PixelPortrait id={card.characterId as PortraitId} mood="neutral" px={180} />
          </div>
        ) : card.characterId ? (
          <div className="absolute inset-0 flex items-center gap-3 border-y border-navy-600 bg-navy-800/60 px-4">
            <CharacterPortrait characterId={card.characterId} size={72} />
            <div className="font-mono text-xs italic text-smoke-400 opacity-70">Personaje recurrente</div>
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

      {/* President strip — visual novel style, shown when no card-specific character */}
      {!card.characterId &&
        (() => {
          const charLabel = ARCHETYPE_LABEL[presidentId];
          if (!charLabel) return null;
          return (
            <div className="flex items-center gap-3 border-b-4 border-[#111] bg-[#111] px-4 py-2">
              <PixelPortrait id={presidentId as PortraitId} px={40} />
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '7px',
                  color: 'var(--celeste)',
                }}
              >
                {charLabel}
              </span>
            </div>
          );
        })()}

      {/* Body + choices + confirm */}
      <div className="px-6 pb-6 pt-4">
        <p className="mb-5 text-[19px] leading-snug text-[#222]">{t(card.bodyKey)}</p>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
          {Array.from({ length: 4 }).map((_, index) => {
            const choice = card.choices[index];
            const isLocked = !choice;
            const isSelected = selectedIndex === index;
            const letter = String.fromCharCode(65 + index);

            if (isLocked) {
              return null;
            }

            return (
              <m.button
                key={choice.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                onClick={() => handleChoiceClick(index)}
                className={`pixel-choice-card ${CHOICE_COLORS[index]} w-full text-left ${isSelected ? 'selected' : ''}`}
              >
                {ripplingChoice === index && <span className="choice-ripple" />}
                <div className="mb-2 flex items-start gap-2">
                  <span
                    style={{
                      background: isSelected ? 'var(--gold)' : '#111',
                      color: isSelected ? '#111' : 'white',
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '8px',
                      padding: '3px 5px',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  >
                    {letter}
                  </span>
                  <span className="text-[17px] font-medium leading-tight">{t(choice.textKey)}</span>
                  {isEasy && index === safestIndex && (
                    <span
                      className="ml-auto shrink-0 bg-[#111] px-1 text-[11px] text-gold-400"
                      title="Opción más segura"
                    >
                      SEGURA
                    </span>
                  )}
                </div>
                {choice.requiresVote && (
                  <div
                    className="mt-2 inline-flex items-center border-2 border-white px-2 py-1"
                    style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                  >
                    REQUIERE CONGRESO
                  </div>
                )}
              </m.button>
            );
          })}
        </div>

        {selectedIndex !== null && (
          <m.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <button
              onClick={onConfirm}
              disabled={disabled}
              className="w-full border-4 border-[#111] bg-[var(--gold)] px-6 py-3 font-bold text-[#111] shadow-[4px_4px_0_#111] hover:bg-gold-400 disabled:opacity-50"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
            >
              CONFIRMAR TURNO ▶
            </button>
            <p className="mt-2 text-center text-sm text-[#444]">Podés cambiar tu opción antes de confirmar</p>
          </m.div>
        )}
      </div>
    </m.div>
  );
}
