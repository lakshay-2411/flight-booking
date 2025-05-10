import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const createBooking = async (req: Request, res: Response) => {
  const { flight, passenger, from, to, journeyDate, numPassengers } = req.body;

  const booking = new Booking({
    flight,
    passenger,
    from,
    to,
    journeyDate,
    numPassengers,
  });

  await booking.save();
  res.status(201).json(booking);
};

export const getBookings = async (_req: Request, res: Response) => {
  const bookings = await Booking.find().populate('flight');
  res.json(bookings);
};
