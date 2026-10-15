import { useEffect, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { checkUsernameAvailable } from '../../lib/supabase.js';

export const MIN_USERNAME_LENGTH = 3;
const DEBOUNCE_MS = 400;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function usernameAvailabilityQuery(username: string) {
  return queryOptions({
    queryKey: ['username-available', username],
    queryFn: () => checkUsernameAvailable(username),
    enabled: username.length >= MIN_USERNAME_LENGTH,
    staleTime: 30_000,
  });
}

/** `available` is null while the name is too short, still being typed or being checked. */
export function useUsernameAvailability(username: string) {
  const debouncedUsername = useDebouncedValue(username, DEBOUNCE_MS);
  const { data, isFetching } = useQuery(usernameAvailabilityQuery(debouncedUsername));
  const isTooShort = username.length < MIN_USERNAME_LENGTH;
  const checking = !isTooShort && (debouncedUsername !== username || isFetching);
  const available = isTooShort || checking ? null : (data ?? null);
  return { available, checking };
}
