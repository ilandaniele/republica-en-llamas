import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  signUp: vi.fn(),
  signIn: vi.fn(),
  startNewGame: vi.fn(),
}));

vi.mock('../../../hooks/useAuth.js', () => ({
  useAuth: () => ({ signUp: mocks.signUp, signIn: mocks.signIn }),
}));
vi.mock('../../../lib/api.js', () => ({ isOfflineMode: false }));
vi.mock('../../../lib/auth.js', () => ({
  signInWithGoogle: vi.fn(),
  requestPasswordReset: vi.fn(),
  translateAuthError: (message: string) => message,
  checkUsernameAvailable: vi.fn(),
}));
vi.mock('../../../stores/gameStore.js', () => ({
  useGameStore: (selector: (state: Record<string, unknown>) => unknown) =>
    selector({ setUserId: vi.fn(), startNewGame: mocks.startNewGame }),
}));
vi.mock('../useUsernameAvailability.js', () => ({
  MIN_USERNAME_LENGTH: 3,
  useUsernameAvailability: () => ({ available: true, checking: false }),
}));

import AuthScreen from '../AuthScreen.js';
import LoginScreen from '../LoginScreen.js';
import RegisterScreen from '../RegisterScreen.js';

beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(cleanup);

function mount(element: React.ReactElement) {
  render(<MemoryRouter>{element}</MemoryRouter>);
}

describe('RegisterScreen accessibility', () => {
  it('exposes labelled fields with autocomplete tokens', () => {
    mount(<RegisterScreen />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('autocomplete', 'email');
    expect(screen.getByLabelText('Nombre de usuario')).toHaveAttribute('autocomplete', 'username');
    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('announces validation errors with role="alert"', () => {
    mount(<RegisterScreen />);
    fireEvent.change(screen.getByLabelText('Nombre de usuario'), { target: { value: 'ilan' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'abc' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Registrarse y jugar' }).closest('form')!);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mocks.signUp).not.toHaveBeenCalled();
  });

  it('keeps the global focus ring on the email input and a 44px back button', () => {
    mount(<RegisterScreen />);
    expect(screen.getByLabelText('Email').className).not.toContain('focus:outline-none');
    const back = screen.getByRole('button', { name: /Volver/ });
    expect(back.className).toContain('min-h-[44px]');
    expect(back.className).toContain('min-w-[44px]');
  });
});

describe('LoginScreen accessibility', () => {
  it('keeps the global focus ring on inputs', () => {
    mount(<LoginScreen />);
    expect(screen.getByLabelText('Email').className).not.toContain('focus:outline-none');
    expect(screen.getByLabelText('Contraseña').className).not.toContain('focus:outline-none');
  });

  it('gives the back button a 44px hit area', () => {
    mount(<LoginScreen />);
    const back = screen.getByRole('button', { name: /Volver/ });
    expect(back.className).toContain('min-h-[44px]');
    expect(back.className).toContain('min-w-[44px]');
  });
});

describe('AuthScreen accessibility', () => {
  it('exposes the selected difficulty with aria-pressed', () => {
    mount(<AuthScreen />);
    const normal = screen.getByRole('button', { name: /Normal/ });
    const hard = screen.getByRole('button', { name: /Difícil/ });
    expect(normal).toHaveAttribute('aria-pressed', 'true');
    expect(hard).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(hard);
    expect(hard).toHaveAttribute('aria-pressed', 'true');
    expect(normal).toHaveAttribute('aria-pressed', 'false');
  });

  it('uses readable text colors for secondary copy', () => {
    mount(<AuthScreen />);
    expect(screen.getByText(/v0\.4\.0/).className).not.toContain('text-smoke-600');
  });
});
