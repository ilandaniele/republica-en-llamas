import { afterEach, describe, expect, it, vi } from 'vitest';
import { ELECTION_PARTIES, getElectionNight, initGame } from '@republica/game-engine';
import { downloadElectionCsv, electionCsv } from '../electionCsv.js';

const headings = {
  district: 'Distrito',
  total: 'Votos contados',
  leader: 'Va primero',
  national: 'Nacional',
  simulated: 'Votos simulados',
};
function finalFrame() {
  return getElectionNight({ ...initGame('normal', 42), turn: 40 }).frames.at(-1)!;
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('electoral CSV', () => {
  it('exports the 24 districts and national totals with the same vote sums and Unicode names', () => {
    const frame = finalFrame();
    const csv = electionCsv(frame, headings);
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    const rows = csv
      .slice(1)
      .trim()
      .split('\r\n')
      .map((line) => line.split(';'));
    expect(rows).toHaveLength(26);
    expect(csv).toContain('"Córdoba"');
    expect(csv).toContain('"Votos simulados"');
    for (const [index, district] of frame.districts.entries()) {
      const row = rows[index + 1]!;
      expect(row[0]).toBe(`"${district.id}"`);
      const votes = row.slice(2, 7).map(Number);
      expect(votes.reduce((sum, count) => sum + count, 0)).toBe(district.counted);
      expect(row[9]).toBe('"true"');
    }
    const national = rows.at(-1)!;
    ELECTION_PARTIES.forEach((party, index) => expect(Number(national[index + 2])).toBe(frame.votes[party]));
    expect(Number(national[7])).toBe(frame.counted);
  });

  it('escapes quotes, separators and spreadsheet expressions in text cells', () => {
    const frame = finalFrame();
    frame.districts[0]!.name = '=SUM(1;2) "prueba"';
    expect(electionCsv(frame, headings)).toContain('"\'=SUM(1;2) ""prueba"""');
  });

  it('cleans up the temporary link and blob URL even if downloading fails', () => {
    const revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:electoral'), revokeObjectURL: revoke });
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    downloadElectionCsv(finalFrame(), headings);
    expect(click).toHaveBeenCalledOnce();
    expect(revoke).toHaveBeenCalledWith('blob:electoral');
    expect(document.querySelector('a[download]')).toBeNull();
    click.mockImplementation(() => {
      throw new Error('download failed');
    });
    expect(() => downloadElectionCsv(finalFrame(), headings)).toThrow();
    expect(revoke).toHaveBeenCalledTimes(2);
    expect(document.querySelector('a[download]')).toBeNull();
  });
});
