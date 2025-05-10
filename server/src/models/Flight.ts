// models/Flight.ts
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  price: Number, // Original price
  currentPrice: Number, // Dynamic price that changes
  departureTime: String,
  arrivalTime: String,
  bookingAttempts: [{ timestamp: Date }], // Track booking attempts
});

export const Flight = mongoose.model('Flight', flightSchema);