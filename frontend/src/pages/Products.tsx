import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Products.css';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  
  const categoryId = searchParams.get('category');
  const search = searchParams.get('search');

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products', categoryId, search, currentPage],
    queryFn: () => productsAPI.getAll({
      category_id: categoryId ? parseInt(categoryId) : undefined,
      search: search || undefined,
      page: currentPage,
      limit: 12,
    }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const handleCategoryFilter = (categoryId: string | null) => {
    setSearchParams(prev => {
      if (categoryId) {
        prev.set('category', categoryId);
      } else {
        prev.delete('category');
      }
      prev.delete('search');
      return prev;
    });
    setCurrentPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchParams(prev => {
      if (searchTerm) {
        prev.set('search', searchTerm);
      } else {
        prev.delete('search');
      }
      prev.delete('category');
      return prev;
    });
    setCurrentPage(1);
  };

  if (productsLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  const products = productsData?.data.products || [];
  const categories = categoriesData?.data.categories || [];

  return (
    <div className="products-page">
      <div className="container">
        <h1>Products</h1>
        
        <div className="filters">
          <div className="category-filters">
            <button
              className={`filter-button ${!categoryId ? 'active' : ''}`}
              onClick={() => handleCategoryFilter(null)}
            >
              All Categories
            </button>
            {categories.map((category: any) => (
              <button
                key={category.id}
                className={`filter-button ${categoryId === category.id.toString() ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category.id.toString())}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search products..."
              value={search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="page-info">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={products.length < 12}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
