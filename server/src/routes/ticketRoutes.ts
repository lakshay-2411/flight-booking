// routes/ticketRoutes.ts
import express from 'express';
import { generateTicket } from '../controllers/TicketController';

const router = express.Router();
router.get('/tickets/:bookingId', generateTicket);

export default router;