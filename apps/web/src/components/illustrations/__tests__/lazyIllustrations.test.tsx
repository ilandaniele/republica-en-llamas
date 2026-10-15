import { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SCENES } from '../event-scenes/scenes.js';
import { selectScene } from '../event-scenes/selectScene.js';
import { PORTRAITS } from '../portraits/portraits.js';

const CATEGORIES = ['political', 'economic', 'social', 'international', 'crisis', 'unknown'];
const EVENT_IDS = ['pol_001', 'eco_002', 'soc_003', 'int_004', 'arg_015', 'guerra_003', 'law_x', 'malvinas'];

async function renderInSvg(node: React.ReactNode) {
  const { container } = render(
    <svg>
      <Suspense fallback={null}>{node}</Suspense>
    </svg>,
  );
  await waitFor(() => expect(container.querySelectorAll('rect').length).toBeGreaterThan(0));
}

describe('lazy illustrations', () => {
  it('maps every selected scene to a lazy component', () => {
    for (const category of CATEGORIES) {
      for (const eventId of EVENT_IDS) {
        expect(SCENES[selectScene(category, eventId, null)]).toBeDefined();
      }
    }
  });

  it.each(Object.keys(SCENES))('renders scene %s', async (id) => {
    const Scene = SCENES[id]!;
    await renderInSvg(<Scene presidentId="milei" gameState={null} />);
  });

  it.each(Object.keys(PORTRAITS))('renders portrait %s', async (id) => {
    const Portrait = PORTRAITS[id]!;
    await renderInSvg(<Portrait mood="neutral" />);
  });
});
