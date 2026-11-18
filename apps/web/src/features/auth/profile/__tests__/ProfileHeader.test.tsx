import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProfileHeader } from '../ProfileHeader.js';

afterEach(cleanup);

describe('ProfileHeader accessibility', () => {
  it('names the username edit button and labels the username input', () => {
    render(
      <ProfileHeader
        displayName="ilan"
        email="ilan@example.test"
        initialUsername="ilan"
        onRename={vi.fn()}
        onLogoutClick={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Editar nombre de usuario' }));
    expect(screen.getByRole('textbox', { name: 'Nombre de usuario' })).toHaveValue('ilan');
  });
});
