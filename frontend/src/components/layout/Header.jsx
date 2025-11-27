import { Link } from 'react-router-dom';
import { TypedText, Cursor } from '@components/ui';

export default function Header({ settings, loaded = true }) {
  return (
    <header style={{
      padding: '80px 24px 60px',
      maxWidth: '900px',
      margin: '0 auto',
      borderBottom: '1px solid #1a1a1a'
    }}>
      <div style={{
        color: '#333',
        fontSize: '13px',
        marginBottom: '24px',
        fontWeight: 300
      }}>
        <TypedText text="~/portfolio $" delay={200} />
      </div>

      <h1 style={{
        margin: '0 0 24px 0',
        fontSize: 'clamp(32px, 6vw, 48px)',
        fontWeight: 400,
        letterSpacing: '-0.02em',
        color: '#fff'
      }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          <TypedText text={settings?.site_name || 'Portfolio'} delay={600} />
        </Link>
        <span style={{ color: '#333' }}><Cursor /></span>
      </h1>

      <p style={{
        margin: 0,
        color: '#666',
        fontSize: '15px',
        maxWidth: '560px',
        lineHeight: 1.8,
        opacity: loaded ? 1 : 0,
        transform: loaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.6s ease 1.2s'
      }}>
        {settings?.site_description || ''}
      </p>

      <div style={{
        marginTop: '32px',
        display: 'flex',
        gap: '24px',
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.6s ease 1.5s',
        flexWrap: 'wrap'
      }}>
        {settings?.github_url && (
          <a href={settings.github_url} target="_blank" rel="noopener noreferrer"
             style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            <span style={{ color: '#333' }}>→</span> github
          </a>
        )}
        {settings?.linkedin_url && (
          <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer"
             style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            <span style={{ color: '#333' }}>→</span> linkedin
          </a>
        )}
        {settings?.email && (
          <a href={`mailto:${settings.email}`}
             style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            <span style={{ color: '#333' }}>→</span> email
          </a>
        )}
        {settings?.cv_url && (
          <a href={settings.cv_url} target="_blank" rel="noopener noreferrer"
             style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>
            <span style={{ color: '#333' }}>→</span> cv.pdf
          </a>
        )}
      </div>
    </header>
  );
}
