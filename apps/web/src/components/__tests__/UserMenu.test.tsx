import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { UserMenu } from '../UserMenu.js';

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({ user: { name: 'Ana', email: 'ana@example.test' }, signOut: vi.fn() }),
}));

afterEach(cleanup);

describe('UserMenu', () => {
  it('reports expanded state and closes on Escape returning focus to the toggle', () => {
    render(
      <MemoryRouter>
        <UserMenu />
      </MemoryRouter>,
    );
    const toggle = screen.getByRole('button', { name: /Ana/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const profile = screen.getByRole('button', { name: /Mi Perfil/ });
    profile.focus();
    fireEvent.keyDown(profile, { key: 'Escape' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveFocus();
  });
});
