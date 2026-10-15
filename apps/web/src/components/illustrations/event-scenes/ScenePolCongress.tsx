import {
  P,
  P_BG,
  P_BK,
  P_BR,
  P_CB,
  P_CR,
  P_GD,
  P_GR,
  P_NAV,
  P_OR,
  P_RD,
  P_SK,
  P_SLT,
  P_WH,
  P_YL,
  lbl,
  px,
} from './pixel.js';
import { PixPerson } from './PixPerson.js';

export default function ScenePolCongress({
  presidentId,
  gameState,
}: {
  presidentId: string;
  gameState?: import('@republica/game-engine').GameState | null;
}) {
  const hair = presidentId === 'tecnocrata' ? P_GD : presidentId === 'populista' ? P_RD : P_BK;
  const hasChaos =
    (gameState?.political.socialStability ?? 100) < 45 || (gameState?.congress.governmentSeats ?? 269) < 135;
  const govSeats = gameState?.congress.governmentSeats ?? 180;
  const govRatio = Math.max(0.05, Math.min(0.95, govSeats / 257));
  // Palette extensions for Congress
  const P_DOME = '#3D6B4A'; // dark green copper dome
  const P_DOME2 = '#4E8A5E'; // dome highlight
  const P_STONE = '#D8CFBB'; // cream stone facade
  const P_STONE2 = '#BEB5A0'; // shadow stone
  const P_WIN2 = '#89BAD4'; // window glazing
  const P_STAIR = '#C8BEA8'; // staircase steps

  return (
    <g>
      {/* Sky */}
      {px(0, 0, 40, 20, hasChaos ? '#200800' : P_NAV)}
      {px(0, 19, 40, 1, P_BR)}
      {/* Plaza pavement */}
      {px(2, 17, 36, 2, P_STAIR)}
      {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map((c) => (
        <rect key={c} x={c * P} y={17 * P} width={2 * P} height={P} fill="rgba(0,0,0,0.15)" />
      ))}

      {/* ── Grand staircase ── */}
      {px(11, 16, 18, 1, P_STAIR)}
      {px(12, 15, 16, 1, P_STONE2)}
      {px(13, 14, 14, 1, P_STONE2)}

      {/* ── Left wing ── */}
      {px(2, 10, 10, 9, P_STONE)}
      {px(2, 9, 10, 1, P_STONE2)}
      {[3, 6].map((c) =>
        [11, 14].map((r) => (
          <rect key={`${c}${r}`} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_WIN2} />
        )),
      )}
      {/* ── Right wing ── */}
      {px(28, 10, 10, 9, P_STONE)}
      {px(28, 9, 10, 1, P_STONE2)}
      {[29, 32].map((c) =>
        [11, 14].map((r) => (
          <rect key={`r${c}${r}`} x={c * P} y={r * P} width={2 * P} height={2 * P} fill={P_WIN2} />
        )),
      )}
      {/* ── Central body ── */}
      {px(10, 9, 20, 10, P_STONE)}
      {px(9, 8, 22, 1, P_STONE2)}
      {/* 8 front columns */}
      {[10, 12, 14, 16, 18, 20, 22, 24, 26].map((c) => (
        <rect key={c} x={c * P} y={9 * P} width={P} height={9 * P} fill={P_STONE2} />
      ))}

      {/* ── Dome rising in steps ── */}
      {px(14, 7, 12, 2, P_DOME)}
      {px(15, 6, 10, 1, P_DOME)}
      {px(15, 3, 10, 3, P_DOME2)}
      {px(16, 2, 8, 1, P_DOME)}
      {px(16, 3, 8, 3, P_DOME)}
      {px(17, 1, 6, 2, P_DOME)}
      {px(17, 2, 6, 3, P_DOME2)}
      {px(18, 0, 4, 2, P_DOME)}
      {/* Lantern top */}
      {px(19, 0, 2, 1, P_STONE)}
      <rect x={19 * P + 3} y={0} width={2} height={P} fill={P_STONE} />
      {/* Flag on dome */}
      <rect x={19 * P + 4} y={0} width={1} height={6 * P} fill={P_STONE2} />
      {px(20, 0, 6, 1, P_CB)}
      {px(20, 1, 6, 1, P_WH)}
      {px(20, 2, 6, 1, P_CB)}
      {/* Dome windows */}
      {[16, 19, 22].map((c) => (
        <rect key={c} x={c * P} y={4 * P} width={2 * P} height={2 * P} fill={P_WIN2} />
      ))}

      {/* ── Hemicycle interior (visible through arches) ── */}
      {px(11, 10, 18, 8, P_BG)}
      {/* Podium / dais */}
      {px(18, 14, 4, 3, P_SLT)}
      {px(19, 13, 2, 1, P_GD)}
      {/* President at podium */}
      <g className="gsap-primary">
        <PixPerson c={19} r={10} suit={P_SLT} skin={P_SK} hair={hair} />
      </g>
      {/* Hemicycle seat rows — split celeste (gov) / crimson (opp) by ratio */}
      {[12, 14, 16].map((row, ri) => {
        const totalCols = 14;
        const govCols = Math.round(govRatio * totalCols);
        return Array.from({ length: totalCols }, (_, i) => (
          <rect
            key={`s${row}-${i}`}
            x={(12 + i) * P}
            y={row * P}
            width={P}
            height={P}
            fill={i < govCols ? P_CB : P_CR}
            opacity={0.9 - ri * 0.15}
          />
        ));
      })}

      {/* Overlay columns in front */}
      {[10, 14, 18, 22, 26].map((c) => (
        <rect key={`oc${c}`} x={c * P} y={9 * P} width={P} height={10 * P} fill={P_STONE} />
      ))}

      {/* ── State layers ── */}
      {hasChaos ? (
        <g>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
            <PixPerson
              key={i}
              c={3 + i * 3}
              r={15}
              suit={i % 3 === 0 ? P_CR : i % 3 === 1 ? P_RD : P_SLT}
              skin={P_SK}
              hair={P_BK}
            />
          ))}
          {[0, 3, 6, 9].map((i) => (
            <rect key={i} x={(4 + i * 3) * P} y={13 * P} width={2 * P} height={2 * P} fill={P_RD} />
          ))}
          {px(2, 14, 3, 3, P_OR)}
          {px(2, 12, 2, 2, P_YL)}
          {px(35, 14, 3, 3, P_OR)}
          {px(36, 12, 2, 2, P_YL)}
          {px(17, 2, 6, 3, 'rgba(255,40,0,0.4)')}
          {lbl('QUILOMBO EN EL CONGRESO', P_CR)}
        </g>
      ) : (
        <g>
          {[14, 22].map((c) => (
            <g key={c}>
              <rect x={c * P} y={14 * P} width={1} height={4 * P} fill={P_GR} />
              {px(c + 1, 14, 3, 1, P_CB)}
              {px(c + 1, 15, 3, 1, P_WH)}
              {px(c + 1, 16, 3, 1, P_CB)}
            </g>
          ))}
          {[12, 17, 22, 27].map((c, i) => (
            <PixPerson key={c} c={c} r={17} suit={[P_CB, P_SLT, P_CR, P_CB][i]!} skin={P_SK} hair={P_BK} />
          ))}
          {lbl('CONGRESO NACIONAL')}
        </g>
      )}
    </g>
  );
}
