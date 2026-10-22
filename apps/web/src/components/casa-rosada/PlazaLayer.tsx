import { px } from './px.js';

const STONE = '#E9E1D2';
const STONE_SHADOW = '#C8BCA8';

function Ground() {
  return (
    <g>
      {px(0, 70, 160, 4, '#5E5A58')}
      {px(0, 74, 160, 16, '#C9B79C')}
      {[78, 83, 88].map((y) => px(0, y, 160, 1, '#B3A184', y))}
    </g>
  );
}

function Palm({ x }: { x: number }) {
  return (
    <g>
      {px(x, 50, 2, 30, '#7A5530')}
      {[54, 60, 66, 72].map((y) => px(x, y, 2, 1, '#5C3F22', y))}
      {px(x - 6, 47, 14, 2, '#3E7B3A')}
      {px(x - 4, 45, 10, 2, '#5FA052')}
      {px(x - 7, 49, 2, 2, '#3E7B3A')}
      {px(x + 7, 49, 2, 2, '#3E7B3A')}
      {px(x - 1, 44, 4, 1, '#5FA052')}
    </g>
  );
}

function PiramideDeMayo() {
  return (
    <g>
      {px(33, 82, 15, 3, STONE_SHADOW)}
      {px(36, 76, 9, 6, STONE)}
      {px(44, 76, 1, 6, STONE_SHADOW)}
      {px(38, 58, 5, 18, STONE)}
      {px(42, 58, 1, 18, STONE_SHADOW)}
      {px(39, 55, 3, 3, STONE)}
      {px(39, 51, 3, 4, '#B9B4AA')}
    </g>
  );
}

function Granadero({ x }: { x: number }) {
  return (
    <g>
      {px(x, 62, 2, 2, '#111111')}
      {px(x, 64, 2, 1, '#E8C39E')}
      {px(x, 65, 2, 3, '#1F3A8A')}
      {px(x, 66, 2, 1, '#C0392B')}
      {px(x, 68, 2, 2, '#ECE8E0')}
    </g>
  );
}

export function PlazaLayer({ guards }: { guards: boolean }) {
  return (
    <g>
      <Ground />
      {guards && (
        <>
          <Granadero x={69} />
          <Granadero x={89} />
        </>
      )}
      <PiramideDeMayo />
      <Palm x={5} />
      <Palm x={152} />
    </g>
  );
}
