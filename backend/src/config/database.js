import initSqlJs from 'sql.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Créer le dossier data s'il n'existe pas
const dataDir = join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || join(dataDir, 'portfolio.db');

let db = null;
let saveTimeout = null;

// Initialiser sql.js et charger/créer la base de données
export async function initDatabase() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Charger la base de données existante ou en créer une nouvelle
  if (fs.existsSync(dbPath)) {
    console.log(`📁 Chargement de la base de données: ${dbPath}`);
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    console.log(`📁 Création d'une nouvelle base de données: ${dbPath}`);
    db = new SQL.Database();
  }

  // Créer les tables
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      period TEXT NOT NULL,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      description TEXT,
      tech TEXT,
      is_current INTEGER DEFAULT 0,
      is_internship INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      tech TEXT,
      year TEXT,
      link TEXT,
      image_url TEXT,
      is_featured INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT,
      cover_image TEXT,
      tags TEXT,
      is_published INTEGER DEFAULT 0,
      published_at DATETIME,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      width INTEGER,
      height INTEGER,
      alt_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sauvegarder la base de données
  saveDatabase();

  console.log('✓ Base de données initialisée');
  return db;
}

// Sauvegarder la base de données sur disque
export function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
      console.log('💾 Base de données sauvegardée');
    } catch (error) {
      console.error('❌ Erreur de sauvegarde:', error);
    }
  }
}

// Sauvegarde différée (pour éviter trop d'écritures disque)
function scheduleSave() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  // Sauvegarder après 100ms d'inactivité
  saveTimeout = setTimeout(() => {
    saveDatabase();
    saveTimeout = null;
  }, 100);
}

// Sauvegarder à l'arrêt du processus
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  saveDatabase();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur...');
  saveDatabase();
  process.exit(0);
});

// Obtenir l'instance de la base de données
export function getDb() {
  if (!db) {
    throw new Error('Base de données non initialisée. Appelez initDatabase() d\'abord.');
  }
  return db;
}

// Helper pour exécuter une requête SELECT et récupérer tous les résultats
export function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper pour exécuter une requête SELECT et récupérer un seul résultat
export function queryOne(sql, params = []) {
  const results = queryAll(sql, params);
  return results[0] || null;
}

// Helper pour exécuter une requête INSERT/UPDATE/DELETE
export function execute(sql, params = []) {
  try {
    db.run(sql, params);
    
    // Récupérer le dernier ID inséré
    const lastIdResult = db.exec("SELECT last_insert_rowid() as id");
    const lastId = lastIdResult[0]?.values[0]?.[0] || null;
    
    // Sauvegarder immédiatement (important pour la persistance)
    saveDatabase();
    
    return {
      lastInsertRowid: lastId,
      changes: db.getRowsModified(),
    };
  } catch (error) {
    console.error('❌ Erreur SQL:', error.message);
    console.error('   Requête:', sql);
    console.error('   Params:', params);
    throw error;
  }
}

export default {
  initDatabase,
  saveDatabase,
  getDb,
  queryAll,
  queryOne,
  execute,
};
