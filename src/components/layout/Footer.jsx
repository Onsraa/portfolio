import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowUp, ArrowUpRight, Check, Copy, Download, Mail } from 'lucide-react';
import { Cursor, TypedText } from '@components/ui';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import data from '../../data/portfolioData.json';

const { config } = data;
const COMMAND = 'contact --all', TYPE_SPEED = 35;
const email = config.links.email.replace('mailto:', '');
const bare = (url) => url.replace(/^https?:\/\//, '').replace(/^\//, '');

const ROWS = [
    { label: 'github', href: config.links.github, value: bare(config.links.github), external: true },
    { label: 'linkedin', href: config.links.linkedin, value: bare(config.links.linkedin), external: true },
    { label: 'email', href: config.links.email, value: email, copy: true },
    { label: 'cv', href: config.links.cv, value: bare(config.links.cv), download: true },
];

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const srOnly = { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' };

function Row({ row, last, hidden, colors, t }) {
    const [hovered, setHovered] = useState(false);
    const [copied, setCopied] = useState(false);
    const Action = row.download ? Download : row.copy ? Mail : ArrowUpRight;

    const copy = () => {
        // a refused clipboard (permissions) leaves the label as it was; the address stays visible and clickable
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
        }, () => {});
    };

    return (
        <li className="footer-row" style={{ background: hovered ? colors.bgHover : 'transparent', opacity: hidden ? 0 : undefined }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <a href={row.href} className="footer-link"
               {...(row.external || row.download ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
               style={{ color: colors.textSecondary, textDecoration: 'none' }}>
                <span aria-hidden="true" style={{ color: colors.textDarkest }}>{last ? '└─' : '├─'}</span>
                <span className="footer-label" style={{ color: hovered ? colors.accent : colors.textDarker }}>{row.label}</span>
                <span className="footer-value" style={{ color: hovered ? colors.text : colors.textSecondary }}>{row.value}</span>
                <Action size={14} strokeWidth={1.8} aria-hidden="true"
                        style={{ color: hovered ? colors.accent : colors.textDarkest, transition: 'transform 0.2s ease, color 0.2s ease', transform: hovered ? (row.download ? 'translateY(2px)' : 'translate(2px,-2px)') : 'none' }} />
            </a>
            {row.copy && (
                <button type="button" onClick={copy} aria-label={`${t.copy} ${email}`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: `1px solid ${colors.borderLight}`, color: copied ? colors.accent : colors.textMuted, font: 'inherit', fontSize: '11px', padding: '2px 8px', cursor: 'pointer', flexShrink: 0 }}>
                    {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
                    <span aria-live="polite">{copied ? t.copied : t.copy}</span>
                </button>
            )}
        </li>
    );
}

export default function Footer() {
    const { colors } = useTheme();
    const { t } = useLanguage();
    const root = useRef(null);
    const [shown, setShown] = useState(false);

    // the command types itself and the links print out, once, when the footer comes into view
    useEffect(() => {
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setShown(true);
            io.disconnect();
        }, { threshold: 0.3 });
        io.observe(root.current);
        return () => io.disconnect();
    }, []);

    // layout effect: the rows are set to their start state before the browser paints them
    useLayoutEffect(() => {
        if (!shown || reducedMotion()) return undefined;
        const typed = (COMMAND.length * TYPE_SPEED) / 1000;
        const tween = gsap.fromTo(root.current.querySelectorAll('.footer-row, .footer-prompt'),
            { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.09, delay: typed + 0.15 });
        return () => tween.kill();
    }, [shown]);

    const toTop = () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    const hidden = !shown && !reducedMotion();

    return (
        <footer ref={root} style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 64px', borderTop: `1px solid ${colors.border}` }}>
            <div style={{ border: `1px solid ${colors.borderLight}`, background: colors.bgSecondary }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 14px', borderBottom: `1px solid ${colors.borderLight}`, fontSize: '11px', color: colors.textDarkest }}>
                    <span>teddy@portfolio:~/contact</span>
                    <span aria-hidden="true">zsh</span>
                </div>
                <div style={{ padding: '18px 14px 16px', fontSize: '14px' }}>
                    <div style={{ color: colors.text, marginBottom: '10px' }}>
                        <span style={{ color: colors.textDarkest }}>$ </span>
                        {reducedMotion() ? COMMAND : shown && <TypedText text={COMMAND} speed={TYPE_SPEED} />}
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {ROWS.map((row, i) => (
                            <Row key={row.label} row={row} last={i === ROWS.length - 1} hidden={hidden} colors={colors} t={t} />
                        ))}
                    </ul>
                    <div className="footer-prompt" style={{ marginTop: '10px', color: colors.textDarkest, opacity: hidden ? 0 : undefined }}>
                        $ <Cursor />
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', fontSize: '13px', color: colors.textDarkest }}>
                <span>© {new Date().getFullYear()} · {config.name}</span>
                <button type="button" onClick={toTop}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: colors.textDarker, font: 'inherit', fontSize: '12px', cursor: 'pointer', padding: 0 }}>
                    cd ~ <ArrowUp size={13} aria-hidden="true" /><span style={srOnly}>{t.backToTop}</span>
                </button>
            </div>
        </footer>
    );
}
