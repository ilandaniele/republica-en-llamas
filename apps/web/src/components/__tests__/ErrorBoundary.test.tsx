import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary.js';

describe('game error recovery', () => {
  it('offers recovery when a screen fails without clearing saved progress', () => {
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const removeItem = vi.spyOn(Storage.prototype, 'removeItem');
    function BrokenScreen(): never {
      throw new Error('Chunk failed');
    }
    render(
      <ErrorBoundary>
        <BrokenScreen />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Volver a intentar' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Ir al inicio' }).getAttribute('href')).toBe('/');
    expect(removeItem).not.toHaveBeenCalled();
    errorLog.mockRestore();
    removeItem.mockRestore();
  });
});
