const TEN_MINUTES = 10 * 60 * 1000;
const FIVE_MINUTES = 5 * 60 * 1000;

export const trackFlightBooking = (
  flightId: string,
  bookingHistory: Record<string, number[]>
): { shouldIncrease: boolean } => {
  const now = Date.now();
  const timestamps = bookingHistory[flightId] || [];

  // Filter only recent timestamps (within 10 minutes)
  const filtered = timestamps.filter((ts) => now - ts <= TEN_MINUTES);

  // Add new booking timestamp
  filtered.push(now);

  // Save back updated list
  bookingHistory[flightId] = filtered;

  // Count bookings within 5 min
  const recentBookings = filtered.filter((ts) => now - ts <= FIVE_MINUTES);

  return {
    shouldIncrease: recentBookings.length >= 3,
  };
};
