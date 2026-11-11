import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const resetPassword = vi.hoisted(() => vi.fn());
vi.mock('../../../lib/auth.js', () => ({ authClient: { resetPassword } }));
import PasswordResetScreen from '../PasswordResetScreen.js';

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(cleanup);

function mount(url = '/reset-password?token=reset-token') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <PasswordResetScreen />
    </MemoryRouter>,
  );
}
function fill(password = 'a-unique-password', confirmation = password) {
  fireEvent.change(screen.getByLabelText('Nueva contraseña'), { target: { value: password } });
  fireEvent.change(screen.getByLabelText('Confirmar contraseña'), { target: { value: confirmation } });
  fireEvent.submit(screen.getByRole('button', { name: 'Actualizar contraseña' }).closest('form')!);
}

describe('password recovery boundary', () => {
  it('rejects links without a reset token', () => {
    mount('/reset-password?error=INVALID_TOKEN');
    expect(screen.getByRole('alert')).toHaveTextContent('El enlace no es válido');
    expect(screen.queryByLabelText('Nueva contraseña')).toBeNull();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('requires matching strong passwords before sending anything', () => {
    mount();
    fill('short');
    expect(screen.getByRole('alert')).toHaveTextContent('12 y 128');
    fill('a-unique-password', 'another-password');
    expect(screen.getByRole('alert')).toHaveTextContent('no coinciden');
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it('sends the new password with the link token', async () => {
    resetPassword.mockResolvedValue({ error: null });
    mount();
    fill();
    expect(await screen.findByRole('status')).toHaveTextContent('Contraseña actualizada');
    expect(resetPassword).toHaveBeenCalledWith({ newPassword: 'a-unique-password', token: 'reset-token' });
    expect(screen.queryByLabelText('Nueva contraseña')).toBeNull();
  });

  it('hides backend details when the token expires', async () => {
    resetPassword.mockResolvedValue({ error: { message: 'private token detail' } });
    mount();
    fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('Pedí un enlace nuevo');
    expect(document.body).not.toHaveTextContent('private token detail');
  });

  it('blocks duplicate submission while the update is pending', async () => {
    let finish: (value: { error: null }) => void = () => {};
    resetPassword.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    mount();
    fill();
    const button = screen.getByRole('button', { name: 'Actualizando...' });
    expect(button).toBeDisabled();
    fireEvent.submit(button.closest('form')!);
    expect(resetPassword).toHaveBeenCalledOnce();
    await act(async () => finish({ error: null }));
  });
});
