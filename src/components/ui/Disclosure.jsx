import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// while closed, a partly visible line fades out at its end instead of being cut
const FADE = 'linear-gradient(90deg, #000 70%, transparent)';

// A region that opens and closes with a GSAP height tween.
// collapsed: the height in px it keeps while closed (0 hides it, and makes it inert so hidden links can't be reached).
// Its height is never set from React props, so re-renders (hover, theme) can't make it jump mid-tween.
export function Disclosure({ id, open, collapsed = 0, children }) {
    const ref = useRef(null);
    const mounted = useRef(false);

    useLayoutEffect(() => {
        const el = ref.current;
        const fade = collapsed > 0 && !open ? FADE : 'none';
        if (!mounted.current) {
            mounted.current = true;
            gsap.set(el, { height: open ? 'auto' : collapsed, opacity: open || collapsed ? 1 : 0, maskImage: fade, webkitMaskImage: fade });
            return;
        }
        if (open) gsap.set(el, { maskImage: 'none', webkitMaskImage: 'none' });
        // overwrite: a click mid-tween turns the motion around from where it is
        gsap.to(el, {
            height: open ? 'auto' : collapsed,
            opacity: open || collapsed ? 1 : 0,
            duration: reducedMotion() ? 0 : open ? 0.5 : 0.4,
            ease: open ? 'power3.out' : 'power2.inOut',
            overwrite: true,
            onComplete: () => { if (!open) gsap.set(el, { maskImage: fade, webkitMaskImage: fade }); },
        });
    }, [open, collapsed]);

    const hidden = !open && collapsed === 0;
    return (
        // React 18 passes inert as a plain attribute
        <div id={id} ref={ref} style={{ overflow: 'hidden' }} aria-hidden={hidden || undefined} inert={hidden ? '' : undefined}>
            {children}
        </div>
    );
}
