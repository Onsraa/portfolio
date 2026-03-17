import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
    dark: {
        bg: '#0a0a0a',
        bgSecondary: '#0d0d0d',
        bgHover: '#111',
        border: '#1a1a1a',
        borderLight: '#222',
        text: '#e0e0e0',
        textSecondary: '#999',
        textMuted: '#666',
        textDark: '#9a9a9a',
        textDarker: '#888',
        textDarkest: '#767676',
        accent: '#fff',
        errorBg: '#1a1111',
        errorText: '#cc6666',
        errorBorder: '#442222',
        successBg: '#112211',
        successText: '#66cc66',
        successBorder: '#224422',
    },
    light: {
        bg: '#fafafa',
        bgSecondary: '#f0f0f0',
        bgHover: '#e8e8e8',
        border: '#e0e0e0',
        borderLight: '#d0d0d0',
        text: '#1a1a1a',
        textSecondary: '#555',
        textMuted: '#666',
        textDark: '#777',
        textDarker: '#666',
        textDarkest: '#555',
        accent: '#000',
        errorBg: '#fef2f2',
        errorText: '#b91c1c',
        errorBorder: '#fecaca',
        successBg: '#f0fdf4',
        successText: '#15803d',
        successBorder: '#bbf7d0',
    },
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved || 'dark';
    });

    const isDark = theme === 'dark';
    const colors = themes[theme];

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const root = document.documentElement;
        document.body.style.backgroundColor = colors.bg;
        root.style.setProperty('--bg-color', colors.bg);
        root.style.setProperty('--selection-bg', isDark ? '#fff' : '#333');
        root.style.setProperty('--selection-color', isDark ? '#000' : '#fff');
        root.style.setProperty('--scrollbar-track', colors.bg);
        root.style.setProperty('--scrollbar-thumb', isDark ? '#333' : '#ccc');
        root.style.setProperty('--scrollbar-thumb-hover', isDark ? '#555' : '#aaa');
    }, [colors, isDark]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
