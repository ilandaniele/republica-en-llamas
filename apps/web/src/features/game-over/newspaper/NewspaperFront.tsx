import type { GameOverReason } from '@republica/game-engine';
import { PixelPortrait } from '../../../components/illustrations/PixelPortrait.js';
import type { PortraitId } from '../../../components/illustrations/PixelPortrait.js';
import { HEADLINES, SUB_HEADLINES } from '../gameOverCopy.js';

interface NewspaperFrontProps {
  turn: number;
  reason: GameOverReason;
  presidentId: string;
  isWin: boolean;
}

function Masthead({ turn }: { turn: number }) {
  return (
    <>
      <div
        className="border-b-2 border-smoke-400 px-6 pb-2 pt-4 text-center"
        style={{ background: '#e8e4d0' }}
      >
        <div
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '7px',
            color: '#444',
            letterSpacing: '0.15em',
            marginBottom: '4px',
          }}
        >
          LA GACETA DE LA REPÚBLICA
        </div>
        <div style={{ fontFamily: "'VT323', monospace", fontSize: '14px', color: '#666' }}>
          Turno {turn} &mdash; Edición especial
        </div>
      </div>
    </>
  );
}

function InstantDeathBanner({ reason }: { reason: GameOverReason }) {
  return (
    <>
      {reason === 'nuclear_annihilation' && (
        <div className="flex w-full flex-col items-center py-6" style={{ background: 'rgba(100,0,0,0.12)' }}>
          <svg viewBox="0 0 120 120" width={140} height={140} style={{ imageRendering: 'pixelated' }}>
            {/* Stem */}
            <rect x={53} y={80} width={14} height={32} fill="#FF5722" />
            {/* Base ring */}
            <rect x={40} y={68} width={40} height={14} fill="#FF7043" />
            {/* Cap layers */}
            <rect x={28} y={52} width={64} height={18} fill="#FF8A65" />
            <rect x={16} y={36} width={88} height={18} fill="#FFAB91" />
            <rect x={12} y={20} width={96} height={18} fill="#FFCCBC" />
            <rect x={20} y={8} width={80} height={14} fill="#FFE0B2" />
            <rect x={36} y={0} width={48} height={10} fill="#FFFFFF" />
          </svg>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              color: '#CC2200',
              marginTop: 12,
              textAlign: 'center',
              lineHeight: 2,
            }}
          >
            ANIQUILACIÓN NUCLEAR
          </div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '16px',
              color: '#888',
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 320,
              padding: '0 16px',
            }}
          >
            Buenos Aires fue borrada del mapa.
          </div>
        </div>
      )}
      {reason === 'military_defeat' && (
        <div className="flex w-full flex-col items-center py-6" style={{ background: 'rgba(0,10,60,0.08)' }}>
          <svg viewBox="0 0 160 80" width={180} height={90} style={{ imageRendering: 'pixelated' }}>
            {/* Waves */}
            <rect x={0} y={56} width={160} height={8} fill="#1565C0" />
            <rect x={0} y={50} width={160} height={6} fill="#1976D2" />
            {/* Sinking ship hull (tilted) */}
            <g transform="rotate(20 80 60)">
              <rect x={24} y={34} width={80} height={18} fill="#546E7A" />
              <rect x={22} y={36} width={84} height={14} fill="#607D8B" />
              {/* Mast */}
              <rect x={60} y={14} width={6} height={26} fill="#78909C" />
              {/* Argentine flag on mast (sinking) */}
              <rect x={66} y={14} width={16} height={6} fill="#74ACDF" />
              <rect x={66} y={20} width={16} height={6} fill="#FFFFFF" />
              <rect x={66} y={26} width={16} height={6} fill="#74ACDF" />
            </g>
          </svg>
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              color: '#B3D4F0',
              marginTop: 12,
              textAlign: 'center',
              lineHeight: 2,
            }}
          >
            DERROTA MILITAR
          </div>
          <div
            style={{
              fontFamily: "'VT323', monospace",
              fontSize: '16px',
              color: '#888',
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 320,
              padding: '0 16px',
            }}
          >
            La flota fue hundida. Las Malvinas siguen siendo malvinenses.
          </div>
        </div>
      )}
    </>
  );
}

function Headline({ presidentId, isWin, reason }: Omit<NewspaperFrontProps, 'turn'>) {
  const headline = HEADLINES[reason] ?? 'EL GOBIERNO HA CAÍDO';
  const subHeadline = SUB_HEADLINES[reason] ?? '';
  return (
    <>
      <div className="pixel-border shrink-0">
        <PixelPortrait id={presidentId as PortraitId} mood={isWin ? 'victory' : 'panic'} px={96} />
      </div>
      <div className="flex-1">
        {/* Headline */}
        <div className="pixel-border mb-2 bg-[#e8e4d0] p-2">
          <div
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: headline.replace(/[^a-zA-Z ]/g, '').length <= 40 ? '8px' : '6px',
              lineHeight: 1.6,
              color: isWin ? '#2a6e00' : '#8b0000',
            }}
          >
            {headline}
          </div>
        </div>
        {/* Sub-headline */}
        <div
          style={{
            fontFamily: "'VT323', monospace",
            fontSize: '18px',
            color: '#555',
            fontStyle: 'italic',
            lineHeight: 1.3,
          }}
        >
          {subHeadline}
        </div>
      </div>
    </>
  );
}

export function NewspaperFront({ turn, reason, presidentId, isWin }: NewspaperFrontProps) {
  return (
    <>
      <Masthead turn={turn} />
      <div className="flex items-start gap-4 px-6 pt-4">
        <InstantDeathBanner reason={reason} />
        <Headline presidentId={presidentId} isWin={isWin} reason={reason} />
      </div>
    </>
  );
}
