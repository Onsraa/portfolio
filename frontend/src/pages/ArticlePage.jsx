import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loading } from '@components/ui';
import { articlesApi } from '@config/api';

// Rendu des blocs de contenu
function ContentBlock({ block }) {
    switch (block.type) {
        case 'paragraph':
            return (
                <p style={{
                    margin: '0 0 24px 0',
                    color: '#bbb',
                    fontSize: '15px',
                    lineHeight: 1.8,
                }}>
                    {block.content}
                </p>
            );

        case 'heading':
            const Tag = `h${block.level || 2}`;
            const sizes = { 1: '28px', 2: '22px', 3: '18px', 4: '16px' };
            return (
                <Tag style={{
                    margin: '48px 0 16px 0',
                    color: '#fff',
                    fontSize: sizes[block.level] || '22px',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                }}>
          <span style={{ color: '#333', marginRight: '12px' }}>
            {'#'.repeat(block.level || 2)}
          </span>
                    {block.content}
                </Tag>
            );

        case 'code':
            return (
                <div style={{
                    margin: '24px 0',
                    background: '#111',
                    border: '1px solid #222',
                    borderRadius: '0',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        padding: '8px 16px',
                        background: '#0d0d0d',
                        borderBottom: '1px solid #222',
                        fontSize: '11px',
                        color: '#555',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}>
                        {block.language || 'code'}
                    </div>
                    <pre style={{
                        margin: 0,
                        padding: '16px',
                        overflow: 'auto',
                        fontSize: '13px',
                        lineHeight: 1.6,
                        color: '#aaa',
                    }}>
            <code>{block.content}</code>
          </pre>
                </div>
            );

        case 'quote':
            return (
                <blockquote style={{
                    margin: '32px 0',
                    padding: '16px 24px',
                    borderLeft: '2px solid #333',
                    color: '#888',
                    fontStyle: 'italic',
                    fontSize: '15px',
                    lineHeight: 1.7,
                }}>
                    {block.content}
                </blockquote>
            );

        case 'image':
            return (
                <figure style={{ margin: '32px 0' }}>
                    <img
                        src={block.url}
                        alt={block.alt || ''}
                        style={{
                            width: '100%',
                            height: 'auto',
                            border: '1px solid #222',
                        }}
                    />
                    {block.alt && (
                        <figcaption style={{
                            marginTop: '8px',
                            fontSize: '12px',
                            color: '#555',
                            textAlign: 'center',
                        }}>
                            {block.alt}
                        </figcaption>
                    )}
                </figure>
            );

        case 'list':
            const items = block.items?.filter(item => item && item.trim() !== '') || [];
            if (items.length === 0) return null;
            return (
                <ul style={{
                    margin: '24px 0',
                    paddingLeft: '24px',
                    color: '#bbb',
                    fontSize: '15px',
                    lineHeight: 1.8,
                }}>
                    {items.map((item, i) => (
                        <li key={i} style={{ marginBottom: '8px' }}>
                            <span style={{ color: '#444', marginRight: '8px' }}>→</span>
                            {item}
                        </li>
                    ))}
                </ul>
            );

        default:
            return null;
    }
}

export default function ArticlePage() {
    const { slug } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadArticle();
    }, [slug]);

    const loadArticle = async () => {
        try {
            const { data } = await articlesApi.get(slug);
            setArticle(data.article);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    if (loading) return <Loading />;

    if (error || !article) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 400 }}>
                    Article non trouvé
                </h1>
                <p style={{ color: '#666', marginTop: '16px' }}>
                    L'article que vous recherchez n'existe pas ou a été supprimé.
                </p>
                <Link
                    to="/blog"
                    style={{
                        display: 'inline-block',
                        marginTop: '24px',
                        color: '#888',
                        textDecoration: 'none',
                    }}
                >
                    <span style={{ color: '#444' }}>←</span> Retour aux articles
                </Link>
            </div>
        );
    }

    return (
        <article>
            {/* Header */}
            <header style={{ marginBottom: '48px' }}>
                <Link
                    to="/blog"
                    style={{
                        display: 'inline-block',
                        marginBottom: '32px',
                        color: '#555',
                        textDecoration: 'none',
                        fontSize: '13px',
                    }}
                >
                    <span style={{ marginRight: '8px' }}>←</span>
                    Retour aux articles
                </Link>

                <h1 style={{
                    margin: 0,
                    fontSize: 'clamp(28px, 5vw, 36px)',
                    fontWeight: 400,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                }}>
                    {article.title}
                </h1>

                <div style={{
                    marginTop: '24px',
                    display: 'flex',
                    gap: '24px',
                    flexWrap: 'wrap',
                    fontSize: '13px',
                    color: '#555',
                }}>
          <span>
            <span style={{ color: '#333' }}>date:</span>{' '}
              {formatDate(article.published_at || article.created_at)}
          </span>
                    <span>
            <span style={{ color: '#333' }}>views:</span> {article.views || 0}
          </span>
                </div>

                {article.tags?.length > 0 && (
                    <div style={{
                        marginTop: '16px',
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                    }}>
                        {article.tags.map((tag, i) => (
                            <span
                                key={i}
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '11px',
                                    color: '#666',
                                    border: '1px solid #222',
                                }}
                            >
                #{tag}
              </span>
                        ))}
                    </div>
                )}
            </header>

            {/* Cover image */}
            {article.cover_image && (
                <img
                    src={article.cover_image}
                    alt={article.title}
                    style={{
                        width: '100%',
                        height: 'auto',
                        marginBottom: '48px',
                        border: '1px solid #222',
                    }}
                />
            )}

            {/* Content */}
            <div style={{ marginBottom: '60px' }}>
                {article.content?.map((block, i) => (
                    <ContentBlock key={i} block={block} />
                ))}
            </div>

            {/* Footer */}
            <footer style={{
                paddingTop: '32px',
                borderTop: '1px solid #1a1a1a',
            }}>
                <Link
                    to="/blog"
                    style={{
                        color: '#666',
                        textDecoration: 'none',
                        fontSize: '14px',
                    }}
                >
                    <span style={{ color: '#444' }}>←</span> Voir tous les articles
                </Link>
            </footer>
        </article>
    );
}