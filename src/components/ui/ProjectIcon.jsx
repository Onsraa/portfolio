import { useEffect, useRef } from 'react';
import { SHAPES, project } from './projectShapes.js';

// One animation loop drives every visible icon.
const live = new Set();
let frame = 0;
function loop(now) {
    live.forEach((draw) => draw(now));
    frame = live.size ? requestAnimationFrame(loop) : 0;
}
function start(draw) { live.add(draw); if (!frame) frame = requestAnimationFrame(loop); }
function stop(draw) { live.delete(draw); }

const SIZE = 56;

// A small rotating wireframe that stands for the project: edges behind the centre are dimmed.
export default function ProjectIcon({ projectId, color, accent, fast = false }) {
    const shape = SHAPES[projectId];
    const svg = useRef(null);
    const speed = useRef(fast ? 1.6 : 0.45);
    speed.current = fast ? 1.6 : 0.45;

    useEffect(() => {
        if (!shape) return undefined;
        const el = svg.current;
        const [front, back, hot, dots, hotDots] = el.children;
        let angle = 0.6, last = 0;
        const draw = (now) => {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
            last = now;
            angle += dt * speed.current;
            const p = shape.points.map((q) => project(q, angle, SIZE));
            const seg = (edges, keep) => edges.filter(keep).map(([a, b]) => `M${p[a][0].toFixed(1)},${p[a][1].toFixed(1)}L${p[b][0].toFixed(1)},${p[b][1].toFixed(1)}`).join('');
            const z = ([a, b]) => p[a][2] + p[b][2];
            front.setAttribute('d', seg(shape.edges, (e) => z(e) >= 0));
            back.setAttribute('d', seg(shape.edges, (e) => z(e) < 0));
            hot.setAttribute('d', seg(shape.hot ?? [], () => true));
            const ring = (ids, r) => ids.map((i) => `M${(p[i][0] - r).toFixed(1)},${p[i][1].toFixed(1)}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0`).join('');
            dots.setAttribute('d', ring(shape.dots ?? [], 1.3));
            hotDots.setAttribute('d', ring(shape.hotDots ?? [], 2));
        };
        draw(0);
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        // animate only while the icon is on screen
        const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start(draw) : stop(draw)));
        io.observe(el);
        return () => { io.disconnect(); stop(draw); };
    }, [shape]);

    if (!shape) return null;
    return (
        <svg ref={svg} width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true" style={{ flexShrink: 0, overflow: 'visible' }}>
            <path fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" />
            <path fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
            <path fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
            <path fill={color} />
            <path fill={accent} />
        </svg>
    );
}
