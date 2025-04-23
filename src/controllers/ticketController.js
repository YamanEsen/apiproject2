const { client } = require('../config/database');

// Buy tickets for a flight
const buyTicket = async (req, res) => {
  const { flightNumber, date, passengerNames } = req.body;

  if (!flightNumber || !date || !passengerNames || !Array.isArray(passengerNames) || passengerNames.length === 0) {
    return res.status(400).json({ message: 'Invalid input parameters' });
  }

  try {
    const flightResult = await client.query(
      'SELECT * FROM flights WHERE flight_number = $1 AND date_from = $2',
      [flightNumber, date]
    );

    const flight = flightResult.rows[0];
    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    // Get current passenger count
    const passengersResult = await client.query(
      'SELECT COUNT(*) as passenger_count FROM passengers WHERE flight_id = $1',
      [flight.id]
    );
    
    const currentPassengerCount = parseInt(passengersResult.rows[0].passenger_count);
    
    if (flight.capacity < currentPassengerCount + passengerNames.length) {
      return res.status(400).json({ message: 'Sold out - No available seats' });
    }

    const ticketNumbers = [];
    
    // Begin transaction
    await client.query('BEGIN');
    
    try {
      for (const passengerName of passengerNames) {
        const ticketNumber = `TICKET${Math.floor(Math.random() * 100000)}`;

        await client.query(
          'INSERT INTO passengers (flight_id, passenger_name, ticket_number) VALUES ($1, $2, $3)',
          [flight.id, passengerName, ticketNumber]
        );
        
        ticketNumbers.push(ticketNumber);
      }

      // Commit transaction
      await client.query('COMMIT');
      
      res.status(200).json({
        transactionStatus: 'success',
        ticketNumbers,
      });
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      throw err;
    }
  } catch (error) {
    console.error('Error processing the ticket purchase', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Check-in a passenger
const checkIn = async (req, res) => {
  const { ticketNumber, seatNumber } = req.body;

  if (!ticketNumber || !seatNumber) {
    return res.status(400).json({ message: 'Ticket number and seat number are required' });
  }

  try {
    const passengerResult = await client.query(
      'SELECT * FROM passengers WHERE ticket_number = $1',
      [ticketNumber]
    );

    const passenger = passengerResult.rows[0];

    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }

    // Check if seat is already taken
    const seatCheckResult = await client.query(
      'SELECT * FROM seat_assignments WHERE flight_id = $1 AND seat_number = $2',
      [passenger.flight_id, seatNumber]
    );

    if (seatCheckResult.rows.length > 0) {
      return res.status(400).json({ message: 'Seat is already taken' });
    }

    const seatAssignment = await client.query(
      'INSERT INTO seat_assignments (flight_id, passenger_name, seat_number) VALUES ($1, $2, $3) RETURNING *',
      [passenger.flight_id, passenger.passenger_name, seatNumber]
    );

    res.status(200).json({
      message: 'Check-in successful',
      seatAssignment: seatAssignment.rows[0],
    });
  } catch (error) {
    console.error('Error during check-in', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { buyTicket, checkIn };
