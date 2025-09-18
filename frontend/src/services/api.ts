import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_name?: string;
  image_url: string;
  stock_quantity: number;
  is_featured: boolean;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  shipping_address: string;
  status: string;
  items: OrderItem[];
  created_at: string;
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  
  getCurrentUser: () => api.get('/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params?: {
    category_id?: number;
    search?: string;
    featured_only?: boolean;
    page?: number;
    limit?: number;
  }) => api.get('/products', { params }),
  
  getById: (id: number) => api.get(`/products/${id}`),
  
  create: (product: Partial<Product>) => api.post('/products', product),
  
  update: (id: number, product: Partial<Product>) => api.put(`/products/${id}`, product),
  
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  
  getById: (id: number) => api.get(`/categories/${id}`),
  
  create: (category: Partial<Category>) => api.post('/categories', category),
  
  update: (id: number, category: Partial<Category>) => api.put(`/categories/${id}`, category),
  
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (order: {
    items: OrderItem[];
    total_amount: number;
    shipping_address: string;
  }) => api.post('/orders', order),
  
  getMyOrders: () => api.get('/orders/my-orders'),
  
  getById: (id: number) => api.get(`/orders/${id}`),
  
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
  
  getAll: () => api.get('/orders'),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  
  // User management
  getUsers: () => api.get('/admin/users'),
  updateUserRole: (id: number, role: string) => api.put(`/admin/users/${id}/role`, { role }),
  
  // Product management
  getProducts: () => api.get('/admin/products'),
  createProduct: (product: Partial<Product>) => api.post('/admin/products', product),
  updateProduct: (id: number, product: Partial<Product>) => api.put(`/admin/products/${id}`, product),
  deleteProduct: (id: number) => api.delete(`/admin/products/${id}`),
  
  // Category management
  getCategories: () => api.get('/admin/categories'),
  createCategory: (category: Partial<Category>) => api.post('/admin/categories', category),
  updateCategory: (id: number, category: Partial<Category>) => api.put(`/admin/categories/${id}`, category),
  deleteCategory: (id: number) => api.delete(`/admin/categories/${id}`),
};

export default api;
