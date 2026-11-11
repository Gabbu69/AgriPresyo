export const SIMULATION_NOTICE = 'Simulation: generated prices, vendor offers, and stock. Not verified market information.';

export function csvCell(value: unknown): string {
  let text = String(value ?? '');
  if (typeof value !== 'number' && /^\s*[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function simulationCsv(rows: unknown[][], generatedAt = new Date().toISOString()): string {
  return [
    ['AgriPresyo market-interface simulation'],
    [SIMULATION_NOTICE],
    ['Generated at (UTC)', generatedAt],
    [],
    ...rows,
  ].map(row => row.map(csvCell).join(',')).join('\r\n');
}
