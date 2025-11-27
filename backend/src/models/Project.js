import { queryAll, queryOne, execute } from '../config/database.js';

const Project = {
  // Créer un projet
  create({ project_id, title, description, tech = [], year, link, image_url, is_featured = false }) {
    const maxOrder = queryOne('SELECT MAX(sort_order) as max FROM projects');
    const sortOrder = (maxOrder?.max || 0) + 1;
    
    const result = execute(
      `INSERT INTO projects (project_id, title, description, tech, year, link, image_url, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, title, description || null, JSON.stringify(tech), year || null, link || null, image_url || null, is_featured ? 1 : 0, sortOrder]
    );
    return this.findById(result.lastInsertRowid);
  },

  // Trouver par ID
  findById(id) {
    const project = queryOne('SELECT * FROM projects WHERE id = ?', [id]);
    return project ? this.parseProject(project) : null;
  },

  // Trouver par project_id
  findByProjectId(projectId) {
    const project = queryOne('SELECT * FROM projects WHERE project_id = ?', [projectId]);
    return project ? this.parseProject(project) : null;
  },

  // Liste tous les projets
  findAll({ featuredOnly = false } = {}) {
    let query = 'SELECT * FROM projects';
    if (featuredOnly) {
      query += ' WHERE is_featured = 1';
    }
    query += ' ORDER BY sort_order ASC';
    
    const projects = queryAll(query);
    return projects.map(this.parseProject);
  },

  // Mettre à jour un projet
  update(id, data) {
    const fields = [];
    const values = [];
    
    ['project_id', 'title', 'description', 'year', 'link', 'image_url'].forEach(field => {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    });
    
    if (data.tech !== undefined) {
      fields.push('tech = ?');
      values.push(JSON.stringify(data.tech));
    }
    if (data.is_featured !== undefined) {
      fields.push('is_featured = ?');
      values.push(data.is_featured ? 1 : 0);
    }
    if (data.sort_order !== undefined) {
      fields.push('sort_order = ?');
      values.push(data.sort_order);
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    execute(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Supprimer un projet
  delete(id) {
    return execute('DELETE FROM projects WHERE id = ?', [id]);
  },

  // Réorganiser l'ordre
  reorder(orderedIds) {
    orderedIds.forEach((id, index) => {
      execute('UPDATE projects SET sort_order = ? WHERE id = ?', [index, id]);
    });
    return this.findAll();
  },

  // Générer le prochain project_id
  generateNextId() {
    const last = queryOne('SELECT project_id FROM projects ORDER BY project_id DESC LIMIT 1');
    if (!last) return '001';
    
    const num = parseInt(last.project_id, 10) + 1;
    return num.toString().padStart(3, '0');
  },

  // Parser les champs JSON
  parseProject(project) {
    return {
      ...project,
      tech: JSON.parse(project.tech || '[]'),
      is_featured: Boolean(project.is_featured),
    };
  },
};

export default Project;
