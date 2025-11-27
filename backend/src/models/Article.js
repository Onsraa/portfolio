import { queryAll, queryOne, execute } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const Article = {
  // Créer un article
  create({ title, slug, excerpt, content, cover_image, tags = [], is_published = false }) {
    // Générer un slug unique si non fourni ou si le slug fourni existe déjà
    let finalSlug = slug ? this.sanitizeSlug(slug) : this.generateSlug(title);
    
    // Vérifier si le slug existe déjà et en générer un unique si nécessaire
    if (this.slugExists(finalSlug)) {
      finalSlug = `${finalSlug}-${Date.now().toString(36)}`;
    }
    
    const publishedAt = is_published ? new Date().toISOString() : null;
    
    const result = execute(
      `INSERT INTO articles (slug, title, excerpt, content, cover_image, tags, is_published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalSlug,
        title,
        excerpt || null,
        JSON.stringify(content || []),
        cover_image || null,
        JSON.stringify(tags),
        is_published ? 1 : 0,
        publishedAt
      ]
    );
    return this.findById(result.lastInsertRowid);
  },

  // Vérifier si un slug existe
  slugExists(slug) {
    const existing = queryOne('SELECT id FROM articles WHERE slug = ?', [slug]);
    return existing !== null;
  },

  // Sanitizer un slug
  sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  },

  // Générer un slug unique à partir du titre
  generateSlug(title) {
    const baseSlug = this.sanitizeSlug(title);
    
    // Toujours ajouter un identifiant unique court
    const uniqueId = Date.now().toString(36);
    return `${baseSlug}-${uniqueId}`;
  },

  // Trouver par ID
  findById(id) {
    const article = queryOne('SELECT * FROM articles WHERE id = ?', [id]);
    return article ? this.parseArticle(article) : null;
  },

  // Trouver par slug
  findBySlug(slug) {
    const article = queryOne('SELECT * FROM articles WHERE slug = ?', [slug]);
    return article ? this.parseArticle(article) : null;
  },

  // Liste tous les articles (avec pagination)
  findAll({ page = 1, limit = 10, publishedOnly = false } = {}) {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (publishedOnly) {
      whereClause = 'WHERE is_published = 1';
    }
    
    const articles = queryAll(
      `SELECT * FROM articles ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    const countResult = queryOne(`SELECT COUNT(*) as total FROM articles ${whereClause}`);
    const total = countResult ? countResult.total : 0;
    
    return {
      articles: articles.map(this.parseArticle),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  // Mettre à jour un article
  update(id, data) {
    const fields = [];
    const values = [];
    
    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.slug !== undefined) {
      fields.push('slug = ?');
      values.push(data.slug);
    }
    if (data.excerpt !== undefined) {
      fields.push('excerpt = ?');
      values.push(data.excerpt);
    }
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(JSON.stringify(data.content));
    }
    if (data.cover_image !== undefined) {
      fields.push('cover_image = ?');
      values.push(data.cover_image);
    }
    if (data.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(data.tags));
    }
    if (data.is_published !== undefined) {
      fields.push('is_published = ?');
      values.push(data.is_published ? 1 : 0);
      
      if (data.is_published) {
        // Vérifier si published_at est déjà défini
        const existing = this.findById(id);
        if (!existing.published_at) {
          fields.push('published_at = ?');
          values.push(new Date().toISOString());
        }
      }
    }
    
    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    execute(`UPDATE articles SET ${fields.join(', ')} WHERE id = ?`, values);
    
    return this.findById(id);
  },

  // Supprimer un article
  delete(id) {
    return execute('DELETE FROM articles WHERE id = ?', [id]);
  },

  // Incrémenter les vues
  incrementViews(id) {
    return execute('UPDATE articles SET views = views + 1 WHERE id = ?', [id]);
  },

  // Parser les champs JSON
  parseArticle(article) {
    return {
      ...article,
      content: JSON.parse(article.content || '[]'),
      tags: JSON.parse(article.tags || '[]'),
      is_published: Boolean(article.is_published),
    };
  },
};

export default Article;
