# Event & Venue Booking API

A REST API for managing event venues and bookings, built with Node.js, Express.js, and PostgreSQL.

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework for handling HTTP requests
- **PostgreSQL** — Relational database
- **JWT** — Authentication via JSON Web Tokens
- **bcryptjs** — Password hashing
- **express-validator** — Input validation

## Project Structure

```
src/
├── config/
│   └── database.js          # PostgreSQL connection pool
├── controllers/
│   ├── authController.js    # Register and login logic
│   ├── venueController.js   # Venue CRUD operations
│   └── bookingController.js # Booking CRUD operations
├── middleware/
│   ├── authMiddleware.js    # JWT token verification
│   ├── errorMiddleware.js   # Global error handler
│   └── validationMiddleware.js # Input validation error handler
├── routes/
│   ├── authRoutes.js        # POST /api/auth/register, /login
│   ├── venueRoutes.js       # /api/venues
│   └── bookingRoutes.js     # /api/bookings
├── utils/
│   └── asyncHandler.js      # Wraps async functions to catch errors
└── server.js                # App entry point
```

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL v14+

### Installation

1. Clone the repository

```bash
git clone https://github.com/NdatimanaAssa/VenueBooking.git
cd VenueBooking
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=venue_booking_db
DB_USER=postgres
DB_PASSWORD=yourpassword

JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

4. Create the database tables

Connect to your PostgreSQL database and run:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  price_per_hour NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  venue_id INT REFERENCES venues(id) ON DELETE CASCADE,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guests INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

5. Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server runs on `http://localhost:3000`

---

## API Endpoints

### Health Check

```
GET /health
```

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get token | No |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secret123"
}
```

Response:

```json
{
  "user": { "id": 1, "name": "John Doe", "email": "john@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Use the token in the `Authorization` header for protected routes:

```
Authorization: Bearer <your_token>
```

---

### Venues

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/venues | Get all venues | No |
| GET | /api/venues/:id | Get a single venue | No |
| POST | /api/venues | Create a venue | Yes |
| PUT | /api/venues/:id | Update a venue | Yes |
| DELETE | /api/venues/:id | Delete a venue | Yes |

#### Create a Venue

```http
POST /api/venues
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Grand Hall",
  "location": "New York",
  "capacity": 500,
  "price_per_hour": 300
}
```

---

### Bookings

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/bookings | Get all bookings | Yes |
| GET | /api/bookings/:id | Get a single booking | Yes |
| POST | /api/bookings | Create a booking | Yes |
| PUT | /api/bookings/:id | Update a booking | Yes (owner only) |
| DELETE | /api/bookings/:id | Delete a booking | Yes (owner only) |

#### Create a Booking

```http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "venue_id": 1,
  "event_date": "2025-12-01",
  "start_time": "10:00",
  "end_time": "14:00",
  "guests": 200
}
```

---

## Key Concepts

### Authentication Flow

1. User registers or logs in and receives a JWT token
2. Token is sent in the `Authorization: Bearer <token>` header on every protected request
3. The `protect` middleware verifies the token before the request reaches the controller

### Authorization

Bookings are protected at the ownership level. Only the user who created a booking can update or delete it. Any attempt by another user returns `403 Forbidden`.

### Error Handling

All errors are returned as JSON:

```json
{
  "message": "Venue not found",
  "stack": "..." 
}
```

The `stack` field is only included in `development` mode.

### Validation Errors

When invalid data is sent, all errors are returned at once:

```json
{
  "errors": [
    { "msg": "Venue name is required", "path": "name" },
    { "msg": "Capacity must be a positive number", "path": "capacity" }
  ]
}
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Port the server runs on | 3000 |
| NODE_ENV | Environment mode | development |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | venue_booking_db |
| DB_USER | Database user | postgres |
| DB_PASSWORD | Database password | yourpassword |
| JWT_SECRET | Secret key for signing tokens | changethis |
| JWT_EXPIRES_IN | Token expiry duration | 7d |
