import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  fr: {
        introduction: "Grimpeur, joueur, développeur. J'essaye encore de comprendre comment marche les lifetimes en Rust.",
        experience: 'Expérience',
        projects: 'Projets',
        articles: 'Articles',
        posts: 'postes',
        years: 'ans',
        entries: 'entries',
        now: 'NOW',
        present: 'présent',
        internship: 'STAGE',
        apprenticeship: 'ALTERNANCE',
        date: 'date',
        views: 'vues',
        backToArticles: 'Retour aux articles',
        viewAllArticles: 'Voir tous les articles',
        articleNotFound: 'Article non trouvé',
        articleNotFoundDesc: "L'article que vous recherchez n'existe pas ou a été supprimé.",
        noArticles: 'Aucun article publié pour le moment.',
        skills: 'compétences',
        catSkills: '$ cat skills.md',
        languages: 'Langages',
        crates: 'Crates',
        softwares: 'Softwares',
        notTranslated: 'FR uniquement',
        lastLogin: 'last login',
    },
    en: {
        introduction: "Climber, gamer, developer. Still trying to understand how lifetimes work in Rust.",
        experience: 'Experience',
        projects: 'Projects',
        articles: 'Articles',
        posts: 'positions',
        years: 'years',
        entries: 'entries',
        now: 'NOW',
        present: 'present',
        internship: 'INTERNSHIP',
        apprenticeship: 'APPRENTICESHIP',
        date: 'date',
        views: 'views',
        backToArticles: 'Back to articles',
        viewAllArticles: 'View all articles',
        articleNotFound: 'Article not found',
        articleNotFoundDesc: 'The article you are looking for does not exist or has been deleted.',
        noArticles: 'No articles published yet.',
        skills: 'skills',
        catSkills: '$ cat skills.md',
        languages: 'Languages',
        crates: 'Crates',
        softwares: 'Softwares',
        notTranslated: 'EN only',
        lastLogin: 'last login',
    },
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('language');
        return saved || 'fr';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
    };

    const t = translations[language];

    const getLocalized = (obj, field) => {
        if (!obj) return { value: '', needsTranslation: false };

        const localizedField = `${field}_${language}`;
        const fallbackField = `${field}_${language === 'fr' ? 'en' : 'fr'}`;

        if (obj[localizedField] && obj[localizedField].trim() !== '') {
            return { value: obj[localizedField], needsTranslation: false };
        }

        if (obj[field] && typeof obj[field] === 'string') {
            return { value: obj[field], needsTranslation: false };
        }

        if (obj[fallbackField] && obj[fallbackField].trim() !== '') {
            return { value: obj[fallbackField], needsTranslation: true };
        }

        return { value: '', needsTranslation: false };
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, getLocalized }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
}
