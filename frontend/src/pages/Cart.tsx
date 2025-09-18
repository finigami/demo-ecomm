import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Shopping Cart</h1>
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="shop-button">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart ({getTotalItems()} items)</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image_url} alt={item.product.name} />
                </div>
                
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-price">${Number(item.product.price).toFixed(2)}</p>
                  <p className="item-category">{item.product.category_name}</p>
                </div>
                
                <div className="item-quantity">
                  <label htmlFor={`quantity-${item.product.id}`}>Qty:</label>
                  <select
                    id={`quantity-${item.product.id}`}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                    className="quantity-select"
                  >
                    {Array.from({ length: Math.min(10, item.product.stock_quantity) }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="item-total">
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="remove-button"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>${Number(getTotalPrice()).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${Number(getTotalPrice()).toFixed(2)}</span>
            </div>
            
            <div className="cart-actions">
              <button onClick={clearCart} className="clear-cart-button">
                Clear Cart
              </button>
              <Link to="/checkout" className="checkout-button">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
