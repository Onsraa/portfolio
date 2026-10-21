import { Routes, Route } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import HomePage from '@pages/HomePage';
import BlogPage from '@pages/BlogPage';
import ArticlePage from '@pages/ArticlePage';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="projects" element={<HomePage section="projects" />} />
                <Route path="articles" element={<BlogPage />} />
                <Route path="articles/:slug" element={<ArticlePage />} />
            </Route>
        </Routes>
    );
}
