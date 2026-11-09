interface Props {
  x: number;
  y: number;
  phase?: number;
}

const COLUMN_COUNT = 14;
const FRAME_COUNT = 8;
const WAVE_FRAMES = Array.from({ length: FRAME_COUNT }, (_, frame) =>
  Array.from({ length: COLUMN_COUNT }, (_, column) =>
    Math.round(Math.sin(column * 0.48 - (frame * Math.PI) / 4) * Math.min(2, column / 4)),
  ),
);
const KEY_TIMES = Array.from({ length: FRAME_COUNT + 1 }, (_, i) => i / FRAME_COUNT).join(';');

function waveValues(column: number): string {
  const offsets = WAVE_FRAMES.map((frame) => frame[column]!);
  return [...offsets, offsets[0]!].map((offset) => `0 ${4 + offset}`).join(';');
}

function ClothWave({ column, phase }: { column: number; phase: number }) {
  return (
    <animateTransform
      attributeName="transform"
      type="translate"
      values={waveValues(column)}
      keyTimes={KEY_TIMES}
      calcMode="discrete"
      dur="1.6s"
      begin={`${phase}s`}
      repeatCount="indefinite"
    />
  );
}

export function ArgentineFlag({ x, y, phase = 0 }: Props) {
  return (
    <g transform={`translate(${x} ${y})`} data-argentine-flag="true">
      <g transform="scale(0.25)">
        <rect x={0} y={0} width={2} height={40} fill="#697b83" />
        <rect x={1} y={0} width={1} height={40} fill="#b8beb4" />
        <rect x={-1} y={-1} width={4} height={2} fill="#c5a25a" />
        {Array.from({ length: COLUMN_COUNT }, (_, column) => {
          const fold = column % 7;
          const blue =
            fold === 4 || fold === 5 ? '#5f9fc8' : fold === 1 || fold === 2 ? '#8ac7eb' : '#74b6df';
          const white = fold === 4 || fold === 5 ? '#e1e9ec' : '#fffdf4';
          return (
            <g key={column} transform={`translate(0 ${4 + WAVE_FRAMES[0]![column]!})`}>
              <ClothWave column={column} phase={phase} />
              <rect x={2 + column * 2} y={0} width={2} height={6} fill={blue} />
              <rect x={2 + column * 2} y={6} width={2} height={6} fill={white} />
              <rect x={2 + column * 2} y={12} width={2} height={6} fill={blue} />
              <rect x={2 + column * 2} y={17} width={2} height={1} fill="#508bb4" />
            </g>
          );
        })}
        <g transform={`translate(0 ${4 + WAVE_FRAMES[0]![6]!})`}>
          <ClothWave column={6} phase={phase} />
          <rect x={15} y={6} width={2} height={6} fill="#dfab45" />
          <rect x={13} y={8} width={6} height={2} fill="#dfab45" />
          <rect x={14} y={7} width={4} height={4} fill="#f1c25b" />
          <rect x={15} y={8} width={2} height={2} fill="#c98e36" />
        </g>
      </g>
    </g>
  );
}
