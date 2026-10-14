import { useCallback, useEffect, useRef, useState } from 'react';

export function useTransientValue<T>(idle: T) {
  const [value, setValue] = useState<T>(idle);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const show = useCallback(
    (next: T, durationMs: number) => {
      clearTimeout(timerRef.current);
      setValue(next);
      timerRef.current = setTimeout(() => setValue(idle), durationMs);
    },
    [idle],
  );

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    setValue(idle);
  }, [idle]);

  return [value, show, hide] as const;
}
