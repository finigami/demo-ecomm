# Test Credentials

This file contains test credentials for development and testing purposes only.

## Database Test Users

### Regular User
- **Username**: testuser
- **Email**: test@example.com
- **Password**: password123
- **Role**: user

### Admin User
- **Username**: admin
- **Email**: admin@testbench.local
- **Password**: password123
- **Role**: admin

## Usage

These credentials are automatically created when you run the database setup script:

```bash
./setup-database.sh
```

## Security Note

⚠️ **These are test credentials only!** 
- Never use these in production
- Change all passwords in production environments
- This file should be added to .gitignore in production deployments

## Environment Variables

For the backend, create a `.env` file in the `backend/` directory with your actual database credentials:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_testbench
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

For the frontend, create a `.env` file in the `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```
