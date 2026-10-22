import { useTheme } from '@context/ThemeContext';
import data from '../../data/portfolioData.json';

const { config } = data;

const LINKS = [
    { label: 'github', href: config.links.github, external: true },
    { label: 'linkedin', href: config.links.linkedin, external: true },
    { label: config.links.email.replace('mailto:', ''), href: config.links.email },
    { label: 'download cv', href: config.links.cv, external: true },
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
            alignItems: 'baseline',
            gap: '16px 24px',
        }}>
            <nav aria-label="Contact" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                {LINKS.map(({ label, href, external }) => (
                    <a key={label} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                       style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '14px' }}>
                        <span style={{ color: colors.textDarkest }}>→</span> {label}
                    </a>
                ))}
            </nav>
            <span style={{ color: colors.textDarkest, fontSize: '13px' }}>
                © {new Date().getFullYear()} · {config.name}
            </span>
        </footer>
    );
}
