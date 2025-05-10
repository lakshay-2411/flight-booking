import React, { createContext, useState, useContext } from 'react';
import type { Flight } from '../types';

interface BookingRecord {
  flight: Flight;
  bookedAt: string;
  price: number;
}

interface BookingContextType {
  bookings: BookingRecord[];
  addBooking: (record: BookingRecord) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);

  const addBooking = (record: BookingRecord) => {
    setBookings((prev) => [...prev, record]);
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

export type { BookingRecord };
