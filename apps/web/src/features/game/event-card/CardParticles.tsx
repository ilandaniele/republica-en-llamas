/** Category-specific ambient layers animated by the card GSAP timeline. */
export function CardParticles({ category }: { category: string }) {
  return (
    <>
      {/* Economic: floating $ particles */}
      {category === 'economic' && (
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: 0,
            width: '100%',
            height: '60%',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          {[12, 28, 46, 64, 80].map((x, i) => (
            <span
              key={i}
              className="card-particle"
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: 0,
                color: i % 2 === 0 ? '#2e7d32' : '#f9a825',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '9px',
                userSelect: 'none',
              }}
            >
              $
            </span>
          ))}
        </div>
      )}

      {/* Social: smoke wisps */}
      {category === 'social' && (
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: 0,
            width: '100%',
            height: '40%',
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden',
          }}
        >
          {[18, 42, 70].map((x, i) => (
            <div
              key={i}
              className="card-particle"
              style={{
                position: 'absolute',
                left: `${x}%`,
                bottom: 0,
                width: 14 + i * 4,
                height: 14 + i * 4,
                borderRadius: '50%',
                background: 'rgba(120,144,156,0.25)',
              }}
            />
          ))}
        </div>
      )}

      {/* International: radar pulse */}
      {category === 'international' && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 18,
            height: 18,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <div
            className="card-radar"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid #7c4dff',
              transformOrigin: '50% 50%',
            }}
          />
        </div>
      )}
    </>
  );
}
