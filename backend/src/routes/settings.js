import { Router } from 'express';
import { Settings } from '../models/index.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/settings - Obtenir tous les paramètres (public)
router.get('/', (req, res) => {
  try {
    const settings = Settings.getAll();
    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error('Erreur lecture paramètres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/settings/:key - Obtenir un paramètre spécifique
router.get('/:key', (req, res) => {
  try {
    const value = Settings.get(req.params.key);
    
    if (value === null) {
      return res.status(404).json({
        success: false,
        error: 'Paramètre non trouvé',
      });
    }
    
    res.json({
      success: true,
      data: { key: req.params.key, value },
    });
  } catch (error) {
    console.error('Erreur lecture paramètre:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/settings - Mettre à jour plusieurs paramètres (admin)
router.put('/', authenticate, (req, res) => {
  try {
    const settings = Settings.setMany(req.body);
    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error('Erreur mise à jour paramètres:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// PUT /api/settings/:key - Mettre à jour un paramètre (admin)
router.put('/:key', authenticate, (req, res) => {
  try {
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Valeur requise',
      });
    }
    
    const newValue = Settings.set(req.params.key, value);
    res.json({
      success: true,
      data: { key: req.params.key, value: newValue },
    });
  } catch (error) {
    console.error('Erreur mise à jour paramètre:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// DELETE /api/settings/:key - Supprimer un paramètre (admin)
router.delete('/:key', authenticate, (req, res) => {
  try {
    Settings.delete(req.params.key);
    res.json({
      success: true,
      message: 'Paramètre supprimé',
    });
  } catch (error) {
    console.error('Erreur suppression paramètre:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
