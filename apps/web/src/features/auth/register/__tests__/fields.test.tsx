import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { UsernameField } from '../UsernameField.js';
import { PasswordField } from '../PasswordField.js';

afterEach(cleanup);

function renderUsername(value: string, available: boolean | null, checking = false) {
  render(<UsernameField value={value} onChange={() => {}} available={available} checking={checking} />);
  return screen.getByLabelText('Nombre de usuario');
}

describe('UsernameField accessibility', () => {
  it('labels the input and sets the username autocomplete token', () => {
    const input = renderUsername('', null);
    expect(input).toHaveAttribute('autocomplete', 'username');
  });

  it('announces availability as text in a polite live region', () => {
    const input = renderUsername('ilan', true);
    const status = screen.getByText('Disponible').parentElement!;
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(input).toHaveAttribute('aria-describedby', status.id);
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByText('✓')).toHaveAttribute('aria-hidden', 'true');
  });

  it('announces unavailable names and marks the input invalid', () => {
    const input = renderUsername('ilan', false);
    expect(screen.getByText('No disponible')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('announces the checking state without marking the input invalid', () => {
    const input = renderUsername('ilan', null, true);
    expect(screen.getByText('Comprobando…')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows no status text while the name is too short', () => {
    renderUsername('il', null);
    expect(screen.queryByText(/Disponible|Comprobando/)).toBeNull();
  });

  it('does not suppress the global focus ring', () => {
    expect(renderUsername('', null).className).not.toContain('focus:outline-none');
  });
});

describe('PasswordField accessibility', () => {
  function renderPassword(value: string) {
    render(<PasswordField value={value} onChange={() => {}} />);
    return screen.getByLabelText('Contraseña');
  }

  it('labels the input and sets the new-password autocomplete token', () => {
    expect(renderPassword('')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('links the strength hint to the input and flags it invalid when too short', () => {
    const input = renderPassword('abc');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const hint = document.getElementById(input.getAttribute('aria-describedby')!);
    expect(hint).toHaveTextContent('3/8');
    expect(hint).toHaveTextContent('caracteres');
  });

  it('has no hint or invalid flag for a long enough password', () => {
    const input = renderPassword('a-unique-password');
    expect(input).toHaveAttribute('aria-invalid', 'false');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('does not suppress the global focus ring', () => {
    expect(renderPassword('').className).not.toContain('focus:outline-none');
  });
});
