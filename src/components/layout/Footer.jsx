import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import data from '../../data/portfolioData.json';

const { config } = data;

export default function Footer() {
    const { colors } = useTheme();
    const { language } = useLanguage();

    const locale = language === 'fr' ? 'fr-FR' : 'en-US';

    return (
        <footer style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '40px 24px 80px',
            borderTop: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
        }}>
            <span style={{ color: colors.textDarkest, fontSize: '13px' }}>
                © {new Date().getFullYear()} · {config.name}
            </span>
            <span style={{ color: colors.textDarkest, fontSize: '13px' }}>
                {new Date().toLocaleDateString(locale)}
            </span>
        </footer>
    );
}
