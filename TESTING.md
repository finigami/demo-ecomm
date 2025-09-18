# Testing Guide

This document provides comprehensive information about testing the Ecommerce Testbench application.

## Testing Overview

The application includes three types of tests:
1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test API endpoints with database interactions
3. **End-to-End Tests** - Test complete user workflows

## Backend Testing

### Running Backend Tests

```bash
cd backend
npm test
```

### Test Structure

```
backend/src/__tests__/
├── models/
│   └── User.test.js
└── routes/
    └── auth.test.js
```

### Test Coverage

- **Models**: User creation, authentication, data validation
- **Routes**: API endpoint testing with mocked dependencies
- **Middleware**: Authentication and error handling

### Example Test

```javascript
describe('User Model', () => {
  it('should create a new user with hashed password', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      created_at: '2023-01-01T00:00:00Z'
    };

    pool.query.mockResolvedValueOnce({ rows: [mockUser] });
    const result = await User.create(userData);

    expect(result).toEqual(mockUser);
  });
});
```

## Frontend Testing

### Running Frontend Tests

```bash
cd frontend
npm test
```

### Test Structure

```
frontend/src/
├── components/__tests__/
│   └── ProductCard.test.tsx
└── pages/__tests__/
    └── Login.test.tsx
```

### Test Coverage

- **Components**: Rendering, user interactions, props handling
- **Pages**: Form submissions, navigation, error handling
- **Contexts**: State management and side effects

### Example Test

```typescript
describe('ProductCard', () => {
  it('calls addItem when Add to Cart button is clicked', () => {
    renderWithRouter(<ProductCard product={mockProduct} />);
    
    const addToCartButton = screen.getByText('Add to Cart');
    fireEvent.click(addToCartButton);
    
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct, 1);
  });
});
```

## End-to-End Testing

### Setup

1. Install Playwright:
```bash
cd e2e-tests
npm install
```

2. Install browsers:
```bash
npx playwright install
```

### Running E2E Tests

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run in headed mode
npm run test:headed

# Debug mode
npm run test:debug
```

### Test Scenarios

1. **Complete Shopping Flow**
   - User registration
   - Product browsing and search
   - Adding items to cart
   - Checkout process
   - Order confirmation

2. **Authentication Flow**
   - User login/logout
   - Protected routes
   - Session management

3. **Product Management**
   - Category filtering
   - Search functionality
   - Product details

### Example E2E Test

```javascript
test('should complete full shopping flow', async ({ page }) => {
  // Register user
  await page.click('text=Register');
  await page.fill('input[name="username"]', 'testuser');
  await page.fill('input[name="email"]', 'testuser@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.fill('input[name="confirmPassword"]', 'password123');
  await page.click('button[type="submit"]');

  // Browse products
  await page.click('text=Products');
  await page.waitForSelector('.products-grid');

  // Add to cart and checkout
  await page.click('.product-card:first-child');
  await page.click('text=Add to Cart');
  await page.click('text=Proceed to Checkout');

  // Complete checkout
  await page.fill('input[name="firstName"]', 'John');
  // ... fill other fields
  await page.click('text=Place Order');

  // Verify order
  await expect(page.locator('.order-card')).toHaveCount(1);
});
```

## Test Data

### Sample Users

- **Test User**: test@example.com / password123
- **Admin User**: admin@example.com / admin123

### Sample Products

- Electronics: Smartphone, Laptop, Headphones
- Clothing: T-Shirt, Jeans, Sneakers
- Home & Garden: Coffee Maker, Garden Tools
- Sports: Yoga Mat, Basketball
- Books: Programming Book, Cookbook

## Testing Best Practices

### Unit Tests

1. **Arrange-Act-Assert Pattern**
   ```javascript
   test('should validate email format', () => {
     // Arrange
     const invalidEmail = 'invalid-email';
     
     // Act
     const result = validateEmail(invalidEmail);
     
     // Assert
     expect(result).toBe(false);
   });
   ```

2. **Mock External Dependencies**
   ```javascript
   jest.mock('../config/database');
   ```

3. **Test Edge Cases**
   - Empty inputs
   - Invalid data
   - Error conditions

### Integration Tests

1. **Test Real Database Interactions**
2. **Verify Data Persistence**
3. **Test Transaction Rollbacks**

### E2E Tests

1. **Test Complete User Journeys**
2. **Verify Cross-Browser Compatibility**
3. **Test Responsive Design**

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Run frontend tests
        run: cd frontend && npm test
      
      - name: Run E2E tests
        run: cd e2e-tests && npm test
```

## Debugging Tests

### Backend Tests

```bash
# Run specific test file
npm test -- User.test.js

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Frontend Tests

```bash
# Run specific test file
npm test -- ProductCard.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"

# Run in watch mode
npm test -- --watch
```

### E2E Tests

```bash
# Run specific test
npx playwright test shopping-flow.spec.js

# Run with debug info
npx playwright test --debug

# Generate test report
npx playwright show-report
```

## Performance Testing

### Load Testing with Artillery

```bash
npm install -g artillery
artillery quick --count 10 --num 5 http://localhost:5000/api/products
```

### Frontend Performance

- Use React DevTools Profiler
- Monitor bundle size with webpack-bundle-analyzer
- Test with Lighthouse

## Security Testing

### Backend Security Tests

1. **Authentication Tests**
   - JWT token validation
   - Password hashing
   - Session management

2. **Authorization Tests**
   - Protected routes
   - Role-based access
   - Data isolation

3. **Input Validation Tests**
   - SQL injection prevention
   - XSS protection
   - CSRF protection

### Frontend Security Tests

1. **XSS Prevention**
2. **CSRF Protection**
3. **Secure Data Storage**

## Test Maintenance

### Keeping Tests Updated

1. **Update tests when features change**
2. **Remove obsolete tests**
3. **Refactor test code regularly**
4. **Monitor test performance**

### Test Documentation

1. **Document test scenarios**
2. **Explain complex test logic**
3. **Keep test data current**
4. **Update setup instructions**

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check PostgreSQL is running
   - Verify connection credentials
   - Ensure database exists

2. **Test Timeouts**
   - Increase timeout values
   - Check for async operations
   - Verify test data setup

3. **Mock Issues**
   - Clear mocks between tests
   - Verify mock implementations
   - Check mock scope

### Getting Help

1. Check test output for error messages
2. Review test logs and stack traces
3. Verify test environment setup
4. Consult framework documentation
