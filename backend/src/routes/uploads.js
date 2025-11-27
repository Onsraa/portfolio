import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { upload, processImage, deleteImage, listImages } from '../middleware/upload.js';

const router = Router();

// GET /api/uploads - Liste des images (admin)
router.get('/', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = listImages({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Erreur liste images:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/uploads - Upload une image (admin)
router.post('/', authenticate, upload.single('image'), processImage, (req, res) => {
  if (!req.uploadedImage) {
    return res.status(400).json({
      success: false,
      error: 'Aucune image fournie',
    });
  }
  
  res.status(201).json({
    success: true,
    data: { image: req.uploadedImage },
  });
});

// DELETE /api/uploads/:filename - Supprimer une image (admin)
router.delete('/:filename', authenticate, (req, res) => {
  try {
    deleteImage(req.params.filename);
    res.json({
      success: true,
      message: 'Image supprimée',
    });
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

export default router;
