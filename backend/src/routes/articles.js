import { Router } from 'express';
import { Article } from '../models/index.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';
import { validate, articleSchema } from '../middleware/validation.js';

const router = Router();

// GET /api/articles - Liste des articles (public: publiés uniquement)
router.get('/', optionalAuth, (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const isAdmin = req.user?.role === 'admin';
    
    const result = Article.findAll({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      publishedOnly: !isAdmin,
    });
    
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erreur liste articles:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/articles/:slug - Détail d'un article
router.get('/:slug', optionalAuth, (req, res) => {
  try {
    const article = Article.findBySlug(req.params.slug);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }
    
    // Seuls les admins peuvent voir les articles non publiés
    const isAdmin = req.user?.role === 'admin';
    if (!article.is_published && !isAdmin) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }
    
    // Incrémenter les vues (seulement pour les visiteurs)
    if (!isAdmin) {
      Article.incrementViews(article.id);
    }
    
    res.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Erreur détail article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/articles - Créer un article (admin)
router.post('/', authenticate, validate(articleSchema), (req, res) => {
  try {
    const article = Article.create(req.body);
    
    res.status(201).json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Erreur création article:', error);
    
    // Gestion des erreurs de contrainte unique
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({
        success: false,
        error: 'Un article avec ce slug existe déjà. Essayez un slug différent.',
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de l\'article',
    });
  }
});

// PUT /api/articles/:id - Mettre à jour un article (admin)
router.put('/:id', authenticate, validate(articleSchema), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Article.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }
    
    const article = Article.update(id, req.body);
    
    res.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// DELETE /api/articles/:id - Supprimer un article (admin)
router.delete('/:id', authenticate, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Article.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }
    
    Article.delete(id);
    
    res.json({
      success: true,
      message: 'Article supprimé',
    });
  } catch (error) {
    console.error('Erreur suppression article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PATCH /api/articles/:id/publish - Publier/dépublier un article (admin)
router.patch('/:id/publish', authenticate, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { is_published } = req.body;
    
    const existing = Article.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
      });
    }
    
    const article = Article.update(id, { is_published });
    
    res.json({
      success: true,
      data: { article },
    });
  } catch (error) {
    console.error('Erreur publication article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
