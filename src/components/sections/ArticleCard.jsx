import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import { TranslationBadge } from '@components/ui';

export default function ArticleCard({ article }) {
    const [hovered, setHovered] = useState(false);
    const { colors } = useTheme();
    const { language, getLocalized } = useLanguage();

    const title = getLocalized(article, 'title');
    const excerpt = getLocalized(article, 'excerpt');

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <Link
            to={`/articles/${article.slug}`}
            style={{
                display: 'block',
                padding: '22px 0',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
                // the highlight reaches a little left of the row and moves nothing
                background: hovered ? `linear-gradient(90deg, ${colors.bgHover} 0%, transparent 100%)` : 'transparent',
                boxShadow: hovered ? `-16px 0 0 0 ${colors.bgHover}` : 'none',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '8px',
                flexWrap: 'wrap',
                gap: '8px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '17px',
                    fontWeight: 400,
                    color: hovered ? colors.accent : colors.text,
                    transition: 'color 0.15s ease'
                }}>
                    {title.value}
                    <TranslationBadge show={title.needsTranslation} />
                </h3>
                <span style={{ color: colors.textDarker, fontSize: '12px' }}>
                    {formatDate(article.published_at || article.created_at)}
                </span>
            </div>

            {excerpt.value && (
                <p style={{
                    margin: '0 0 12px 0',
                    color: colors.textDark,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    maxWidth: '640px'
                }}>
                    {excerpt.value}
                    <TranslationBadge show={excerpt.needsTranslation} />
                </p>
            )}

            {article.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {article.tags.map((tag, i) => (
                        <span
                            key={i}
                            style={{
                                color: colors.textDark,
                                fontSize: '11px',
                                padding: '2px 8px',
                                border: `1px solid ${colors.borderLight}`,
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
