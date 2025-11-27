import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { Input, Button, Cursor } from '@components/ui';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <span style={{ color: '#555' }}>Chargement...</span>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: '"IBM Plex Mono", monospace',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        <div style={{
          marginBottom: '48px',
          textAlign: 'center',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 400,
            color: '#fff',
          }}>
            admin<span style={{ color: '#333' }}><Cursor /></span>
          </h1>
          <p style={{
            margin: '16px 0 0 0',
            color: '#555',
            fontSize: '13px',
          }}>
            $ ssh admin@portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{
            padding: '32px',
            border: '1px solid #222',
            background: '#0d0d0d',
          }}>
            {error && (
              <div style={{
                marginBottom: '24px',
                padding: '12px 16px',
                background: '#1a1111',
                border: '1px solid #331111',
                color: '#aa4444',
                fontSize: '13px',
              }}>
                <span style={{ marginRight: '8px' }}>✗</span>
                {error}
              </div>
            )}

            <Input
              label="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />

            <Input
              label="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </div>
        </form>

        <p style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#333',
        }}>
          <a href="/" style={{ color: '#444', textDecoration: 'none' }}>
            ← Retour au portfolio
          </a>
        </p>
      </div>
    </div>
  );
}
