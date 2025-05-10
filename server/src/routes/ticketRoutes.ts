// routes/ticketRoutes.ts
import express from 'express';
import { generateTicket } from '../controllers/ticketController';

const router = express.Router();
router.get('/tickets/:bookingId', generateTicket);

export default router;