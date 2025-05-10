// scripts/seedFlights.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Flight } from '../models/Flight';

dotenv.config();

const airlines = ['IndiGo', 'SpiceJet', 'Air India', 'Vistara', 'GoAir'];
const flightNumbers = ['IG123', 'SJ456', 'AI789', 'VS012', 'GA345'];

const generateRandomTime = () => {
  const hour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

const generateRandomPrice = () => {
  // Random price between 2000 and 3000
  return Math.floor(Math.random() * 1001) + 2000;
};

const seedFlights = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing flights
    await Flight.deleteMany({});
    
    // Create 20 sample flights
    const flightsData = Array.from({ length: 20 }, (_, i) => ({
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: flightNumbers[Math.floor(Math.random() * flightNumbers.length)] + i,
      price: generateRandomPrice(),
      currentPrice: 0, // Will be calculated dynamically
      departureTime: generateRandomTime(),
      arrivalTime: generateRandomTime(),
      bookingAttempts: []
    }));
    
    await Flight.insertMany(flightsData);
    console.log('Database seeded with flight data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedFlights();