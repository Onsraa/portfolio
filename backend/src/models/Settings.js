import { queryAll, queryOne, execute } from '../config/database.js';

const Settings = {
  // Obtenir une valeur
  get(key) {
    const result = queryOne('SELECT value FROM settings WHERE key = ?', [key]);
    if (!result) return null;
    
    try {
      return JSON.parse(result.value);
    } catch {
      return result.value;
    }
  },

  // Définir une valeur
  set(key, value) {
    const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // Upsert
    const existing = queryOne('SELECT key FROM settings WHERE key = ?', [key]);
    if (existing) {
      execute(
        'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
        [serialized, key]
      );
    } else {
      execute(
        'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
        [key, serialized]
      );
    }
    
    return this.get(key);
  },

  // Obtenir toutes les valeurs
  getAll() {
    const results = queryAll('SELECT key, value FROM settings');
    
    return results.reduce((acc, { key, value }) => {
      try {
        acc[key] = JSON.parse(value);
      } catch {
        acc[key] = value;
      }
      return acc;
    }, {});
  },

  // Définir plusieurs valeurs
  setMany(settings) {
    for (const [key, value] of Object.entries(settings)) {
      this.set(key, value);
    }
    return this.getAll();
  },

  // Supprimer une valeur
  delete(key) {
    return execute('DELETE FROM settings WHERE key = ?', [key]);
  },

  // Initialiser les valeurs par défaut
  initDefaults() {
    const defaults = {
      site_name: 'Teddy Truong',
      site_title: 'Développeur Rust',
      site_description: "Grimpeur, joueur, développeur. J'essaye encore de comprendre comment marche les lifetimes en Rust.",
      github_url: 'https://github.com/Onsraa',
      linkedin_url: 'https://linkedin.com/in/teddy-truong',
      email: 'teddytruong@protonmail.com',
      cv_url: '/cv.pdf',
    };
    
    const existingKeys = queryAll('SELECT key FROM settings').map(r => r.key);
    
    for (const [key, value] of Object.entries(defaults)) {
      if (!existingKeys.includes(key)) {
        this.set(key, value);
      }
    }
    
    return this.getAll();
  },
};

export default Settings;
