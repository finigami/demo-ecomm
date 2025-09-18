const auth = require('./auth');

const admin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    await auth(req, res, () => {});
    
    // Then check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required.' });
  }
};

module.exports = admin;
