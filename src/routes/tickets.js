const express = require('express');
const router = express.Router();
const { buyTicket, checkIn } = require('../controllers/ticketController');
const authenticateToken = require('../middleware/auth');

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Buy a ticket for a flight
 *     description: Book a ticket for a flight by specifying the flight number, date, and passenger names.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightNumber:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               passengerNames:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Success, ticket purchased
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Flight not found or sold out
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, buyTicket);

/**
 * @swagger
 * /api/tickets/checkin:
 *   put:
 *     summary: Check-in a passenger
 *     description: Check-in a passenger using the ticket number and assign a seat number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketNumber:
 *                 type: string
 *               seatNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Check-in successful
 *       404:
 *         description: Passenger not found
 *       500:
 *         description: Internal server error
 */
router.put('/checkin', checkIn);

module.exports = router;
