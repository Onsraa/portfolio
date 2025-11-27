import { Router } from 'express';
import { Project } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { validate, projectSchema } from '../middleware/validation.js';

const router = Router();

// GET /api/projects - Liste des projets (public)
router.get('/', (req, res) => {
  try {
    const { featured } = req.query;
    const projects = Project.findAll({ featuredOnly: featured === 'true' });
    res.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error('Erreur liste projets:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/projects/next-id - Obtenir le prochain ID de projet
router.get('/next-id', authenticate, (req, res) => {
  try {
    const nextId = Project.generateNextId();
    res.json({
      success: true,
      data: { nextId },
    });
  } catch (error) {
    console.error('Erreur génération ID:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/projects/:id - Détail d'un projet
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const project = Project.findById(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé',
      });
    }
    
    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error('Erreur détail projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/projects - Créer un projet (admin)
router.post('/', authenticate, validate(projectSchema), (req, res) => {
  try {
    // Générer le project_id si non fourni
    if (!req.body.project_id) {
      req.body.project_id = Project.generateNextId();
    }
    
    const project = Project.create(req.body);
    res.status(201).json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/projects/:id - Mettre à jour un projet (admin)
router.put('/:id', authenticate, validate(projectSchema), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Project.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé',
      });
    }
    
    const project = Project.update(id, req.body);
    res.json({
      success: true,
      data: { project },
    });
  } catch (error) {
    console.error('Erreur mise à jour projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// DELETE /api/projects/:id - Supprimer un projet (admin)
router.delete('/:id', authenticate, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Project.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Projet non trouvé',
      });
    }
    
    Project.delete(id);
    res.json({
      success: true,
      message: 'Projet supprimé',
    });
  } catch (error) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/projects/reorder - Réorganiser les projets (admin)
router.post('/reorder', authenticate, (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        error: 'orderedIds doit être un tableau',
      });
    }
    
    const projects = Project.reorder(orderedIds);
    res.json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    console.error('Erreur réorganisation projets:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
