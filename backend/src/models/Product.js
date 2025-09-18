const pool = require('../config/database');

class Product {
  static async create({ name, description, price, category_id, image_url, stock_quantity, is_featured = false }) {
    const query = `
      INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_featured, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    const values = [name, description, price, category_id, image_url, stock_quantity, is_featured];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getAll({ category_id, search, featured_only = false, limit = 20, offset = 0 } = {}) {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 0;

    if (category_id) {
      paramCount++;
      query += ` AND p.category_id = $${paramCount}`;
      values.push(category_id);
    }

    if (search) {
      paramCount++;
      query += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount})`;
      values.push(`%${search}%`);
    }

    if (featured_only) {
      query += ` AND p.is_featured = true`;
    }

    query += ` ORDER BY p.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, { name, description, price, category_id, image_url, stock_quantity, is_featured }) {
    const query = `
      UPDATE products 
      SET name = $1, description = $2, price = $3, category_id = $4, 
          image_url = $5, stock_quantity = $6, is_featured = $7, updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `;
    const values = [name, description, price, category_id, image_url, stock_quantity, is_featured, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStock(id, quantity) {
    const query = `
      UPDATE products 
      SET stock_quantity = stock_quantity - $1, updated_at = NOW()
      WHERE id = $2 AND stock_quantity >= $1
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, id]);
    return result.rows[0];
  }
}

module.exports = Product;
