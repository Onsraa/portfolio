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
        padding: '6px 0',
        color: isActive ? colors.accent : colors.textDarker,
        fontSize: '14px',
        fontFamily: 'inherit',
        transition: 'color 0.15s ease',
        textDecoration: 'none',
    });
    // a terminal caret marks the open tab; it keeps its width on the others so nothing moves when switching
    const caret = (isActive) => <span aria-hidden="true" style={{ color: colors.accent, marginRight: '8px', visibility: isActive ? 'visible' : 'hidden' }}>&gt;</span>;

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
                padding: '0 24px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0 clamp(20px, 5vw, 36px)'
            }}>
                <Link to="/" role="tab" aria-selected={activeTab === 'experience'} style={navButtonStyle(activeTab === 'experience')}>
                    {caret(activeTab === 'experience')}{t.experience.toLowerCase()}
                </Link>
                <Link to="/projects" role="tab" aria-selected={activeTab === 'projects'} style={navButtonStyle(activeTab === 'projects')}>
                    {caret(activeTab === 'projects')}{t.projects.toLowerCase()}
                </Link>
                {data.articles.length > 0 && (
                    <Link to="/articles" role="tab" aria-selected={activeTab === 'articles'} style={navButtonStyle(activeTab === 'articles')}>
                        {caret(activeTab === 'articles')}{t.articles.toLowerCase()}
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
