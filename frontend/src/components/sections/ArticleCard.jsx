import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ArticleCard({ article }) {
  const [hovered, setHovered] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/blog/${article.slug}`}
      style={{
        display: 'block',
        padding: '24px 0',
        borderBottom: '1px solid #222',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.15s ease',
        background: hovered ? '#111' : 'transparent',
        marginLeft: hovered ? '8px' : '0',
        paddingLeft: hovered ? '16px' : '0',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '17px',
          fontWeight: 400,
          color: hovered ? '#fff' : '#ccc',
          transition: 'color 0.15s ease'
        }}>
          {hovered && <span style={{ color: '#555' }}>→ </span>}
          {article.title}
        </h3>
        <span style={{ color: '#444', fontSize: '13px' }}>
          {formatDate(article.published_at || article.created_at)}
        </span>
      </div>

      {article.excerpt && (
        <p style={{
          margin: '0 0 16px 0',
          color: '#777',
          fontSize: '14px',
          lineHeight: 1.7,
          maxWidth: '640px'
        }}>
          {article.excerpt}
        </p>
      )}

      {article.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {article.tags.map((tag, i) => (
            <span
              key={i}
              style={{
                color: '#555',
                fontSize: '12px',
                padding: '3px 10px',
                border: '1px solid #2a2a2a',
                background: hovered ? '#1a1a1a' : 'transparent',
                transition: 'all 0.15s ease'
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
