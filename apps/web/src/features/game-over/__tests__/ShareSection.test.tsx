import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import html2canvas from 'html2canvas';
import { ShareSection } from '../ShareSection.js';

vi.mock('html2canvas', () => ({ default: vi.fn() }));
vi.mock('../../../lib/analytics.js', () => ({ trackShareClicked: vi.fn() }));
const mockRender = vi.mocked(html2canvas);
beforeEach(() => {
  vi.clearAllMocks();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('pixel image sharing', () => {
  it('keeps sharing disabled until PNG encoding and the share sheet finish', async () => {
    let encode: BlobCallback = () => {};
    let finishShare = () => {};
    const canvas = {
      width: 1200,
      height: 680,
      toBlob: vi.fn((callback: BlobCallback) => {
        encode = callback;
      }),
    };
    mockRender.mockResolvedValue(canvas as unknown as HTMLCanvasElement);
    const share = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finishShare = resolve;
        }),
    );
    vi.stubGlobal('navigator', { canShare: () => true, share });
    render(<ShareSection viralText="Prueba" shareCardRef={{ current: document.createElement('div') }} />);
    fireEvent.click(screen.getByRole('button', { name: /IMAGEN/ }));
    await waitFor(() => expect(canvas.toBlob).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: '...' })).toBeDisabled();
    await act(async () => encode(new Blob(['pixel'], { type: 'image/png' })));
    expect(share).toHaveBeenCalledOnce();
    expect(screen.getByRole('button', { name: '...' })).toBeDisabled();
    await act(async () => finishShare());
    expect(screen.getByRole('button', { name: /IMAGEN/ })).toBeEnabled();
    expect(canvas.width).toBe(0);
    expect(canvas.height).toBe(0);
  });

  it('reports a failed encoding and releases the pixel buffer so it can be retried', async () => {
    const canvas = { width: 1200, height: 680, toBlob: vi.fn((callback: BlobCallback) => callback(null)) };
    mockRender.mockResolvedValue(canvas as unknown as HTMLCanvasElement);
    render(<ShareSection viralText="Prueba" shareCardRef={{ current: document.createElement('div') }} />);
    fireEvent.click(screen.getByRole('button', { name: /IMAGEN/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo compartir');
    expect(screen.getByRole('button', { name: /IMAGEN/ })).toBeEnabled();
    expect(canvas.width).toBe(0);
  });
});
