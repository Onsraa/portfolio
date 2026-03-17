import { useOutletContext } from 'react-router-dom';
import { SectionHeader } from '@components/ui';
import { ArticleCard } from '@components/sections';
import { useTheme } from '@context/ThemeContext';
import { useLanguage } from '@context/LanguageContext';
import data from '../data/portfolioData.json';

const { articles } = data;

export default function BlogPage() {
    const { loaded } = useOutletContext();
    const { colors } = useTheme();
    const { t } = useLanguage();

    return (
        <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease'
        }}>
            <SectionHeader
                title={t.articles}
                count={`${articles.length} ${t.entries}`}
            />

            {articles.length === 0 ? (
                <p style={{ color: colors.textMuted, marginTop: '24px' }}>
                    {t.noArticles}
                </p>
            ) : (
                <div>
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}
