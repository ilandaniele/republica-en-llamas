import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
const refetch = vi.hoisted(() => vi.fn());
vi.mock('../../hooks/useEntitlements.js', () => ({ useEntitlements: () => ({ refetch }) }));
import { PurchaseSuccessToast } from '../../App.js';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function mount() {
  render(
    <MemoryRouter initialEntries={['/?purchase_success=1&entitlement=presidents_pack']}>
      <PurchaseSuccessToast />
    </MemoryRouter>,
  );
}

describe('purchase status is server-confirmed', () => {
  it('does not claim success from a query parameter alone', async () => {
    refetch.mockResolvedValue({ data: [], error: null });
    mount();
    expect(await screen.findByText(/pendiente de confirmación/)).toBeTruthy();
    expect(screen.queryByText(/contenido desbloqueado/)).toBeNull();
  });

  it('confirms when the server reports the purchased entitlement', async () => {
    refetch.mockResolvedValue({ data: ['presidents_pack'], error: null });
    mount();
    expect(await screen.findByText('Compra confirmada — contenido desbloqueado')).toBeTruthy();
  });

  it('keeps a server failure from becoming a success message', async () => {
    refetch.mockRejectedValue(new Error('private detail'));
    mount();
    expect(await screen.findByText('No se pudo verificar la compra. Revisá tu conexión.')).toBeTruthy();
    expect(document.body).not.toHaveTextContent('private detail');
    expect(screen.queryByText(/contenido desbloqueado/)).toBeNull();
  });
});
