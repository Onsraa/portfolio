import { Router } from 'express';
import { Skill } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { validate, skillSchema, skillCategorySchema } from '../middleware/validation.js';

const router = Router();

// GET /api/skills - Liste des compétences (public)
router.get('/', (req, res) => {
  try {
    const skills = Skill.findAll();
    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    console.error('Erreur liste compétences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/skills/raw - Liste brute des compétences (admin)
router.get('/raw', authenticate, (req, res) => {
  try {
    const skills = Skill.findAllRaw();
    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    console.error('Erreur liste compétences brutes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/skills - Créer une compétence (admin)
router.post('/', authenticate, validate(skillSchema), (req, res) => {
  try {
    const skill = Skill.create(req.body);
    res.status(201).json({
      success: true,
      data: { skill },
    });
  } catch (error) {
    console.error('Erreur création compétence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/skills/category - Remplacer toute une catégorie (admin)
router.put('/category', authenticate, validate(skillCategorySchema), (req, res) => {
  try {
    const { category, names } = req.body;
    const skills = Skill.replaceCategory(category, names);
    res.json({
      success: true,
      data: { skills },
    });
  } catch (error) {
    console.error('Erreur remplacement catégorie:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/skills/:id - Mettre à jour une compétence (admin)
router.put('/:id', authenticate, validate(skillSchema), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Skill.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée',
      });
    }
    
    const skill = Skill.update(id, req.body);
    res.json({
      success: true,
      data: { skill },
    });
  } catch (error) {
    console.error('Erreur mise à jour compétence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// DELETE /api/skills/:id - Supprimer une compétence (admin)
router.delete('/:id', authenticate, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Skill.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Compétence non trouvée',
      });
    }
    
    Skill.delete(id);
    res.json({
      success: true,
      message: 'Compétence supprimée',
    });
  } catch (error) {
    console.error('Erreur suppression compétence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
