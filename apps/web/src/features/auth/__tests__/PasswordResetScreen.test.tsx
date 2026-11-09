import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => ({ user: { id: 'player' }, loading: false, passwordRecovery: true }));
const updateUser = vi.hoisted(() => vi.fn());
const signOut = vi.hoisted(() => vi.fn());
vi.mock('../../../hooks/useAuth.js', () => ({ useAuth: () => auth }));
vi.mock('../../../lib/supabase.js', () => ({ supabase: { auth: { updateUser, signOut } } }));
import PasswordResetScreen from '../PasswordResetScreen.js';

beforeEach(() => {
  vi.clearAllMocks();
  auth.passwordRecovery = true;
  signOut.mockResolvedValue({ error: null });
});
afterEach(cleanup);

function mount() {
  render(
    <MemoryRouter initialEntries={['/reset-password?recovery=true']}>
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
  it('rejects URL flags without a recovery session validated by the SDK', () => {
    auth.passwordRecovery = false;
    mount();
    expect(screen.getByRole('alert')).toHaveTextContent('El enlace no es válido');
    expect(screen.queryByLabelText('Nueva contraseña')).toBeNull();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('requires matching strong passwords before sending anything', () => {
    mount();
    fill('short');
    expect(screen.getByRole('alert')).toHaveTextContent('12 y 128');
    fill('a-unique-password', 'another-password');
    expect(screen.getByRole('alert')).toHaveTextContent('no coinciden');
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('updates only the password and revokes refresh sessions after success', async () => {
    updateUser.mockResolvedValue({ error: null });
    mount();
    fill();
    expect(await screen.findByRole('status')).toHaveTextContent('Contraseña actualizada');
    expect(updateUser).toHaveBeenCalledWith({ password: 'a-unique-password' });
    expect(signOut).toHaveBeenCalledWith({ scope: 'global' });
    expect(screen.queryByLabelText('Nueva contraseña')).toBeNull();
  });

  it('hides backend details when the recovery session expires', async () => {
    updateUser.mockResolvedValue({ error: { message: 'private token detail' } });
    mount();
    fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('Pedí un enlace nuevo');
    expect(document.body).not.toHaveTextContent('private token detail');
    expect(signOut).not.toHaveBeenCalled();
  });

  it('blocks duplicate submission while the update is pending', async () => {
    let finish: (value: { error: null }) => void = () => {};
    updateUser.mockImplementationOnce(
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
    expect(updateUser).toHaveBeenCalledOnce();
    await act(async () => finish({ error: null }));
  });

  it('warns when password changes but session revocation fails', async () => {
    updateUser.mockResolvedValue({ error: null });
    signOut.mockResolvedValue({ error: { message: 'private server issue' } });
    mount();
    fill();
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cerrar las otras sesiones');
    expect(screen.getByRole('status')).toHaveTextContent('Contraseña actualizada');
    expect(document.body).not.toHaveTextContent('private server issue');
  });
});
