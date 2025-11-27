import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import config from './config/index.js';
import { initDatabase } from './config/database.js';
import routes from './routes/index.js';
import { Settings } from './models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function startServer() {
  // Initialiser la base de données
  await initDatabase();

  // Initialiser les paramètres par défaut
  Settings.initDefaults();

  const app = express();

  // Middleware de sécurité
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS
  app.use(cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Rate limiting global
  app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      error: 'Trop de requêtes. Réessayez plus tard.',
    },
  }));

  // Parser JSON
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Servir les fichiers statiques (uploads)
  app.use('/uploads', express.static(join(__dirname, '../uploads')));

  // Routes API
  app.use('/api', routes);

  // Route 404
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route non trouvée',
    });
  });

  // Gestion des erreurs globale
  app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    
    // Erreur Multer (upload)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux',
      });
    }
    
    res.status(err.status || 500).json({
      success: false,
      error: config.isDevelopment ? err.message : 'Erreur serveur',
    });
  });

  // Démarrer le serveur
  app.listen(config.port, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   🚀 Serveur Portfolio démarré                           ║
║                                                          ║
║   URL:  http://localhost:${config.port}                        ║
║   Mode: ${config.nodeEnv.padEnd(12)}                           ║
║   API:  http://localhost:${config.port}/api                    ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(console.error);
