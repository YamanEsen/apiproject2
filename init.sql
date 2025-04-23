-- Create necessary tables for the flight management system

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights table
CREATE TABLE IF NOT EXISTS flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) NOT NULL UNIQUE,
    date_from TIMESTAMP NOT NULL,
    date_to TIMESTAMP NOT NULL,
    airport_from VARCHAR(50) NOT NULL,
    airport_to VARCHAR(50) NOT NULL,
    duration INTEGER NOT NULL, -- Duration in minutes
    capacity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Passengers table
CREATE TABLE IF NOT EXISTS passengers (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id),
    passenger_name VARCHAR(255) NOT NULL,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    checked_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seat assignments table
CREATE TABLE IF NOT EXISTS seat_assignments (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id),
    passenger_name VARCHAR(255) NOT NULL,
    seat_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(flight_id, seat_number)
);

-- Create a test user with bcrypt hashed password ('password123')
INSERT INTO users (username, password, email) 
VALUES ('admin', '$2a$10$TsxS/Wq4vLs2u7KM/X56nuYqkGkwB9k8pTKL4l9g7wL27z0MpdnlG', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Create some sample flights
INSERT INTO flights (flight_number, date_from, date_to, airport_from, airport_to, duration, capacity)
VALUES 
('AA123', '2025-05-01 08:00:00', '2025-05-01 10:30:00', 'JFK', 'LAX', 150, 200),
('AA456', '2025-05-02 09:00:00', '2025-05-02 12:00:00', 'LAX', 'JFK', 180, 180),
('AA789', '2025-05-03 14:00:00', '2025-05-03 16:00:00', 'ORD', 'DFW', 120, 150)
ON CONFLICT (flight_number) DO NOTHING;