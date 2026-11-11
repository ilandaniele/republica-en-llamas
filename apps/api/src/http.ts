export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

const API_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store',
  ...SECURITY_HEADERS,
};

export function withSecurityHeaders(response: Response): Response {
  const secured = new Response(response.body, response);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value);
  return secured;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...API_HEADERS, ...headers } });
}

export function errorResponse(error: unknown): Response {
  if (error instanceof RequestError) {
    return json({ error: error.message }, error.status, error.status === 429 ? { 'Retry-After': '60' } : {});
  }
  console.error('Request failed unexpectedly', error instanceof Error ? error.message : '');
  return json({ error: 'Service unavailable' }, 503);
}

export function allowedOrigins(webUrl: string, extra = ''): string[] {
  return [
    new URL(webUrl).origin,
    ...extra
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];
}

export function assertAllowedOrigin(request: Request, origins: readonly string[]): void {
  const origin = request.headers.get('Origin');
  if (origin !== null && !origins.includes(origin)) throw new RequestError(403, 'Origin not allowed');
}

export function checkContentLength(request: Request, maxBytes: number): void {
  const length = request.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes))
    throw new RequestError(413, 'Request body too large');
  const encoding = request.headers.get('content-encoding');
  if (encoding && encoding !== 'identity') throw new RequestError(415, 'Unsupported content encoding');
}

export async function withLimitedBody(request: Request, maxBytes: number): Promise<Request> {
  if (!request.body) return request;
  const body = await readLimitedText(request, maxBytes);
  return new Request(request.url, { method: request.method, headers: request.headers, body });
}

export async function readLimitedText(request: Request, maxBytes: number): Promise<string> {
  checkContentLength(request, maxBytes);
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      throw new RequestError(413, 'Request body too large');
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json')
    throw new RequestError(415, 'Expected application/json');
  const text = await readLimitedText(request, maxBytes);
  try {
    return JSON.parse(text);
  } catch {
    throw new RequestError(400, 'Malformed JSON');
  }
}

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
