import type React from 'react';
import { P_BK, P_NAV, P_SK, px } from './pixel.js';

// â”€â”€ Reusable pixel-person (2 wide Ã— 5 tall, col/row top-left of head) â”€â”€â”€â”€â”€â”€â”€
export function PixPerson({
  c,
  r,
  suit = P_NAV,
  skin = P_SK,
  hair = P_BK,
}: {
  c: number;
  r: number;
  suit?: string;
  skin?: string;
  hair?: string;
}): React.ReactElement {
  return (
    <g>
      {px(c, r, 2, 1, hair)} {/* hair */}
      {px(c, r + 1, 2, 1, skin)} {/* face */}
      {px(c, r + 2, 2, 2, suit)} {/* torso */}
      {px(c, r + 4, 1, 1, suit)} {/* leg L */}
      {px(c + 1, r + 4, 1, 1, suit)} {/* leg R */}
    </g>
  );
}
