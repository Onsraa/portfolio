import { useTheme } from '@context/ThemeContext';
import data from '../../data/portfolioData.json';

const { config } = data;

export default function Footer() {
    const { colors } = useTheme();

    return (
        <footer style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '40px 24px 80px',
            borderTop: `1px solid ${colors.border}`,
        }}>
            <span style={{ color: colors.textDarkest, fontSize: '13px' }}>
                © {new Date().getFullYear()} · {config.name}
            </span>
        </footer>
    );
}
