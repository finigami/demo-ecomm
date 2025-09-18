import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../services/api';
import './CategoryCard.css';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/products?category=${category.id}`} className="category-card">
      <div className="category-image">
        <img src={category.image_url} alt={category.name} />
      </div>
      <div className="category-info">
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;
