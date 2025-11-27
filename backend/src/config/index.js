import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenvConfig({ path: join(__dirname, '../../.env') });

const config = {
  // Serveur
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
  
  // Upload
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10), // 5MB
    path: process.env.UPLOAD_PATH || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max requests per window
    loginMax: 5, // max login attempts
  },
  
  // Admin initial
  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
  },
};

// Validation de la configuration
if (config.jwt.secret === 'default-secret-change-me' && !config.isDevelopment) {
  console.error('⚠️  ATTENTION: JWT_SECRET doit être défini en production!');
  process.exit(1);
}

export default config;
