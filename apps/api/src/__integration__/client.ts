import { SELF } from 'cloudflare:test';
import { drawNextCard, endTurn, initGame, resolveTurn } from '@republica/game-engine';
import type { RunConfig, TurnDecision } from '@republica/game-engine';

export const WEB_URL = 'https://game.test';
export const PASSWORD = 'integration-pass-123';

let ipCounter = 0;

export function uniqueIp(): string {
  ipCounter += 1;
  return `10.${Math.floor(ipCounter / 65_536) % 256}.${Math.floor(ipCounter / 256) % 256}.${ipCounter % 256}`;
}

export function uniqueEmail(): string {
  return `player-${crypto.randomUUID()}@example.test`;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  rawBody?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private readonly cookies = new Map<string, string>();

  constructor(readonly ip = uniqueIp()) {}

  get cookieNames(): string[] {
    return [...this.cookies.keys()];
  }

  async request(path: string, options: RequestOptions = {}): Promise<Response> {
    const method =
      options.method ?? (options.body === undefined && options.rawBody === undefined ? 'GET' : 'POST');
    const headers = new Headers({ 'CF-Connecting-IP': this.ip, ...options.headers });
    if (method !== 'GET' && !headers.has('origin')) headers.set('origin', WEB_URL);
    if (this.cookies.size > 0)
      headers.set('cookie', [...this.cookies].map(([name, value]) => `${name}=${value}`).join('; '));
    let body = options.rawBody;
    if (options.body !== undefined) {
      body = JSON.stringify(options.body);
      headers.set('content-type', 'application/json');
    }
    const response = await SELF.fetch(`${WEB_URL}${path}`, { method, headers, body: body ?? null });
    this.storeCookies(response);
    return response;
  }

  async json<T>(path: string, options: RequestOptions = {}): Promise<{ status: number; body: T }> {
    const response = await this.request(path, options);
    return { status: response.status, body: (await response.json()) as T };
  }

  private storeCookies(response: Response): void {
    for (const header of response.headers.getSetCookie()) {
      const pair = header.split(';')[0] ?? '';
      const separator = pair.indexOf('=');
      const name = pair.slice(0, separator).trim();
      const value = pair.slice(separator + 1);
      if (value === '') this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
  }
}

export async function signUp(client = new ApiClient(), email = uniqueEmail()): Promise<ApiClient> {
  const response = await client.request('/api/auth/sign-up/email', {
    body: { email, password: PASSWORD, name: 'Integration' },
  });
  if (response.status !== 200) throw new Error(`sign-up failed: ${response.status} ${await response.text()}`);
  return client;
}

export async function signInAsGuest(client = new ApiClient()): Promise<ApiClient> {
  const response = await client.request('/api/auth/sign-in/anonymous', { body: {} });
  if (response.status !== 200) throw new Error(`guest sign-in failed: ${response.status}`);
  return client;
}

export function finishedRun(config: RunConfig): { config: RunConfig; decisions: TurnDecision[] } {
  let state = initGame(
    config.difficulty,
    config.seed,
    'es',
    config.scenarioId ?? undefined,
    config.presidentId,
  );
  const decisions: TurnDecision[] = [];
  while (!state.isGameOver) {
    const card = drawNextCard(state);
    const decision: TurnDecision = card.isLaw
      ? { kind: 'congress', cardId: card.id, decisions: { actions: [], swingChoices: [] } }
      : { kind: 'choice', cardId: card.id, choiceIndex: 0 };
    state = endTurn(resolveTurn(state, card, decision).state);
    decisions.push(decision);
  }
  return { config, decisions };
}

export async function startTicket(client: ApiClient): Promise<{ ticketId: string; seed: number }> {
  const { status, body } = await client.json<{ ticketId: string; seed: number }>('/api/start-run', {
    body: {},
  });
  if (status !== 200) throw new Error(`start-run failed: ${status}`);
  return body;
}
