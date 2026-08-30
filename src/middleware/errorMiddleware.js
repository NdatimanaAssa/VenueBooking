// Express recognizes this as an error handler because it has 4 parameters (err, req, res, next)
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  console.error(err.message);

  res.status(statusCode).json({
    message: err.message,
    // Show the full error stack in development only
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
};

module.exports = { errorHandler, notFound };
