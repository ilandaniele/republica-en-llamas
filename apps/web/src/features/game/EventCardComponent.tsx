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
import imageManifest from '../../assets/image-manifest.json';

gsap.registerPlugin(useGSAP);

const PRESIDENT_IDS = new Set<string>(['milei', 'massa', 'bullrich', 'ingeniero', 'populista', 'tecnocrata']);

const ARCHETYPE_CHAR: Record<string, string> = {
  ingeniero: 'char_milei',
  populista: 'char_massa',
  tecnocrata: 'char_bullrich',
  izquierda: 'char_bregman',
  federal: 'char_schiaretti',
  corporativo: 'char_larreta',
};

const ARCHETYPE_LABEL: Record<string, string> = {
  ingeniero: 'Pres. Milei',
  populista: 'Pres. Massa',
  tecnocrata: 'Min. Bullrich',
  izquierda: 'Dip. Bregman',
  federal: 'Gob. Schiaretti',
  corporativo: 'Jefe Larreta',
};

// Maps archetype → president slug used in scene image IDs
const ARCHETYPE_PRES_SLUG: Record<string, string> = {
  ingeniero: 'milei',
  populista: 'massa',
  tecnocrata: 'bullrich',
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

// Category styles: left border color, badge color, icon
interface CategoryStyle {
  border: string;
  badge: string;
  icon: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  political: { border: 'border-l-[#1a237e]', badge: 'text-blue-400', icon: '🏛' },
  economic: { border: 'border-l-[#1b5e20]', badge: 'text-yellow-400', icon: '💰' },
  social: { border: 'border-l-[#e65100]', badge: 'text-emerald-400', icon: '✊' },
  international: { border: 'border-l-[#b71c1c]', badge: 'text-purple-400', icon: '🌐' },
  crisis: { border: 'border-l-crimson-500', badge: 'text-crimson-400', icon: '⚠' },
};

const CATEGORY_LABELS: Record<string, string> = {
  political: 'POLÍTICO',
  economic: 'ECONÓMICO',
  social: 'SOCIAL',
  international: 'INTERNACIONAL',
  crisis: '⚠ CRISIS',
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
      {contextPrefix && <p className="text-smoke-500 mb-2 font-mono text-xs italic">{contextPrefix}</p>}
      {/* Consequence chain indicator — shown when this card was triggered by a prior decision */}
      {card.requiredFlags && card.requiredFlags.length > 0 && (
        <div
          className="pixel-border text-celeste-400 mb-2 flex items-center gap-1 px-2 py-1"
          style={{ fontFamily: "'Press Start 2P'", fontSize: '6px', display: 'inline-flex' }}
        >
          <span>↩</span>
          <span>CONSECUENCIA DE DECISIÓN PREVIA</span>
        </div>
      )}
      <div
        className={`mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest ${style.badge}`}
      >
        <span className="text-base">{style.icon}</span>
        <span>{CATEGORY_LABELS[card.category] ?? card.category.toUpperCase()}</span>
      </div>
      <h2
        style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: isCrisis ? '9px' : '10px',
          lineHeight: '1.6',
        }}
        className={`uppercase ${isCrisis ? 'text-shadow-crimson text-crimson-400' : 'text-smoke-100'}`}
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
      className={`event-card border-l-4 ${style.border} relative overflow-hidden !p-0`}
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.015) 24px)',
      }}
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
      {(() => {
        const presSlug = ARCHETYPE_PRES_SLUG[presidentId];
        const sceneKey = presSlug ? `pres_${presSlug}_${card.category}` : null;
        const sceneGifKey = sceneKey ? `${sceneKey}_anim` : null;
        const manifest = imageManifest as Record<string, string>;
        const sceneUrl = sceneKey ? manifest[sceneGifKey ?? ''] || manifest[sceneKey] || null : null;

        return (
          <div className="relative h-[180px] w-full overflow-hidden md:h-[260px] xl:h-[360px]">
            {sceneUrl && !card.characterId ? (
              <m.img
                src={sceneUrl}
                alt={`${presidentId} — ${card.category}`}
                initial={{ scale: 1.06, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full object-cover object-top"
              />
            ) : card.characterId && PRESIDENT_IDS.has(card.characterId) ? (
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
            {/* Bottom gradient overlay */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-12"
              style={{ background: 'linear-gradient(to top, rgba(9,21,37,0.9) 0%, transparent 100%)' }}
            />
          </div>
        );
      })()}

      {/* President strip — visual novel style, shown when no card-specific character */}
      {!card.characterId &&
        (() => {
          const charKey =
            ARCHETYPE_CHAR[presidentId] ?? (presidentId?.startsWith('char_') ? presidentId : null);
          const charUrl = charKey ? ((imageManifest as Record<string, string>)[charKey] ?? null) : null;
          const charLabel = ARCHETYPE_LABEL[presidentId] ?? presidentId;
          if (!charUrl) return null;
          return (
            <div
              className="flex items-center gap-3 border-b border-navy-700 px-4 py-2"
              style={{ background: 'rgba(9,21,37,0.92)' }}
            >
              <img
                src={charUrl}
                alt={charLabel}
                width={48}
                height={48}
                style={{
                  imageRendering: 'pixelated',
                  flexShrink: 0,
                  border: '2px solid var(--celeste-dark)',
                }}
              />
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
        <p
          className="text-smoke-300 mb-5 leading-relaxed"
          style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}
        >
          {t(card.bodyKey)}
        </p>

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
                className={`pixel-choice-card w-full text-left ${isSelected ? 'selected' : ''}`}
              >
                {ripplingChoice === index && <span className="choice-ripple" />}
                <div className="mb-2 flex items-start gap-2">
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
                    <span className="ml-auto shrink-0 text-xs text-gold-400" title="Opción más segura">
                      ⭐
                    </span>
                  )}
                </div>
                {choice.requiresVote && (
                  <div
                    className="pixel-border mt-2 flex items-center gap-1 px-2 py-1"
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: '6px',
                      color: 'var(--celeste)',
                      borderColor: 'var(--celeste)',
                      display: 'inline-flex',
                    }}
                  >
                    <span>🗳</span>
                    <span>REQUIERE CONGRESO</span>
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
              className="pixel-border-gold w-full bg-gold-500 px-6 py-3 font-bold text-navy-900 transition-colors duration-200 hover:bg-gold-400 disabled:opacity-50"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
            >
              CONFIRMAR TURNO ▶
            </button>
            <p
              style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}
              className="mt-1 text-center text-smoke-600"
            >
              Podés cambiar tu opción antes de confirmar
            </p>
          </m.div>
        )}
      </div>
    </m.div>
  );
}
