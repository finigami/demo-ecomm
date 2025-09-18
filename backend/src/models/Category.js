const pool = require('../config/database');

class Category {
  static async create({ name, description, image_url }) {
    const query = `
      INSERT INTO categories (name, description, image_url, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;
    const values = [name, description, image_url];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll() {
    const query = 'SELECT * FROM categories ORDER BY name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, { name, description, image_url }) {
    const query = `
      UPDATE categories 
      SET name = $1, description = $2, image_url = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    const values = [name, description, image_url, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Category;
