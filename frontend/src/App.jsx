import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { Layout } from '@components/layout';
import { HomePage, BlogPage, ArticlePage } from '@pages';
import {
  LoginPage,
  AdminLayout,
  DashboardPage,
  ArticlesListPage,
  ArticleEditorPage,
  ExperiencesPage,
  ProjectsPage,
  SkillsPage,
  SettingsPage,
} from '@pages/admin';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<ArticlePage />} />
          </Route>

          {/* Routes admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="articles" element={<ArticlesListPage />} />
            <Route path="articles/:id" element={<ArticleEditorPage />} />
            <Route path="experiences" element={<ExperiencesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="skills" element={<SkillsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={
            <div style={{
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#0a0a0a',
              fontFamily: '"IBM Plex Mono", monospace',
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ color: '#fff', fontSize: '48px', margin: 0 }}>404</h1>
                <p style={{ color: '#555', marginTop: '16px' }}>Page non trouvée</p>
                <a href="/" style={{ color: '#888', marginTop: '24px', display: 'inline-block' }}>
                  ← Retour à l'accueil
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
