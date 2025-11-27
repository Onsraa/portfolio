import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/index.js';

// Vérifier le token JWT
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification manquant',
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Utilisateur non trouvé',
        });
      }
      
      req.user = user;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token expiré',
          code: 'TOKEN_EXPIRED',
        });
      }
      
      return res.status(401).json({
        success: false,
        error: 'Token invalide',
      });
    }
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur',
    });
  }
};

// Vérifier le rôle admin
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé - Droits administrateur requis',
    });
  }
  next();
};

// Générer un token JWT
export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.id, username: user.username, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch {
      // Token invalide, on continue sans utilisateur
    }
  }
  
  next();
};
