import { ELECTION_PARTIES, PARTIES, type ElectionCountFrame } from '@republica/game-engine';

export interface CsvHeadings {
  district: string;
  total: string;
  leader: string;
  national: string;
  simulated: string;
}

function csvCell(value: string | number): string {
  if (typeof value === 'number') return String(value);
  const safe = /^[=+@-]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function electionCsv(frame: ElectionCountFrame, headings: CsvHeadings): string {
  const header = [
    'ID',
    headings.district,
    ...ELECTION_PARTIES.map((party) => PARTIES[party].label),
    headings.total,
    headings.leader,
    headings.simulated,
  ];
  const rows = frame.districts.map((district) => [
    district.id,
    district.name,
    ...ELECTION_PARTIES.map((party) => district.votes[party]),
    district.counted,
    district.leader ? PARTIES[district.leader].label : '',
    'true',
  ]);
  rows.push([
    'TOTAL',
    headings.national,
    ...ELECTION_PARTIES.map((party) => frame.votes[party]),
    frame.counted,
    frame.leader ? PARTIES[frame.leader].label : '',
    'true',
  ]);
  return '\uFEFF' + [header, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n') + '\r\n';
}

export function downloadElectionCsv(frame: ElectionCountFrame, headings: CsvHeadings): void {
  const url = URL.createObjectURL(
    new Blob([electionCsv(frame, headings)], { type: 'text/csv;charset=utf-8' }),
  );
  const anchor = document.createElement('a');
  try {
    anchor.href = url;
    anchor.download = 'escrutinio-republica-en-llamas.csv';
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    URL.revokeObjectURL(url);
  }
}
