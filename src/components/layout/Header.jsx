import { Cursor, TypedText, SettingsToggle } from '@components/ui';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import data from '../../data/portfolioData.json';

const { config } = data;

export default function Header({ loaded }) {
    const { colors } = useTheme();
    const { t } = useLanguage();

    return (
        <header style={{
            padding: '80px 24px 60px',
            maxWidth: '900px',
            margin: '0 auto',
            borderBottom: `1px solid ${colors.border}`
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
            }}>
                <div style={{
                    color: colors.textDarkest,
                    fontSize: '13px',
                    fontWeight: 300
                }}>
                    <TypedText text="~/portfolio $" delay={200} />
                </div>
                <SettingsToggle />
            </div>

            <h1 style={{
                margin: '0 0 24px 0',
                fontSize: 'clamp(32px, 6vw, 48px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                color: colors.accent
            }}>
                <TypedText text={config.name} delay={600} />
                <span style={{ color: colors.textDarkest }}><Cursor /></span>
            </h1>

            <p style={{
                margin: 0,
                color: colors.textMuted,
                fontSize: '15px',
                maxWidth: '560px',
                lineHeight: 1.8,
                opacity: loaded ? 1 : 0,
                transform: loaded ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.6s ease 1.2s'
            }}>
                {t.introduction}
            </p>

        </header>
    );
}
