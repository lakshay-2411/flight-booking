import express from 'express';
import { createBooking, getBookings } from '../controllers/bookingController';

const router = express.Router();

router.post('/bookings', createBooking);
router.get('/bookings', getBookings);

export default router;
