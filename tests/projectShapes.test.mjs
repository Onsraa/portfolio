import assert from 'node:assert/strict';
import { SHAPES, project } from '../src/components/ui/projectShapes.js';

const ids = ['001', '002', '003', '004', '005', '006', '007'];
assert.deepEqual(Object.keys(SHAPES).sort(), ids, 'one model per project');
for (const id of ids) {
  const s = SHAPES[id], n = s.points.length;
  for (const [a, b] of [...s.edges, ...s.hot]) assert.ok(a >= 0 && a < n && b >= 0 && b < n && a !== b, `${id}: edge ${a}-${b}`);
  for (const i of [...s.dots, ...s.hotDots]) assert.ok(i >= 0 && i < n, `${id}: dot ${i}`);
  assert.ok(s.edges.length + s.hot.length + s.dots.length > 0, `${id}: draws something`);
  // every point stays inside the 56px box at any angle
  for (let a = 0; a < 2 * Math.PI; a += 0.2)
    for (const q of s.points) {
      const [x, y] = project(q, a, 56);
      assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 56 && y >= 0 && y <= 56, `${id}: point ${q} at angle ${a.toFixed(1)} -> ${x.toFixed(1)},${y.toFixed(1)}`);
    }
}
console.log('project shapes ok');
