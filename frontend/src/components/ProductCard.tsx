import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../services/api';
import { useCart } from '../contexts/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image_url} alt={product.name} />
          {product.is_featured && (
            <div className="featured-badge">Featured</div>
          )}
        </div>
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="product-description">{product.description}</p>
          <div className="product-price">${Number(product.price).toFixed(2)}</div>
          <div className="product-stock">
            {product.stock_quantity > 0 ? (
              <span className="in-stock">{product.stock_quantity} in stock</span>
            ) : (
              <span className="out-of-stock">Out of stock</span>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0}
        className="add-to-cart-button"
      >
        {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;
