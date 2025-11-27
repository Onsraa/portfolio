import { queryAll, queryOne, execute } from '../config/database.js';

const Experience = {
  // Créer une expérience
  create({ period, company, role, description, tech = [], is_current = false, is_internship = false }) {
    const maxOrder = queryOne('SELECT MAX(sort_order) as max FROM experiences');
    const sortOrder = (maxOrder?.max || 0) + 1;
    
    const result = execute(
      `INSERT INTO experiences (period, company, role, description, tech, is_current, is_internship, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [period, company, role, description || null, JSON.stringify(tech), is_current ? 1 : 0, is_internship ? 1 : 0, sortOrder]
    );
    return this.findById(result.lastInsertRowid);
  },

  // Trouver par ID
  findById(id) {
    const exp = queryOne('SELECT * FROM experiences WHERE id = ?', [id]);
    return exp ? this.parseExperience(exp) : null;
  },

  // Liste toutes les expériences
  findAll() {
    const experiences = queryAll('SELECT * FROM experiences ORDER BY sort_order ASC');
    return experiences.map(this.parseExperience);
  },

  // Mettre à jour une expérience
  update(id, data) {
    const fields = [];
    const values = [];
    
    ['period', 'company', 'role', 'description'].forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });
    
    if (data.tech !== undefined) {
      fields.push('tech = ?');
      values.push(JSON.stringify(data.tech));
    }
    if (data.is_current !== undefined) {
      fields.push('is_current = ?');
      values.push(data.is_current ? 1 : 0);
    }
    if (data.is_internship !== undefined) {
      fields.push('is_internship = ?');
      values.push(data.is_internship ? 1 : 0);
    }
    if (data.sort_order !== undefined) {
      fields.push('sort_order = ?');
      values.push(data.sort_order);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    execute(`UPDATE experiences SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Supprimer une expérience
  delete(id) {
    return execute('DELETE FROM experiences WHERE id = ?', [id]);
  },

  // Réorganiser l'ordre
  reorder(orderedIds) {
    orderedIds.forEach((id, index) => {
      execute('UPDATE experiences SET sort_order = ? WHERE id = ?', [index, id]);
    });
    return this.findAll();
  },

  // Parser les champs JSON
  parseExperience(exp) {
    return {
      ...exp,
      tech: JSON.parse(exp.tech || '[]'),
      is_current: Boolean(exp.is_current),
      is_internship: Boolean(exp.is_internship),
    };
  },
};

export default Experience;
