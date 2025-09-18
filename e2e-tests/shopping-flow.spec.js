const { test, expect } = require('@playwright/test');

test.describe('Ecommerce Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:3000');
  });

  test('should complete full shopping flow', async ({ page }) => {
    // 1. Register a new user
    await page.click('text=Register');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to home page
    await page.waitForURL('http://localhost:3000/');

    // 2. Browse products
    await page.click('text=Products');
    await page.waitForSelector('.products-grid');

    // 3. Search for a product
    await page.fill('input[placeholder="Search products..."]', 'smartphone');
    await page.waitForSelector('.products-grid');

    // 4. Click on a product
    await page.click('.product-card:first-child');
    await page.waitForSelector('.product-detail-content');

    // 5. Add product to cart
    await page.click('text=Add to Cart');
    await page.waitForURL('**/cart');

    // 6. Verify cart has items
    await expect(page.locator('.cart-item')).toHaveCount(1);

    // 7. Proceed to checkout
    await page.click('text=Proceed to Checkout');
    await page.waitForURL('**/checkout');

    // 8. Fill checkout form
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="address"]', '123 Main St');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="state"]', 'NY');
    await page.fill('input[name="zipCode"]', '10001');
    await page.fill('input[name="country"]', 'USA');

    // 9. Place order
    await page.click('text=Place Order');
    await page.waitForURL('**/orders');

    // 10. Verify order was created
    await expect(page.locator('.order-card')).toHaveCount(1);
    await expect(page.locator('text=Order #')).toBeVisible();
  });

  test('should handle login flow', async ({ page }) => {
    // Click login
    await page.click('text=Login');
    await page.waitForURL('**/login');

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL('http://localhost:3000/');

    // Verify user is logged in
    await expect(page.locator('text=Hello, testuser!')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    // Navigate to products page
    await page.click('text=Products');
    await page.waitForSelector('.products-grid');

    // Click on Electronics category
    await page.click('text=Electronics');
    await page.waitForSelector('.products-grid');

    // Verify products are filtered
    const productCards = page.locator('.product-card');
    await expect(productCards).toHaveCount.greaterThan(0);
  });

  test('should update cart quantities', async ({ page }) => {
    // Login first
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/');

    // Add product to cart
    await page.click('text=Products');
    await page.click('.product-card:first-child');
    await page.click('text=Add to Cart');

    // Update quantity in cart
    await page.selectOption('select', '3');
    
    // Verify quantity was updated
    await expect(page.locator('select')).toHaveValue('3');
  });
});
