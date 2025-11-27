import { queryAll, queryOne, execute } from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = {
  // Créer un utilisateur
  create({ username, email, password, role = 'admin' }) {
    const hashedPassword = bcrypt.hashSync(password, 12);
    const result = execute(
      `INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, role]
    );
    return this.findById(result.lastInsertRowid);
  },

  // Trouver par ID
  findById(id) {
    return queryOne(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
  },

  // Trouver par username
  findByUsername(username) {
    return queryOne('SELECT * FROM users WHERE username = ?', [username]);
  },

  // Trouver par email
  findByEmail(email) {
    return queryOne('SELECT * FROM users WHERE email = ?', [email]);
  },

  // Vérifier le mot de passe
  verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword);
  },

  // Mettre à jour le mot de passe
  updatePassword(id, newPassword) {
    const hashedPassword = bcrypt.hashSync(newPassword, 12);
    return execute(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, id]
    );
  },

  // Vérifier si un admin existe
  adminExists() {
    const result = queryOne('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    return result && result.count > 0;
  },

  // Compter les utilisateurs
  count() {
    const result = queryOne('SELECT COUNT(*) as count FROM users');
    return result ? result.count : 0;
  },
};

export default User;
