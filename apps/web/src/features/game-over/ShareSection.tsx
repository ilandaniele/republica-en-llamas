import { useState } from 'react';
import type { RefObject } from 'react';
import { useTransientValue } from '../../hooks/useTransientValue.js';
import { trackShareClicked } from '../../lib/analytics.js';

interface ShareSectionProps {
  viralText: string;
  shareCardRef: RefObject<HTMLDivElement | null>;
}

// Shrinking the canvas frees its pixel buffer (about 4 MB at scale 2) without waiting for GC.
function releaseCanvas(canvas: HTMLCanvasElement) {
  canvas.width = 0;
  canvas.height = 0;
}

export function ShareSection({ viralText, shareCardRef }: ShareSectionProps) {
  const [copied, flashCopied] = useTransientValue(false);
  const [sharingImage, setSharingImage] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleCopyText = () => {
    void navigator.clipboard.writeText(viralText).then(() => {
      flashCopied(true, 2000);
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
    if (!shareCardRef.current || sharingImage) return;
    setSharingImage(true);
    setShareError(null);
    let canvas: HTMLCanvasElement | undefined;
    try {
      await document.fonts?.ready;
      const { default: html2canvas } = await import('html2canvas');
      canvas = await html2canvas(shareCardRef.current, { useCORS: true, scale: 2 });
      const blob = await new Promise<Blob | null>((resolve) => canvas!.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image encoding failed');
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
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setShareError('No se pudo compartir la imagen. Podés volver a intentarlo.');
      }
    } finally {
      if (canvas) releaseCanvas(canvas);
      setSharingImage(false);
    }
  };

  return (
    <>
      <div
        className="pixel-border mt-6 p-4"
        style={{ background: 'var(--night-blue)', borderColor: 'var(--celeste-dark)' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-readable)',
            fontSize: '14px',
            color: 'var(--peso-grey)',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}
        >
          CONTALE AL MUNDO
        </div>
        <div
          style={{
            fontFamily: 'var(--font-readable)',
            fontSize: '15px',
            color: '#aaa',
            fontStyle: 'italic',
            lineHeight: 1.4,
            marginBottom: '12px',
            padding: '8px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          "{viralText}"
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyText}
            className="pixel-border bg-navy-700 px-4 py-2 text-smoke-200 transition-colors hover:bg-navy-600"
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px' }}
          >
            {copied ? '✓ COPIADO' : '📋 COPIAR'}
          </button>
          <button
            onClick={handleShareX}
            className="pixel-border px-4 py-2 text-white transition-colors hover:bg-[#333]"
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px', background: '#1a1a1a' }}
          >
            𝕏 COMPARTIR EN X
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="pixel-border px-4 py-2 text-white transition-colors"
            style={{ fontFamily: 'var(--font-readable)', fontSize: '14px', background: '#128C7E' }}
          >
            📱 WHATSAPP
          </button>
          <button
            onClick={() => void handleShareImage()}
            disabled={sharingImage}
            className="pixel-border px-4 py-2 transition-colors disabled:opacity-50"
            style={{
              fontFamily: 'var(--font-readable)',
              fontSize: '14px',
              background: 'var(--celeste-dark)',
              color: 'white',
            }}
          >
            {sharingImage ? '...' : '🖼 IMAGEN'}
          </button>
        </div>
        {shareError && (
          <p role="alert" className="mt-3 text-gold-400">
            {shareError}
          </p>
        )}
      </div>
    </>
  );
}
