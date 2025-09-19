import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ecommerce app', () => {
  render(<App />);
  const brandElement = screen.getByText('Ecommerce Testbench');
  expect(brandElement).toBeInTheDocument();
  
  const productsLink = screen.getByText('Products');
  expect(productsLink).toBeInTheDocument();
  
  const cartLink = screen.getByText(/Cart/);
  expect(cartLink).toBeInTheDocument();
});
