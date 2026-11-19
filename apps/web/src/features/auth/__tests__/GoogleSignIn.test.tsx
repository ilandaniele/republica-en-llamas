import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const authModule = vi.hoisted(() => ({ isGoogleSignInEnabled: false, signInWithGoogle: vi.fn() }));
vi.mock('../../../lib/auth.js', () => authModule);

const { GoogleSignIn } = await import('../GoogleSignIn.js');

afterEach(cleanup);

describe('GoogleSignIn', () => {
  it('renders nothing while Google sign-in is not configured', () => {
    authModule.isGoogleSignInEnabled = false;
    const { container } = render(<GoogleSignIn dividerLabel="o" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the button and divider when enabled', () => {
    authModule.isGoogleSignInEnabled = true;
    render(<GoogleSignIn dividerLabel="o registrate con email" />);
    expect(screen.getByRole('button', { name: /Continuar con Google/ })).toBeInTheDocument();
    expect(screen.getByText('o registrate con email')).toBeInTheDocument();
  });
});
