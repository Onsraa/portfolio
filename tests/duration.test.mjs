import assert from 'node:assert/strict';
import { duration } from '../src/data/duration.js';

assert.equal(duration('2023-10', '2025-08'), '1 yr 11 mos'); // SNCF on LinkedIn
assert.equal(duration('2022-10', '2023-09'), '1 yr');
assert.equal(duration('2026-09', null, new Date('2026-10-21')), '2 mos');
assert.equal(duration('2025-12', null, new Date('2026-10-21')), '11 mos');
console.log('duration ok');
