// Wireframe models for the project icons, in a unit space (about -1..1), keyed by project_id.
// edges are drawn in the line colour, hot edges and hotDots in the accent colour.

// every model is centred and scaled to radius 1, so SCALE alone sets how much of the box an icon fills:
// at most DIST / (DIST - 1) * SCALE * size from the centre, about 0.48 of the size here
const TILT = 0.62, DIST = 3.2, SCALE = 0.33;

// Rotate about the vertical axis, tilt towards the viewer, then perspective-project into a size×size box.
export function project([x, y, z], angle, size) {
    const c = Math.cos(angle), s = Math.sin(angle);
    const x1 = x * c + z * s, z1 = -x * s + z * c;
    const ct = Math.cos(TILT), st = Math.sin(TILT);
    const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
    const f = DIST / (DIST - z2);
    return [size / 2 + x1 * f * size * SCALE, size / 2 - y2 * f * size * SCALE, z2];
}

function model() {
    const m = { points: [], edges: [], hot: [], dots: [], hotDots: [] };
    m.pt = (p) => m.points.push(p) - 1;
    m.box = ([cx, cy, cz], [sx, sy, sz], list = m.edges) => {
        const i = [-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [-1, 1].map((d) => m.pt([cx + a * sx / 2, cy + b * sy / 2, cz + d * sz / 2]))));
        // corners differ in exactly one coordinate along an edge
        for (let a = 0; a < 8; a++) for (const bit of [1, 2, 4]) if (!(a & bit)) list.push([i[a], i[a | bit]]);
    };
    m.ring = (pts, list = m.edges) => { const i = pts.map(m.pt); i.forEach((a, k) => list.push([a, i[(k + 1) % i.length]])); return i; };
    return m;
}

// MAFIS: a warehouse floor grid with robots on it, one of them faulted.
function mafis() {
    const m = model(), y = -0.5, g = [-1, -0.5, 0, 0.5, 1];
    for (const v of g) {
        m.edges.push([m.pt([v, y, -1]), m.pt([v, y, 1])]);
        m.edges.push([m.pt([-1, y, v]), m.pt([1, y, v])]);
    }
    for (const [x, z] of [[-0.75, 0.25], [0.25, -0.75], [0.75, 0.75]]) m.box([x, y + 0.15, z], [0.3, 0.3, 0.3]);
    m.box([-0.25, y + 0.15, -0.25], [0.3, 0.3, 0.3], m.hot);
    return m;
}

// Cressey: the fraud triangle as a prism; its three front corners are pressure, opportunity and rationalization.
function cressey() {
    const m = model();
    const tri = (z) => [90, 210, 330].map((a) => [0.95 * Math.cos(a * Math.PI / 180), 0.95 * Math.sin(a * Math.PI / 180) - 0.1, z]);
    const front = m.ring(tri(0.3), m.hot), back = m.ring(tri(-0.3));
    front.forEach((a, k) => m.edges.push([a, back[k]]));
    m.hotDots.push(...front);
    return m;
}

// sprint0: an orchestrator hub dispatching to the team around it.
function sprint0() {
    const m = model(), hub = m.pt([0, 0, 0]);
    const equator = [[0.9, 0, 0], [0, 0, 0.9], [-0.9, 0, 0], [0, 0, -0.9]];
    const ring = m.ring(equator);
    const poles = [[0, 0.9, 0], [0, -0.9, 0]].map(m.pt);
    for (const s of [...ring, ...poles]) m.hot.push([hub, s]);
    m.dots.push(...ring, ...poles);
    m.hotDots.push(hub);
    return m;
}

// Robozzle: a path of tiles and the robot that follows its program along it.
function robozzle() {
    const m = model(), y = -0.4, h = 0.22;
    for (const [x, z] of [[-0.75, -0.75], [-0.25, -0.75], [0.25, -0.75], [0.25, -0.25], [0.25, 0.25], [0.75, 0.25]])
        m.box([x, y - 0.06, z], [2 * h, 0.12, 2 * h]);
    // the robot: a small pyramid pointing along the path
    const base = m.ring([[-0.55, y + 0.05, -0.75], [-0.95, y + 0.05, -0.95], [-0.95, y + 0.05, -0.55]], m.hot);
    const apex = m.pt([-0.8, y + 0.45, -0.75]);
    base.forEach((b) => m.hot.push([b, apex]));
    return m;
}

// Particle Life: a cloud of particles, linked where they are close enough to interact.
function particleLife() {
    const m = model(), n = 30, golden = Math.PI * (3 - Math.sqrt(5));
    const ids = [];
    for (let i = 0; i < n; i++) {
        const y = 1 - (2 * (i + 0.5)) / n, r = Math.sqrt(1 - y * y), a = i * golden;
        const k = 0.6 + 0.3 * ((i * 7919) % 13) / 13; // fixed pseudo-random radius
        ids.push(m.pt([Math.cos(a) * r * k, y * k, Math.sin(a) * r * k]));
    }
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const [a, b] = [m.points[ids[i]], m.points[ids[j]]];
        if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 0.42) m.edges.push([ids[i], ids[j]]);
    }
    m.dots.push(...ids);
    m.hotDots.push(ids[3], ids[11], ids[19], ids[26]);
    return m;
}

// Harmonies with WFC: hexagonal tiles of different heights, as the algorithm collapses them.
function harmonies() {
    const m = model(), r = 0.32, w = Math.sqrt(3) * r, base = -0.55;
    const cells = [[0, 0], [1, 0], [-1, 0], [0.5, 1], [-0.5, 1], [0.5, -1], [-0.5, -1]];
    const heights = [0.75, 0.25, 0.45, 0.15, 0.6, 0.35, 0.2];
    cells.forEach(([q, row], k) => {
        const cx = q * w, cz = row * 1.5 * r;
        const hex = (y) => [0, 1, 2, 3, 4, 5].map((i) => { const a = Math.PI / 6 + i * Math.PI / 3; return [cx + r * Math.cos(a), y, cz + r * Math.sin(a)]; });
        const top = m.ring(hex(base + heights[k]), k === 0 ? m.hot : m.edges), bottom = m.ring(hex(base));
        top.forEach((t, i) => m.edges.push([t, bottom[i]]));
    });
    return m;
}

// Machine Learning: a small neural network, layer by layer.
function machineLearning() {
    const m = model();
    const layers = [3, 4, 2].map((count, l) => Array.from({ length: count }, (_, i) =>
        m.pt([-0.9 + l * 0.9, (i - (count - 1) / 2) * 0.55, (i % 2 ? 0.25 : -0.25)])));
    for (let l = 0; l < 2; l++) for (const a of layers[l]) for (const b of layers[l + 1]) m.edges.push([a, b]);
    m.dots.push(...layers[0], ...layers[1]);
    m.hotDots.push(...layers[2]);
    return m;
}

// Centre a model on its bounding box and scale it so its farthest point sits at radius 1.
function fit(m) {
    const lo = [0, 1, 2].map((k) => Math.min(...m.points.map((p) => p[k])));
    const hi = [0, 1, 2].map((k) => Math.max(...m.points.map((p) => p[k])));
    const c = lo.map((v, k) => (v + hi[k]) / 2);
    const centred = m.points.map((p) => p.map((v, k) => v - c[k]));
    const r = Math.max(...centred.map((p) => Math.hypot(...p)));
    m.points = centred.map((p) => p.map((v) => v / r));
    return m;
}

export const SHAPES = Object.fromEntries(Object.entries({
    '005': mafis, '007': cressey, '006': sprint0, '004': robozzle,
    '003': particleLife, '002': harmonies, '001': machineLearning,
}).map(([id, build]) => [id, fit(build())]));
