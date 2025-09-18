import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Orders.css';

const Orders: React.FC = () => {
  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => ordersAPI.getMyOrders(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="error-message">
            Failed to load orders. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  const orders = ordersData?.data.orders || [];

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <h1>My Orders</h1>
          <div className="empty-orders">
            <h2>No orders found</h2>
            <p>You haven't placed any orders yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>
        
        <div className="orders-list">
          {orders.map((order: any) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="order-items">
                <h4>Items:</h4>
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.product_name}</span>
                      <span className="item-quantity">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">${Number(item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <strong>Total: ${Number(order.total_amount).toFixed(2)}</strong>
                </div>
                <div className="shipping-address">
                  <strong>Shipping to:</strong>
                  <pre>{order.shipping_address}</pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
