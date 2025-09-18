import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../ProductCard';
import { useCart } from '../../contexts/CartContext';

// Mock the cart context
jest.mock('../../contexts/CartContext');
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'A test product description',
  price: 29.99,
  category_id: 1,
  category_name: 'Electronics',
  image_url: 'https://via.placeholder.com/300x300',
  stock_quantity: 10,
  is_featured: true,
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductCard', () => {
  const mockAddItem = jest.fn();

  beforeEach(() => {
    mockUseCart.mockReturnValue({
      addItem: mockAddItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn(),
      getTotalPrice: jest.fn(),
      getTotalItems: jest.fn(),
      items: [],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('A test product description')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('10 in stock')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('calls addItem when Add to Cart button is clicked', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);

    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('disables Add to Cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 };
    renderWithRouter(<ProductCard product={outOfStockProduct} />);

    const addToCartButton = screen.getByText('Out of Stock');
    expect(addToCartButton).toBeDisabled();
  });

  it('shows correct stock status', () => {
    const outOfStockProduct = { ...mockProduct, stock_quantity: 0 };
    renderWithRouter(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('renders product link correctly', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);

    const productLink = screen.getByRole('link');
    expect(productLink).toHaveAttribute('href', '/products/1');
  });

  it('does not show featured badge when product is not featured', () => {
    const nonFeaturedProduct = { ...mockProduct, is_featured: false };
    renderWithRouter(<ProductCard product={nonFeaturedProduct} />);

    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });
});
