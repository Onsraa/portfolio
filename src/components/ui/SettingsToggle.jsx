import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';

// A thin circle, half filled: the filled half turns to the other side when the theme changes.
function ThemeIcon({ dark }) {
    return (
        <svg className="theme-icon" width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"
             style={{ transform: dark ? 'rotate(0deg)' : 'rotate(180deg)' }}>
            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 1.5 A6.5 6.5 0 0 1 8 14.5 Z" fill="currentColor" />
        </svg>
    );
}

export default function SettingsToggle() {
    const { theme, toggleTheme, colors } = useTheme();
    const { language, toggleLanguage } = useLanguage();

    const buttonStyle = {
        background: 'none',
        border: `1px solid ${colors.borderLight}`,
        padding: '6px 12px',
        color: colors.textMuted,
        fontSize: '11px',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    };

    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <button
                onClick={toggleTheme}
                style={{ ...buttonStyle, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <ThemeIcon dark={theme === 'dark'} />
            </button>
            <button
                onClick={toggleLanguage}
                style={buttonStyle}
                title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
                aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
                {language.toUpperCase()}
            </button>
        </div>
    );
}
