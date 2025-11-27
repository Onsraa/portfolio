import { Router } from 'express';
import { User } from '../models/index.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import { validate, loginSchema, changePasswordSchema } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

const router = Router();

// Rate limiting pour le login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.rateLimit.loginMax,
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  },
});

// POST /api/auth/login
router.post('/login', loginLimiter, validate(loginSchema), (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = User.findByUsername(username);
    
    if (!user || !User.verifyPassword(password, user.password)) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants incorrects',
      });
    }
    
    const token = generateToken(user);
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// GET /api/auth/me - Vérifier le token et obtenir l'utilisateur
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, validate(changePasswordSchema), (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = User.findById(req.user.id);
    const fullUser = User.findByUsername(user.username);
    
    if (!User.verifyPassword(currentPassword, fullUser.password)) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe actuel incorrect',
      });
    }
    
    User.updatePassword(req.user.id, newPassword);
    
    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès',
    });
  } catch (error) {
    console.error('Erreur de changement de mot de passe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
});

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', authenticate, (req, res) => {
  const token = generateToken(req.user);
  
  res.json({
    success: true,
    data: { token },
  });
});

export default router;
