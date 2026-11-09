export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function isAllowedOrigin(origin: string | null, allowedOrigins: readonly string[]): boolean {
  return origin === null || allowedOrigins.includes(origin);
}

export function bearerToken(authorization: string | null): string | null {
  if (!authorization || authorization.length > 8200) return null;
  return /^Bearer ([A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)$/i.exec(authorization)?.[1] ?? null;
}

export function checkContentLength(req: Request, maxBytes: number): void {
  const length = req.headers.get('content-length');
  if (length && (!/^\d+$/.test(length) || Number(length) > maxBytes))
    throw new RequestError(413, 'Request body too large');
  const encoding = req.headers.get('content-encoding');
  if (encoding && encoding !== 'identity') throw new RequestError(415, 'Unsupported content encoding');
}

export async function readLimitedText(req: Request, maxBytes: number, timeoutMs = 15000): Promise<string> {
  checkContentLength(req, maxBytes);
  if (!req.body) return '';
  const reader = req.body.getReader();
  const bytes = new Uint8Array(maxBytes);
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, timeoutMs);
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (timedOut) throw new RequestError(408, 'Request body timed out');
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        void reader.cancel().catch(() => {});
        throw new RequestError(413, 'Request body too large');
      }
      bytes.set(value, size - value.byteLength);
    }
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
  return new TextDecoder().decode(bytes.subarray(0, size));
}

export async function readJsonBody(req: Request, maxBytes: number): Promise<unknown> {
  if (req.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase() !== 'application/json')
    throw new RequestError(415, 'Expected application/json');
  try {
    return JSON.parse(await readLimitedText(req, maxBytes));
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError(400, 'Malformed JSON');
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function canUseRunModes(config: Record<string, unknown>, entitlements: readonly string[]): boolean {
  if (entitlements.includes('full_access')) return true;
  return (
    (!config.crisisExpress || entitlements.includes('mode_crisis_express')) &&
    (!config.scenarioId || entitlements.includes('mode_historical'))
  );
}
