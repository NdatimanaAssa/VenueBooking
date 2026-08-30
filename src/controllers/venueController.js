const pool = require('../config/database');

const getAllVenues = async (req, res) => {
  const result = await pool.query('SELECT * FROM venues ORDER BY id ASC');
  res.json(result.rows);
};

const getVenueById = async (req, res) => {
  const result = await pool.query('SELECT * FROM venues WHERE id = $1', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Venue not found' });
  }
  res.json(result.rows[0]);
};

const createVenue = async (req, res) => {
  const { name, location, capacity, price_per_hour } = req.body;
  const result = await pool.query(
    'INSERT INTO venues (name, location, capacity, price_per_hour) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, location, capacity, price_per_hour]
  );
  res.status(201).json(result.rows[0]);
};

const updateVenue = async (req, res) => {
  const { name, location, capacity, price_per_hour } = req.body;
  const result = await pool.query(
    'UPDATE venues SET name = $1, location = $2, capacity = $3, price_per_hour = $4 WHERE id = $5 RETURNING *',
    [name, location, capacity, price_per_hour, req.params.id]
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Venue not found' });
  }
  res.json(result.rows[0]);
};

const deleteVenue = async (req, res) => {
  const result = await pool.query('DELETE FROM venues WHERE id = $1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Venue not found' });
  }
  res.json({ message: 'Venue deleted successfully' });
};

module.exports = { getAllVenues, getVenueById, createVenue, updateVenue, deleteVenue };
