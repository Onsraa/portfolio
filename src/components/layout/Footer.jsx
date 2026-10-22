import { createLucideIcon, Mail } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';
import data from '../../data/portfolioData.json';

const { config } = data;

// lucide's own github and linkedin icons (ISC, lucide-static 0.577.0): lucide-react 1.x no longer ships brand icons
const Github = createLucideIcon({ name: 'github', size: 24, node: [
    ['path', { d: 'M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4', key: 'head' }],
    ['path', { d: 'M9 18c-4.51 2-5-2-7-2', key: 'tail' }],
] });
const Linkedin = createLucideIcon({ name: 'linkedin', size: 24, node: [
    ['path', { d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z', key: 'n' }],
    ['rect', { width: '4', height: '12', x: '2', y: '9', key: 'i' }],
    ['circle', { cx: '4', cy: '4', r: '2', key: 'dot' }],
] });

const LINKS = [
    { label: 'GitHub', href: config.links.github, Icon: Github, external: true },
    { label: 'LinkedIn', href: config.links.linkedin, Icon: Linkedin, external: true },
    { label: config.links.email.replace('mailto:', ''), href: config.links.email, Icon: Mail },
];

export default function Footer() {
    const { colors } = useTheme();

    return (
        <footer style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '72px 24px 80px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px 24px',
        }}>
            <nav aria-label="Contact" style={{ display: 'flex', gap: '20px' }}>
                {LINKS.map(({ label, href, Icon, external }) => (
                    // icon only: the label names the link for screen readers and shows as a tooltip
                    <a key={label} href={href} aria-label={label} title={label}
                       {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                       style={{ color: colors.textMuted, display: 'inline-flex' }}>
                        <Icon size={18} strokeWidth={1.6} aria-hidden={true}/>
                    </a>
                ))}
            </nav>
            <span style={{ color: colors.textDarkest, fontSize: '13px' }}>
                © {new Date().getFullYear()} · {config.name}
            </span>
        </footer>
    );
}
