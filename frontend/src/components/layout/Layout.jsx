import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { settingsApi } from '@config/api';

export default function Layout() {
    const [settings, setSettings] = useState({});
    const [loaded, setLoaded] = useState(false);
    const location = useLocation();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data } = await settingsApi.list();
            setSettings(data.settings);
        } catch (err) {
            console.error('Erreur chargement settings:', err);
        } finally {
            setLoaded(true);
        }
    };

    // Déterminer quel onglet est actif
    const getActiveTab = () => {
        if (location.pathname.startsWith('/blog')) return 'articles';
        if (location.hash === '#projets') return 'projets';
        return 'experience';
    };

    const activeTab = getActiveTab();

    const navButtonStyle = (isActive) => ({
        background: 'none',
        border: 'none',
        padding: '20px 24px',
        color: isActive ? '#fff' : '#444',
        fontSize: '13px',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        borderBottom: isActive ? '1px solid #fff' : '1px solid transparent',
        marginBottom: '-1px',
        transition: 'all 0.15s ease',
        cursor: 'pointer',
        textDecoration: 'none',
    });

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0a',
            color: '#e0e0e0',
            fontFamily: '"IBM Plex Mono", "SF Mono", "Fira Code", monospace',
            fontSize: '15px',
            lineHeight: 1.7,
        }}>
            <Header settings={settings} loaded={loaded} />

            {/* Navigation */}
            <nav style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '0 24px',
                borderBottom: '1px solid #1a1a1a',
                display: 'flex',
                gap: '0'
            }}>
                <Link to="/" style={navButtonStyle(activeTab === 'experience')}>
                    experience
                </Link>
                <Link to="/#projets" style={navButtonStyle(activeTab === 'projets')}>
                    projets
                </Link>
            <Link to="/blog" style={navButtonStyle(activeTab === 'articles')}>
                    articles
                </Link>
            </nav>

            <main style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '48px 24px 60px'
            }}>
                <Outlet context={{ settings, loaded }} />
            </main>
            <Footer siteName={settings.site_name} />
        </div>
    );
}