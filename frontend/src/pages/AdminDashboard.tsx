import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading, error } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <div className="error-message">
            Failed to load dashboard data. Please check your admin privileges.
          </div>
        </div>
      </div>
    );
  }

  const stats = statsData?.data.stats || {};

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <div className="stat-number">{stats.totalUsers || 0}</div>
          </div>
          
          <div className="stat-card">
            <h3>Admin Users</h3>
            <div className="stat-number">{stats.adminUsers || 0}</div>
          </div>
          
          <div className="stat-card">
            <h3>Total Products</h3>
            <div className="stat-number">{stats.totalProducts || 0}</div>
          </div>
          
          <div className="stat-card">
            <h3>Total Categories</h3>
            <div className="stat-number">{stats.totalCategories || 0}</div>
          </div>
        </div>

        <div className="admin-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <a href="/admin/users" className="action-button">
              <span className="action-icon">👥</span>
              Manage Users
            </a>
            <a href="/admin/products" className="action-button">
              <span className="action-icon">📦</span>
              Manage Products
            </a>
            <a href="/admin/categories" className="action-button">
              <span className="action-icon">📂</span>
              Manage Categories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
