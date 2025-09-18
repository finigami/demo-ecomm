import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI, productsAPI } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const Home: React.FC = () => {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesAPI.getAll(),
  });

  const { data: featuredProductsData, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsAPI.getAll({ featured_only: true, limit: 8 }),
  });

  if (categoriesLoading || productsLoading) {
    return <LoadingSpinner />;
  }

  const categories = categoriesData?.data.categories || [];
  const featuredProducts = featuredProductsData?.data.products || [];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Ecommerce Testbench</h1>
          <p>Discover amazing products and shop with confidence</p>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products-section">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
