import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  PlaneIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const BookingHistory: React.FC = () => {
  interface Booking {
    _id: string;
    flight: {
      price: number;
      airline: string;
      departureTime: string;
    };
    journeyDate: string;
    from: string;
    to: string;
    price: number;
    bookedOn: string;
    numPassengers: number;
  }

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching booking history:", error);
        setError(
          "Unable to load your booking history. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Format date and time for better display
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-xl flex items-center justify-center flex-col gap-4 h-50 shadow mt-25">
        <p className="text-red-600 font-medium text-center">{error}</p>
        <button
          className="mt-4 block mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-gray-50 p-12 rounded-xl shadow mt-6 text-center">
        <div className="mb-6 flex justify-center">
          <PlaneIcon size={48} className="text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg">
          No bookings found in your history.
        </p>
        <p className="text-gray-500 mt-2">
          Book your first flight to see your booking history here.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => (window.location.href = "/")}
        >
          Book A Flight
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-20">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-t-xl shadow">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <CalendarIcon className="mr-2" />
          Your Booking History
        </h2>
        <p className="text-blue-100 mt-2">
          Manage and review your {bookings.length} flight booking
          {bookings.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="bg-white shadow rounded-b-xl divide-y divide-gray-100">
        {bookings.map((booking, idx) => {
          // Parse the departure time for formatting
          const journeyDate = booking.journeyDate;
          const departureTime = booking.flight.departureTime;

          const fullDateTime = `${journeyDate}T${departureTime}`;
          const departureDate = new Date(fullDateTime);
          const formattedDepartureTime = departureDate.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={idx} className="p-6 hover:bg-blue-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <PlaneIcon className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {booking.flight.airline}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Booking ID: {booking._id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end">
                  <div className="flex items-center text-green-600 font-semibold">
                    <CreditCardIcon size={16} className="mr-1" />₹
                    {booking.flight.price * booking.numPassengers}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <ClockIcon size={12} className="mr-1" />
                    Booked on: {formatDateTime(booking.bookedOn)}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  {/* Flight path line */}
                  <div className="absolute left-3 top-6 w-full h-0.5 bg-gray-200 z-0"></div>

                  {/* Origin and destination */}
                  <div className="flex justify-between relative z-10">
                    <div className="text-center">
                      <div className="w-6 h-6 mx-auto rounded-full bg-blue-600 flex items-center justify-center">
                        <MapPinIcon size={14} className="text-white" />
                      </div>
                      <div className="mt-2 font-semibold text-gray-800">
                        {booking.from}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="w-6 h-6 mx-auto rounded-full bg-purple-600 flex items-center justify-center">
                        <MapPinIcon size={14} className="text-white" />
                      </div>
                      <div className="mt-2 font-semibold text-gray-800">
                        {booking.to}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-700">
                    <CalendarIcon size={16} className="mr-2 text-blue-600" />
                    <span className="font-medium">Departure: </span>
                    <span className="ml-2">{formattedDepartureTime}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingHistory;
