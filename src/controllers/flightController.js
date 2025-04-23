const { client } = require('../config/database');

// Add a new flight
const addFlight = async (req, res) => {
  const { dateFrom, dateTo, airportFrom, airportTo, duration, capacity } = req.body;

  if (!dateFrom || !dateTo || !airportFrom || !airportTo || !duration || !capacity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const flightNumber = `AA${Math.floor(Math.random() * 1000)}`;

    const result = await client.query(
      `INSERT INTO flights (flight_number, date_from, date_to, airport_from, airport_to, duration, capacity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [flightNumber, dateFrom, dateTo, airportFrom, airportTo, duration, capacity]
    );

    const newFlight = result.rows[0];
    res.status(201).json(newFlight);
  } catch (error) {
    console.error('Error inserting flight', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Query flights with pagination
const queryFlights = async (req, res) => {
  const { dateFrom, dateTo, airportFrom, airportTo, page = 1, limit = 10 } = req.query;

  if (!dateFrom || !dateTo || !airportFrom || !airportTo) {
    return res.status(400).json({ message: 'All query parameters are required' });
  }

  try {
    const offset = (page - 1) * limit;

    const result = await client.query(
      'SELECT * FROM flights WHERE date_from >= $1 AND date_to <= $2 AND airport_from = $3 AND airport_to = $4 LIMIT $5 OFFSET $6',
      [dateFrom, dateTo, airportFrom, airportTo, limit, offset]
    );

    const flights = result.rows;

    if (flights.length === 0) {
      return res.status(404).json({ message: 'No flights found' });
    }

    res.status(200).json(flights);
  } catch (error) {
    console.error('Error querying flights', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a list of passengers for a flight
const getFlightPassengers = async (req, res) => {
  const { flightId } = req.query;

  if (!flightId) {
    return res.status(400).json({ message: 'Flight ID is required' });
  }

  try {
    const result = await client.query(
      'SELECT passenger_name, ticket_number FROM passengers WHERE flight_id = $1',
      [flightId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No passengers found for this flight' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error querying passengers', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addFlight, queryFlights, getFlightPassengers };
