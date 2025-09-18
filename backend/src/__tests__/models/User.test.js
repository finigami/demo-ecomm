const User = require('../../models/User');
const pool = require('../../config/database');

// Mock the database pool
jest.mock('../../config/database', () => ({
  query: jest.fn()
}));

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
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

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining(['testuser', 'test@example.com', expect.any(String)])
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashedpassword'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findByEmail('test@example.com');

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = $1',
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('should return undefined if user not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const result = await User.findByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z'
      };

      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      const result = await User.findById(1);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [1]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const password = 'password123';
      const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

      const result = await User.validatePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const password = 'wrongpassword';
      const hashedPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

      const result = await User.validatePassword(password, hashedPassword);

      expect(result).toBe(false);
    });
  });
});
