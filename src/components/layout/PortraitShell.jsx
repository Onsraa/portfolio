import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';
import data from '../../data/portfolioData.json';

const scrollPositions = new Map();

export default function PortraitShell({ children, variant = 'light' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef('');
  const dark = variant === 'dark';

  useEffect(() => {
    const record = () => scrollPositions.set(location.key, window.scrollY);
    window.addEventListener('scroll', record, { passive: true });
    return () => window.removeEventListener('scroll', record);
  }, [location.key]);

  useLayoutEffect(() => {
    setMenuOpen(false);
    if (!dark) document.title = 'Teddy Truong — An Unfinished Portrait';
    const withinLibrary = location.pathname.startsWith('/library') && previousPath.current.startsWith('/library');
    previousPath.current = location.pathname;
    if (withinLibrary || location.pathname.startsWith('/library/')) return;
    const frame = requestAnimationFrame(() => {
      if (navigationType === 'POP' && scrollPositions.has(location.key)) window.scrollTo({ top: scrollPositions.get(location.key), behavior: 'instant' });
      else if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash, location.key, navigationType, dark]);

  return (
    <div className={`portrait-site ${dark ? 'portrait-site--dark' : ''}`}>
      <a className="portrait-skip" href="#main-content">Skip to content</a>
      <header className="portrait-header">
        <Link className="portrait-brand" to="/" aria-label="Teddy Truong — home">
          <span className="portrait-monogram" aria-hidden="true">tt.</span>
          <span>TEDDY TRUONG<span className="brand-caption">A PERSONAL COLLECTION</span></span>
        </Link>
        <button className="portrait-menu-toggle" aria-expanded={menuOpen} aria-controls="portrait-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'}</button>
        <nav id="portrait-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Main navigation">
          <Link to="/#portrait" aria-current={!dark && !location.hash ? 'page' : undefined}>The portrait</Link>
          <Link to="/#work">Selected work</Link>
          <Link to="/library" aria-current={dark ? 'page' : undefined}>The reading room <span aria-hidden="true">↗</span></Link>
        </nav>
        <a className="portrait-contact" href={data.config.links.email}>Let’s talk <span aria-hidden="true">↗</span></a>
      </header>
      {children}
      <footer className="portrait-footer" id="contact">
        <div><span className="eyebrow">THE NEXT CHAPTER</span><a className="footer-invitation" href={data.config.links.email}>Still becoming.<br /><em>Let’s make something.</em> <span aria-hidden="true">↗</span></a></div>
        <div className="footer-bottom"><Link to="/" className="footer-signature">Teddy Truong</Link><span>AN UNFINISHED PORTRAIT, ALWAYS.</span><div><a href={data.config.links.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={data.config.links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="/cv.pdf" target="_blank" rel="noreferrer">Résumé ↗</a></div></div>
      </footer>
    </div>
  );
}
