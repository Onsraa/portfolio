import { queryAll, queryOne, execute } from '../config/database.js';

const Skill = {
  // Créer une compétence
  create({ category, name }) {
    const maxOrder = queryOne('SELECT MAX(sort_order) as max FROM skills WHERE category = ?', [category]);
    const sortOrder = (maxOrder?.max || 0) + 1;
    
    const result = execute(
      'INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)',
      [category, name, sortOrder]
    );
    return this.findById(result.lastInsertRowid);
  },

  // Trouver par ID
  findById(id) {
    return queryOne('SELECT * FROM skills WHERE id = ?', [id]);
  },

  // Liste toutes les compétences par catégorie
  findAll() {
    const skills = queryAll('SELECT * FROM skills ORDER BY category, sort_order ASC');
    
    // Grouper par catégorie
    return skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill.name);
      return acc;
    }, {});
  },

  // Liste brute
  findAllRaw() {
    return queryAll('SELECT * FROM skills ORDER BY category, sort_order ASC');
  },

  // Mettre à jour une compétence
  update(id, { category, name, sort_order }) {
    const fields = [];
    const values = [];
    
    if (category !== undefined) {
      fields.push('category = ?');
      values.push(category);
    }
    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (sort_order !== undefined) {
      fields.push('sort_order = ?');
      values.push(sort_order);
    }
    
    values.push(id);
    
    execute(`UPDATE skills SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Supprimer une compétence
  delete(id) {
    return execute('DELETE FROM skills WHERE id = ?', [id]);
  },

  // Supprimer toutes les compétences d'une catégorie
  deleteByCategory(category) {
    return execute('DELETE FROM skills WHERE category = ?', [category]);
  },

  // Remplacer toutes les compétences d'une catégorie
  replaceCategory(category, names) {
    // Supprimer les anciennes
    execute('DELETE FROM skills WHERE category = ?', [category]);
    
    // Ajouter les nouvelles
    names.forEach((name, index) => {
      execute(
        'INSERT INTO skills (category, name, sort_order) VALUES (?, ?, ?)',
        [category, name, index]
      );
    });
    
    return this.findAll();
  },
};

export default Skill;
