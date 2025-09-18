# Ecommerce Testbench

A full-stack ecommerce application built with React (TypeScript) frontend and Node.js backend, designed to demonstrate unit testing and end-to-end testing practices.

## Features

- **User Authentication**: Email/password based login and registration
- **Product Catalog**: Browse products by category with search functionality
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout Flow**: Complete order placement (no payment integration)
- **Order Management**: View order history and status
- **Responsive Design**: Mobile-friendly interface
- **Comprehensive Testing**: Unit tests for both frontend and backend

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcryptjs for password hashing
- Jest for unit testing
- Supertest for API testing

### Frontend
- React with TypeScript
- React Router for navigation
- TanStack Query for data fetching
- Context API for state management
- Jest and React Testing Library for unit testing

## Project Structure

```
ecommerce-testbench/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Category.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   ├── categories.js
│   │   │   └── orders.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── __tests__/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   └── server.js
│   ├── database/
│   │   └── setup.sql
│   ├── package.json
│   └── env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Products.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Cart.tsx
│   │   │   ├── Checkout.tsx
│   │   │   └── Orders.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── CartContext.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   └── App.tsx
│   ├── package.json
│   └── public/
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup

1. Install PostgreSQL and create a database:
```
brew services start postgresql
```
```sql
CREATE DATABASE ecommerce_testbench;
```

2. Run the setup script:
```bash
psql -U postgres -d ecommerce_testbench -f backend/database/setup.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update the `.env` file with your database credentials:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_testbench
DB_USER=postgres
DB_PASSWORD=your_password
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Running Both Together

From the root directory:
```bash
npm run dev
```

This will start both backend and frontend concurrently.

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Run All Tests

From the root directory:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)

## Sample Data

The database setup script includes sample data:
- 5 categories (Electronics, Clothing, Home & Garden, Sports, Books)
- 12 products across different categories
- 1 test user (email: test@example.com, password: password123)

## Testing Strategy

### Unit Tests
- **Backend**: Models, routes, and middleware functions
- **Frontend**: React components and utility functions

### Integration Tests
- API endpoint testing with database interactions
- Component integration with context providers

### End-to-End Tests
- Complete user workflows (registration, login, shopping, checkout)
- Cross-browser compatibility testing

## Development Notes

- The application uses JWT tokens for authentication
- Passwords are hashed using bcryptjs
- All API responses follow a consistent format
- Error handling is implemented throughout the application
- The frontend uses React Query for efficient data fetching and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License
