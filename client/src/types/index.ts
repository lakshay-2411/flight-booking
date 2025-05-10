// types/index.ts
export interface Flight {
  _id: string;                // Comes from MongoDB
  id?: string;                // For compatibility with existing code
  from: string;
  to: string;
  airline: string;
  flightNumber?: string;      // Added from backend model
  price: number;
  currentPrice?: number;      // Added for dynamic pricing
  departureTime: string;
  arrivalTime: string;
  time?: string;              // For compatibility with existing code
}