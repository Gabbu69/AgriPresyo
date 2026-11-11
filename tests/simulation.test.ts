import assert from 'node:assert/strict';
import { test } from 'node:test';
import { csvCell, simulationCsv } from '../lib/simulation.ts';

test('export retains simulation identity and date outside the application', () => {
  const csv = simulationCsv([['Crop', 'Price'], ['Rice', 20]], '2026-11-11T00:00:00Z');
  assert.match(csv, /Simulation: generated prices/);
  assert.match(csv, /2026-11-11T00:00:00Z/);
  assert.match(csv, /"Rice","20"/);
});
test('CSV preserves commas and quotes while neutralizing formula-like text', () => {
  assert.equal(csvCell('Rice, "sample"'), '"Rice, ""sample"""');
  for (const value of ['=1+1', '+SUM(A1)', '@SUM(A1)', '-1+2', '  =HYPERLINK("x")']) assert.ok(csvCell(value).startsWith('"\''));
  assert.equal(csvCell(-5), '"-5"');
});
