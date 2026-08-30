const pool = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

const getAllBookings = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT bookings.*, users.name AS user_name, venues.name AS venue_name
     FROM bookings
     JOIN users ON bookings.user_id = users.id
     JOIN venues ON bookings.venue_id = venues.id
     ORDER BY bookings.id ASC`
  );
  res.json(result.rows);
});

const getBookingById = asyncHandler(async (req, res) => {
  const result = await pool.query(
    `SELECT bookings.*, users.name AS user_name, venues.name AS venue_name
     FROM bookings
     JOIN users ON bookings.user_id = users.id
     JOIN venues ON bookings.venue_id = venues.id
     WHERE bookings.id = $1`,
    [req.params.id]
  );
  if (result.rows.length === 0) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.json(result.rows[0]);
});

const createBooking = asyncHandler(async (req, res) => {
  const { venue_id, event_date, start_time, end_time, guests } = req.body;

  const venueCheck = await pool.query('SELECT id FROM venues WHERE id = $1', [venue_id]);
  if (venueCheck.rows.length === 0) {
    res.status(404);
    throw new Error('Venue not found');
  }

  const result = await pool.query(
    `INSERT INTO bookings (user_id, venue_id, event_date, start_time, end_time, guests)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.user.id, venue_id, event_date, start_time, end_time, guests]
  );
  res.status(201).json(result.rows[0]);
});

const updateBooking = asyncHandler(async (req, res) => {
  const booking = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
  if (booking.rows.length === 0) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only allow the person who created this booking to update it
  if (booking.rows[0].user_id !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  const { event_date, start_time, end_time, guests } = req.body;
  const result = await pool.query(
    `UPDATE bookings SET event_date = $1, start_time = $2, end_time = $3, guests = $4
     WHERE id = $5 RETURNING *`,
    [event_date, start_time, end_time, guests, req.params.id]
  );
  res.json(result.rows[0]);
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
  if (booking.rows.length === 0) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only allow the person who created this booking to delete it
  if (booking.rows[0].user_id !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this booking');
  }

  await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
  res.json({ message: 'Booking deleted successfully' });
});

module.exports = { getAllBookings, getBookingById, createBooking, updateBooking, deleteBooking };
