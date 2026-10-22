import assert from 'node:assert/strict';
import { duration } from '../src/data/duration.js';

assert.equal(duration('2023-10', '2025-08'), '1 yr 11 mos'); // SNCF on LinkedIn
assert.equal(duration('2023-10', '2025-08', 'fr'), '1 an 11 mois');
assert.equal(duration('2022-10', '2023-09', 'fr'), '1 an');
assert.equal(duration('2026-09', null, 'en', new Date('2026-10-21')), '2 mos');
assert.equal(duration('2025-12', null, 'fr', new Date('2026-10-21')), '11 mois');
console.log('duration ok');
