import { Router } from 'express';
import authRoutes from './auth.js';
import articlesRoutes from './articles.js';
import experiencesRoutes from './experiences.js';
import projectsRoutes from './projects.js';
import skillsRoutes from './skills.js';
import settingsRoutes from './settings.js';
import uploadsRoutes from './uploads.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Monter les routes
router.use('/auth', authRoutes);
router.use('/articles', articlesRoutes);
router.use('/experiences', experiencesRoutes);
router.use('/projects', projectsRoutes);
router.use('/skills', skillsRoutes);
router.use('/settings', settingsRoutes);
router.use('/uploads', uploadsRoutes);

export default router;
