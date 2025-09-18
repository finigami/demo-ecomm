-- Create database (run this manually if needed)
-- CREATE DATABASE ecommerce_testbench;

-- Connect to the database and create tables
\c ecommerce_testbench;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Electronic devices and gadgets', 'https://via.placeholder.com/300x200?text=Electronics'),
('Clothing', 'Fashion and apparel', 'https://via.placeholder.com/300x200?text=Clothing'),
('Home & Garden', 'Home improvement and garden supplies', 'https://via.placeholder.com/300x200?text=Home+Garden'),
('Sports', 'Sports equipment and accessories', 'https://via.placeholder.com/300x200?text=Sports'),
('Books', 'Books and educational materials', 'https://via.placeholder.com/300x200?text=Books')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, is_featured) VALUES
('Smartphone', 'Latest model smartphone with advanced features', 699.99, 1, 'https://via.placeholder.com/300x300?text=Smartphone', 50, true),
('Laptop', 'High-performance laptop for work and gaming', 1299.99, 1, 'https://via.placeholder.com/300x300?text=Laptop', 25, true),
('Wireless Headphones', 'Noise-cancelling wireless headphones', 199.99, 1, 'https://via.placeholder.com/300x300?text=Headphones', 100, false),
('T-Shirt', 'Comfortable cotton t-shirt', 29.99, 2, 'https://via.placeholder.com/300x300?text=T-Shirt', 200, false),
('Jeans', 'Classic blue denim jeans', 79.99, 2, 'https://via.placeholder.com/300x300?text=Jeans', 150, true),
('Sneakers', 'Comfortable running sneakers', 129.99, 2, 'https://via.placeholder.com/300x300?text=Sneakers', 75, true),
('Coffee Maker', 'Automatic coffee maker with timer', 89.99, 3, 'https://via.placeholder.com/300x300?text=Coffee+Maker', 30, false),
('Garden Tools Set', 'Complete set of garden tools', 149.99, 3, 'https://via.placeholder.com/300x300?text=Garden+Tools', 20, false),
('Yoga Mat', 'Non-slip yoga mat', 39.99, 4, 'https://via.placeholder.com/300x300?text=Yoga+Mat', 60, false),
('Basketball', 'Official size basketball', 24.99, 4, 'https://via.placeholder.com/300x300?text=Basketball', 40, false),
('Programming Book', 'Learn JavaScript programming', 49.99, 5, 'https://via.placeholder.com/300x300?text=JS+Book', 100, true),
('Cookbook', 'Healthy recipes cookbook', 34.99, 5, 'https://via.placeholder.com/300x300?text=Cookbook', 80, false)
ON CONFLICT DO NOTHING;

-- Insert sample users (password is 'adminpass')
INSERT INTO users (username, email, password_hash, role) VALUES
('testuser', 'test@example.com', '$2a$10$/X4VYqlpal09rh15fKPFG.4GM8tZ8M9pMiwlpNBCWysee2HCReQH2', 'user'),
('admin', 'admin@testbench.local', '$2a$10$/X4VYqlpal09rh15fKPFG.4GM8tZ8M9pMiwlpNBCWysee2HCReQH2', 'admin')
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
