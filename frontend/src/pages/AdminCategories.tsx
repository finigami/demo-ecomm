import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminCategories.css';

const AdminCategories: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
  });
  const queryClient = useQueryClient();

  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminAPI.getCategories(),
  });

  const createCategoryMutation = useMutation({
    mutationFn: adminAPI.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      resetForm();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: number; category: any }) => 
      adminAPI.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      resetForm();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
      description: category.description,
      image_url: category.image_url,
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, category: formData });
    } else {
      createCategoryMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all products in this category.')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="admin-categories">
        <div className="container">
          <h1>Category Management</h1>
          <div className="error-message">
            Failed to load categories. Please check your admin privileges.
          </div>
        </div>
      </div>
    );
  }

  const categories = categoriesData?.data.categories || [];

  return (
    <div className="admin-categories">
      <div className="container">
        <div className="page-header">
          <h1>Category Management</h1>
          <div className="header-actions">
            <button
              onClick={() => setShowForm(!showForm)}
              className="add-button"
            >
              {showForm ? 'Cancel' : 'Add Category'}
            </button>
            <a href="/admin" className="back-link">← Back to Dashboard</a>
          </div>
        </div>

        {showForm && (
          <div className="category-form-container">
            <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit} className="category-form">
              <div className="form-group">
                <label htmlFor="name">Category Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-button">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button type="button" onClick={resetForm} className="cancel-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="categories-grid">
          {categories.map((category: any) => (
            <div key={category.id} className="category-card">
              <div className="category-image">
                <img src={category.image_url} alt={category.name} />
              </div>
              <div className="category-info">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="category-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="no-data">
            <p>No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
