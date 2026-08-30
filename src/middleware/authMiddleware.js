const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Attach the logged-in user to the request so controllers can access it
  const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);
  if (result.rows.length === 0) {
    res.status(401);
    throw new Error('Not authorized, user no longer exists');
  }

  req.user = result.rows[0];
  next();
});

module.exports = { protect };
