import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesApi, experiencesApi, projectsApi } from '@config/api';

function StatCard({ title, value, icon, link }) {
  return (
    <Link
      to={link}
      style={{
        display: 'block',
        padding: '24px',
        background: '#0d0d0d',
        border: '1px solid #1a1a1a',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}>
        <div>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: '#555',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {title}
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '32px',
            color: '#fff',
            fontWeight: 300,
          }}>
            {value}
          </p>
        </div>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    articles: 0,
    experiences: 0,
    projects: 0,
    publishedArticles: 0,
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [articlesRes, experiencesRes, projectsRes] = await Promise.all([
        articlesApi.list({ limit: 5 }),
        experiencesApi.list(),
        projectsApi.list(),
      ]);

      const articles = articlesRes.data.articles;
      const publishedCount = articles.filter(a => a.is_published).length;

      setStats({
        articles: articlesRes.data.pagination?.total || articles.length,
        experiences: experiencesRes.data.experiences.length,
        projects: projectsRes.data.projects.length,
        publishedArticles: publishedCount,
      });

      setRecentArticles(articles.slice(0, 5));
    } catch (err) {
      console.error('Erreur chargement stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 400,
          color: '#fff',
        }}>
          Dashboard
        </h1>
        <p style={{
          margin: '8px 0 0 0',
          color: '#555',
          fontSize: '14px',
        }}>
          Bienvenue dans l'administration de votre portfolio.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '48px',
      }}>
        <StatCard
          title="Articles"
          value={stats.articles}
          icon="📝"
          link="/admin/articles"
        />
        <StatCard
          title="Expériences"
          value={stats.experiences}
          icon="💼"
          link="/admin/experiences"
        />
        <StatCard
          title="Projets"
          value={stats.projects}
          icon="🚀"
          link="/admin/projects"
        />
        <StatCard
          title="Publiés"
          value={stats.publishedArticles}
          icon="✓"
          link="/admin/articles"
        />
      </div>

      {/* Actions rapides */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Actions rapides
        </h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/admin/articles/new"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            + Nouvel article
          </Link>
          <Link
            to="/admin/projects"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            + Nouveau projet
          </Link>
          <Link
            to="/"
            target="_blank"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #333',
              color: '#888',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            ↗ Voir le site
          </Link>
        </div>
      </div>

      {/* Articles récents */}
      <div>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          fontWeight: 400,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Articles récents
        </h2>
        
        {recentArticles.length === 0 ? (
          <p style={{ color: '#555', fontSize: '14px' }}>
            Aucun article pour le moment.{' '}
            <Link to="/admin/articles/new" style={{ color: '#888' }}>
              Créer votre premier article
            </Link>
          </p>
        ) : (
          <div style={{
            border: '1px solid #1a1a1a',
            background: '#0d0d0d',
          }}>
            {recentArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/admin/articles/${article.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < recentArticles.length - 1 ? '1px solid #1a1a1a' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div>
                  <span style={{ color: '#ccc', fontSize: '14px' }}>
                    {article.title}
                  </span>
                  <span style={{
                    marginLeft: '12px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    background: article.is_published ? '#1a2a1a' : '#2a2a1a',
                    color: article.is_published ? '#5a8a5a' : '#8a8a5a',
                  }}>
                    {article.is_published ? 'publié' : 'brouillon'}
                  </span>
                </div>
                <span style={{ color: '#444', fontSize: '12px' }}>
                  {article.views || 0} vues
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
