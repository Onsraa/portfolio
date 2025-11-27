import { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Loading } from '@components/ui';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '◉' },
  { path: '/admin/articles', label: 'Articles', icon: '📝' },
  { path: '/admin/experiences', label: 'Expériences', icon: '💼' },
  { path: '/admin/projects', label: 'Projets', icon: '🚀' },
  { path: '/admin/skills', label: 'Compétences', icon: '⚡' },
  { path: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <Loading message="Chargement..." />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: '"IBM Plex Mono", monospace',
      display: 'flex',
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px',
        borderRight: '1px solid #1a1a1a',
        padding: '24px 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        background: '#0a0a0a',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 24px 24px',
          borderBottom: '1px solid #1a1a1a',
        }}>
          <Link to="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 400,
          }}>
            <span style={{ color: '#444' }}>&gt;_</span> admin
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '24px 0',
          overflowY: 'auto',
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 24px',
                  color: isActive ? '#fff' : '#666',
                  textDecoration: 'none',
                  fontSize: '13px',
                  background: isActive ? '#111' : 'transparent',
                  borderLeft: isActive ? '2px solid #fff' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div style={{
          padding: '24px',
          borderTop: '1px solid #1a1a1a',
        }}>
          <div style={{
            marginBottom: '16px',
            fontSize: '12px',
            color: '#555',
          }}>
            <span style={{ color: '#333' }}>user:</span> {user?.username}
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: 'transparent',
              border: '1px solid #333',
              color: '#666',
              fontSize: '12px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: '240px',
        padding: '32px 48px',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  );
}
