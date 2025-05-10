import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  passenger: String,
  from: String,
  to: String,
  journeyDate: String,
  numPassengers: Number,
  bookedOn: { type: Date, default: Date.now },
});

export const Booking = mongoose.model('Booking', bookingSchema);
