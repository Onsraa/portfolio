import assert from 'node:assert/strict';
import { pagePoint } from '../src/components/bookGeometry.js';

for (const turn of [-1, 0, 0.25, 0.5, 0.75, 1, 2]) {
  for (let x = 0; x <= 1.52; x += 0.08) {
    const point = pagePoint(x, 0.6, turn);
    assert.ok(point.every(Number.isFinite), 'Page vertices must remain finite');
    assert.equal(point[0], x, 'The page width must remain stable');
    assert.equal(point[1], 0.6, 'The page height must remain stable');
  }
  assert.deepEqual(pagePoint(0, 0.6, turn), [0, 0.6, 0], 'The spine must stay anchored');
}
assert.equal(pagePoint(1, 0, 0)[2], 0, 'Closed pages must lie flat');
assert.ok(Math.abs(pagePoint(1, 0, 1)[2]) < 1e-12, 'Turned pages must lie flat');
assert.ok(pagePoint(1, 0, 0.5)[2] > 0.3, 'A turning page must visibly curve');
console.log('Book geometry: anchored spine, finite vertices, and page curvature passed.');
