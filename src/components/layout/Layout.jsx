import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import data from '../../data/portfolioData.json';

export default function Layout() {
    const [loaded, setLoaded] = useState(false);
    const location = useLocation();
    const { colors } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        setLoaded(true);
    }, []);

    const getActiveTab = () => {
        if (location.pathname.startsWith('/articles')) return 'articles';
        if (location.pathname.startsWith('/projects')) return 'projects';
        return 'experience';
    };

    const activeTab = getActiveTab();

    const navButtonStyle = (isActive) => ({
        background: 'none',
        border: 'none',
        padding: 'clamp(12px, 3vw, 20px) clamp(10px, 3vw, 24px)',
        color: isActive ? colors.accent : colors.textDarker,
        fontSize: 'clamp(11px, 2.5vw, 13px)',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: 'clamp(0.03em, 1vw, 0.1em)',
        borderBottom: isActive ? `1px solid ${colors.accent}` : '1px solid transparent',
        marginBottom: '-1px',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        textDecoration: 'none',
    });

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: colors.bg,
            color: colors.text,
            fontFamily: '"IBM Plex Mono", "SF Mono", "Fira Code", monospace',
            fontSize: '15px',
            lineHeight: 1.7,
        }}>
            <Header loaded={loaded} />

            <nav role="tablist" style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 clamp(8px, 3vw, 24px)',
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex',
                gap: '0'
            }}>
                <Link to="/" role="tab" aria-selected={activeTab === 'experience'} style={navButtonStyle(activeTab === 'experience')}>
                    {t.experience}
                </Link>
                <Link to="/projects" role="tab" aria-selected={activeTab === 'projects'} style={navButtonStyle(activeTab === 'projects')}>
                    {t.projects}
                </Link>
                {data.articles.length > 0 && (
                    <Link to="/articles" role="tab" aria-selected={activeTab === 'articles'} style={navButtonStyle(activeTab === 'articles')}>
                        {t.articles}
                    </Link>
                )}
            </nav>

            <main id="main-content" style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '48px 24px 60px'
            }}>
                <Outlet context={{ loaded }} />
            </main>
            <Footer />
        </div>
    );
}
