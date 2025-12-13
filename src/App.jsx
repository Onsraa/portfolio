import { useState, useEffect } from 'react';
import data from './data/portfolioData.json';
import Cursor from './components/Cursor';
import TypedText from './components/TypedText';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';

const { config } = data;

export default function App() {
    const [loaded, setLoaded] = useState(false);
    const [activeSection, setActiveSection] = useState('experience');

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="portfolio-container">
            <header className="header">
                <div className="header-prompt text-extra-dark">
                    <TypedText text="~/portfolio $" delay={200} />
                </div>

                <h1 className="header-title">
                    <TypedText text={config.name} delay={600} />
                    <Cursor />
                </h1>

                <p
                    className="header-description"
                    style={{
                        opacity: loaded ? 1 : 0,
                        transform: loaded ? 'translateY(0)' : 'translateY(10px)',
                    }}
                >
                    {config.description}
                </p>

                <div className="header-links" style={{ opacity: loaded ? 1 : 0 }}>
                    <a href={config.links.github} target="_blank" rel="noopener noreferrer" className="header-link">
                        <span className="header-link-arrow">→</span> github
                    </a>
                    <a href={config.links.linkedin} target="_blank" rel="noopener noreferrer" className="header-link">
                        <span className="header-link-arrow">→</span> linkedin
                    </a>
                    <a href={config.links.email} className="header-link">
                        <span className="header-link-arrow">→</span> email
                    </a>
                    <a href={config.links.cv} target="_blank" rel="noopener noreferrer" className="header-link">
                        <span className="header-link-arrow">→</span> cv.pdf
                    </a>
                </div>
            </header>

            <nav className="nav">
                {['experience', 'projets'].map((section) => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`nav-button ${activeSection === section ? 'active' : ''}`}
                    >
                        {section}
                    </button>
                ))}
            </nav>

            <main className="main-content">
                {activeSection === 'experience' && <ExperienceSection loaded={loaded} />}
                {activeSection === 'projets' && <ProjectsSection loaded={loaded} />}
            </main>

            <footer className="footer">
                <span className="footer-text text-extra-dark">
                    © {new Date().getFullYear()} · {config.name}
                </span>
                <span className="footer-text text-extra-dark">
                    <span className="text-dark">last login:</span> {new Date().toLocaleDateString('fr-FR')}
                </span>
            </footer>
        </div>
    );
}