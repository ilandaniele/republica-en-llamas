import { useEffect, useRef } from 'react';
import type { KeyboardEvent, RefObject } from 'react';
import { m } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ModalLabel = { 'aria-labelledby': string } | { 'aria-label': string };

export type ModalProps = HTMLMotionProps<'div'> &
  ModalLabel & {
    onEscape?: () => void;
    initialFocusRef?: RefObject<HTMLElement | null>;
  };

function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
}

function useDialogFocus(
  dialogRef: RefObject<HTMLElement | null>,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const returnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    (initialFocusRef?.current ?? focusableIn(dialog)[0] ?? dialog).focus();
    return () => {
      const active = document.activeElement;
      const focusLeftDialog = !active || active === document.body || dialog.contains(active);
      if (focusLeftDialog && returnTarget?.isConnected) returnTarget.focus();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

function trapTab(event: KeyboardEvent<HTMLDivElement>, dialog: HTMLElement) {
  const focusable = focusableIn(dialog);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === dialog)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function Modal({ onEscape, initialFocusRef, onKeyDown, children, ...props }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialogFocus(dialogRef, initialFocusRef);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.key === 'Escape' && onEscape) {
      event.stopPropagation();
      onEscape();
    } else if (event.key === 'Tab' && dialogRef.current) {
      trapTab(event, dialogRef.current);
    }
  };

  return (
    <m.div ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={handleKeyDown} {...props}>
      {children}
    </m.div>
  );
}
