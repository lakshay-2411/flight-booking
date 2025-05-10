// controllers/FlightController.ts
import { Request, Response } from "express";
import { Flight } from "../models/Flight";

// Dynamic pricing logic
function calculateDynamicPrice(flight: any): number {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentBookings = flight.bookingAttempts.filter(
    (attempt: { timestamp: Date }) => attempt.timestamp > fiveMinutesAgo
  );

  if (recentBookings.length >= 3) {
    return flight.price * 1.1; // 10% increase
  }
  return flight.price;
}

// Clean up old booking attempts
async function cleanupOldBookingAttempts() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  await Flight.updateMany(
    {},
    { $pull: { bookingAttempts: { timestamp: { $lt: tenMinutesAgo } } } }
  );
}

// Utility to inject from/to into each flight
function attachRouteToFlights(flights: any[], from: string, to: string) {
  return flights.map((flight) => {
    const flightObj = flight.toObject();
    const dynamicPrice = calculateDynamicPrice(flight);

    return {
      ...flightObj,
      from,
      to,
      currentPrice: dynamicPrice,
    };
  });
}

export const getFlights = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      res.status(400).json({ error: "From and To query params are required" });
      return;
    }

    // Clean up old booking attempts to reset prices
    await cleanupOldBookingAttempts();

    // Fetch 10 random flights
    const allFlights = await Flight.find().limit(10);

    // Inject from/to dynamically and calculate dynamic prices
    const updatedFlights = attachRouteToFlights(
      allFlights,
      from as string,
      to as string
    );

    res.json(updatedFlights);
  } catch (err) {
    console.error("Error fetching flights:", err);
    res.status(500).json({ error: "Failed to fetch flights" });
  }
};

export const getFlightDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("Fetching flight details...");
    
    const { flightId } = req.params;
    console.log("Flight ID:", flightId);
    
    const flight = await Flight.findById(flightId);

    if (!flight) {
      res.status(404).json({ error: "Flight not found" });
      return;
    }
    const dynamicPrice = calculateDynamicPrice(flight);
    res.json({ ...flight.toObject(), currentPrice: dynamicPrice });
  } catch (err) {
    console.error("Error fetching flight details:", err);
    res.status(500).json({ error: "Failed to fetch flight details" });
  }
};

// Record a booking attempt
export const recordBookingAttempt = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { flightId } = req.body;

    if (!flightId) {
      res.status(400).json({ error: "Flight ID is required" });
      return;
    }

    const flight = await Flight.findById(flightId);

    if (!flight) {
      res.status(404).json({ error: "Flight not found" });
      return;
    }

    flight.bookingAttempts.push({ timestamp: new Date() });
    await flight.save();

    const dynamicPrice = calculateDynamicPrice(flight);

    res.json({
      flightId,
      price: flight.price,
      currentPrice: dynamicPrice,
    });
  } catch (err) {
    console.error("Error recording booking attempt:", err);
    res.status(500).json({ error: "Failed to record booking attempt" });
  }
};
