import type { Flight } from "../types";

const airlines = ['Indigo', 'SpiceJet', 'Air India', 'GoAir'];

export const mockFlights = (from: string, to: string): Flight[] => {
  if (!from || !to) return [];

  return Array.from({ length: 10 }).map((_, index) => ({
    id: `${from}-${to}-${index}`,
    from,
    to,
    airline: airlines[index % airlines.length],
    time: `${8 + index}:00 AM`,
    price: Math.floor(2000 + Math.random() * 1000), // Rs 2,000 - Rs 3,000
  }));
};
