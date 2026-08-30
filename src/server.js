require('dotenv').config();
const express = require('express');
const venueRoutes = require('./routes/venueRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/venues', venueRoutes);

// Handle requests to routes that don't exist
app.use(notFound);

// Handle all errors thrown anywhere in the app
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
