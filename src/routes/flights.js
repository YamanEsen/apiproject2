const express = require('express');
const router = express.Router();
const { addFlight, queryFlights, getFlightPassengers } = require('../controllers/flightController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /api/flights:
 *   post:
 *     summary: Add a new flight to the system
 *     description: Adds a new flight, including details such as date, duration, and capacity.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dateFrom:
 *                 type: string
 *                 format: date-time
 *               dateTo:
 *                 type: string
 *                 format: date-time
 *               airportFrom:
 *                 type: string
 *               airportTo:
 *                 type: string
 *               duration:
 *                 type: integer
 *               capacity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Flight successfully added
 *       401:
 *         description: Unauthorized (invalid token)
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, addFlight);

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Query available flights based on the provided filters
 *     description: Query available flights by filters like date, airports, etc.
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: airportFrom
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: airportTo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of flights
 *       400:
 *         description: Missing required query parameters
 *       404:
 *         description: No flights found
 *       500:
 *         description: Internal server error
 */
router.get('/', queryFlights);

/**
 * @swagger
 * /api/flights/passengers:
 *   get:
 *     summary: Get a list of passengers for a flight
 *     description: Query the passenger list for a specific flight.
 *     parameters:
 *       - in: query
 *         name: flightId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of passengers
 *       400:
 *         description: Flight ID is required
 *       404:
 *         description: No passengers found
 *       500:
 *         description: Internal server error
 */
router.get('/passengers', getFlightPassengers);

module.exports = router;
