import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: productData, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(parseInt(id!)),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !productData) {
    return (
      <div className="error-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate('/products')} className="back-button">
          Back to Products
        </button>
      </div>
    );
  }

  const product = productData.data.product;

  const handleAddToCart = () => {
    addItem(product, quantity);
    navigate('/cart');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate('/products')} className="back-button">
          ← Back to Products
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img src={product.image_url} alt={product.name} className="product-image" />
            {product.is_featured && (
              <div className="featured-badge">Featured Product</div>
            )}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <p className="product-category">{product.category_name}</p>
            <p className="product-description">{product.description}</p>
            
            <div className="product-price">${Number(product.price).toFixed(2)}</div>
            
            <div className="product-stock">
              {product.stock_quantity > 0 ? (
                <span className="in-stock">{product.stock_quantity} in stock</span>
              ) : (
                <span className="out-of-stock">Out of stock</span>
              )}
            </div>

            {product.stock_quantity > 0 && (
              <div className="add-to-cart-section">
                <div className="quantity-selector">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-select"
                  >
                    {Array.from({ length: Math.min(10, product.stock_quantity) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button onClick={handleAddToCart} className="add-to-cart-button">
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
