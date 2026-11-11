export const isOfflineMode = import.meta.env['VITE_OFFLINE_MODE'] === 'true';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function errorMessage(body: unknown): string {
  if (body && typeof body === 'object' && 'error' in body && typeof body.error === 'string')
    return body.error;
  return 'Request failed';
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`/api/${path}`, { ...init, credentials: 'same-origin' });
  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) throw new ApiError(response.status, errorMessage(body));
  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export function apiSend<T>(path: string, body: unknown, method: 'POST' | 'PATCH' = 'POST'): Promise<T> {
  return request<T>(path, {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}
