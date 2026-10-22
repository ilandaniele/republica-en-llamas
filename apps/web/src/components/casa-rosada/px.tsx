import type React from 'react';

export function px(
  x: number,
  y: number,
  w: number,
  h: number,
  fill: string,
  key?: React.Key,
): React.ReactElement {
  return <rect key={key} x={x} y={y} width={w} height={h} fill={fill} />;
}
