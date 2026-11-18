import { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Modal } from '../Modal.js';

afterEach(cleanup);

function Harness({ onEscape }: { onEscape?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <LazyMotion features={domAnimation}>
      <button onClick={() => setOpen(true)}>Abrir</button>
      {open && (
        <Modal aria-label="Diálogo de prueba" onEscape={onEscape ?? (() => setOpen(false))}>
          <button>Primero</button>
          <button>Último</button>
        </Modal>
      )}
    </LazyMotion>
  );
}

describe('Modal', () => {
  it('exposes dialog semantics and moves focus inside', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('Abrir'));
    const dialog = screen.getByRole('dialog', { name: 'Diálogo de prueba' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Primero')).toHaveFocus();
  });

  it('traps Tab and Shift+Tab inside the dialog', () => {
    render(<Harness />);
    fireEvent.click(screen.getByText('Abrir'));
    const dialog = screen.getByRole('dialog');
    screen.getByText('Último').focus();
    fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(screen.getByText('Primero')).toHaveFocus();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(screen.getByText('Último')).toHaveFocus();
  });

  it('closes on Escape and restores focus to the trigger', () => {
    render(<Harness />);
    const trigger = screen.getByText('Abrir');
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('calls onEscape only when provided', () => {
    const onEscape = vi.fn();
    render(<Harness onEscape={onEscape} />);
    fireEvent.click(screen.getByText('Abrir'));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });
});
