import { Router } from 'express';
import { Experience } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';
import { validate, experienceSchema } from '../middleware/validation.js';

const router = Router();

// GET /api/experiences - Liste des expériences (public)
router.get('/', (req, res) => {
  try {
    const experiences = Experience.findAll();
    res.json({
      success: true,
      data: { experiences },
    });
  } catch (error) {
    console.error('Erreur liste expériences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/experiences - Créer une expérience (admin)
router.post('/', authenticate, validate(experienceSchema), (req, res) => {
  try {
    const experience = Experience.create(req.body);
    res.status(201).json({
      success: true,
      data: { experience },
    });
  } catch (error) {
    console.error('Erreur création expérience:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/experiences/:id - Mettre à jour une expérience (admin)
router.put('/:id', authenticate, validate(experienceSchema), (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Experience.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Expérience non trouvée',
      });
    }
    
    const experience = Experience.update(id, req.body);
    res.json({
      success: true,
      data: { experience },
    });
  } catch (error) {
    console.error('Erreur mise à jour expérience:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// DELETE /api/experiences/:id - Supprimer une expérience (admin)
router.delete('/:id', authenticate, (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const existing = Experience.findById(id);
    
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Expérience non trouvée',
      });
    }
    
    Experience.delete(id);
    res.json({
      success: true,
      message: 'Expérience supprimée',
    });
  } catch (error) {
    console.error('Erreur suppression expérience:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/experiences/reorder - Réorganiser les expériences (admin)
router.post('/reorder', authenticate, (req, res) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        error: 'orderedIds doit être un tableau',
      });
    }
    
    const experiences = Experience.reorder(orderedIds);
    res.json({
      success: true,
      data: { experiences },
    });
  } catch (error) {
    console.error('Erreur réorganisation expériences:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
