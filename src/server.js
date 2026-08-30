require('dotenv').config();
const express = require('express');
const venueRoutes = require('./routes/venueRoutes');

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/venues', venueRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
