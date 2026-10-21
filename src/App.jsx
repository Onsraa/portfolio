import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import PortraitShell from '@components/layout/PortraitShell';
import PortraitPage from '@pages/PortraitPage';
import BlogPage from '@pages/BlogPage';
import ArticlePage from '@pages/ArticlePage';
import './styles/portrait.css';
import './styles/tw.css';

const LibraryPage = lazy(() => import('./pages/LibraryPage'));

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<PortraitShell><PortraitPage /></PortraitShell>} />
            <Route path="/projects" element={<Navigate to="/#work" replace />} />
            <Route path="/library/:slug?" element={<PortraitShell variant="dark"><Suspense fallback={<main id="main-content" className="route-loading">Opening the reading room…</main>}><LibraryPage /></Suspense></PortraitShell>} />
            <Route element={<Layout />}>
                <Route path="articles" element={<BlogPage />} />
                <Route path="articles/:slug" element={<ArticlePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
