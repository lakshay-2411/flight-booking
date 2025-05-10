// components/FlightCard.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Flight } from "../types";
import {
  Award,
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  Luggage,
  MonitorSmartphone,
  Plane,
  Users,
  Utensils,
  Wifi,
} from "lucide-react";

interface Props {
  flight: Flight;
  passengers?: string;
  date?: string;
}

export const FlightCard: React.FC<Props> = ({ flight, passengers, date }) => {
  const [currentPrice, setCurrentPrice] = useState(
    flight.currentPrice || flight.price
  );
  const [isBooking, setIsBooking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  // Calculate flight duration
  const calculateDuration = () => {
    try {
      // Parse departure and arrival times
      const [depHours, depMinutes] = flight.departureTime
        .split(":")
        .map(Number);
      const [arrHours, arrMinutes] = flight.arrivalTime.split(":").map(Number);

      // Calculate total minutes
      let durationMinutes =
        arrHours * 60 + arrMinutes - (depHours * 60 + depMinutes);

      // Handle overnight flights
      if (durationMinutes < 0) {
        durationMinutes += 24 * 60;
      }

      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      return {
        formatted: `${hours}h ${minutes}m`,
        hours,
        minutes,
        totalMinutes: durationMinutes,
      };
    } catch (error) {
      return {
        formatted: "Duration N/A",
        hours: 0,
        minutes: 0,
        totalMinutes: 0,
      };
    }
  };

  const handleBook = async () => {
    try {
      setIsBooking(true);
      // Record booking attempt for dynamic pricing
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/flights/booking-attempt`,
        {
          flightId: flight._id,
        }
      );

      // Navigate to booking page with relevant flight details
      navigate(
        `/book/${flight._id}?from=${flight.from}&to=${flight.to}&date=${
          date || new Date().toISOString().split("T")[0]
        }&passengers=${passengers}`
      );

      // Refresh flight price in background
      const flightsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/flights`,
        {
          params: { from: flight.from, to: flight.to },
        }
      );

      const updatedFlight = flightsResponse.data.find(
        (f: Flight) => f._id === flight._id
      );
      if (updatedFlight) {
        setCurrentPrice(updatedFlight.currentPrice || updatedFlight.price);
      }
    } catch (error) {
      console.error("Error preparing booking:", error);
      alert("Failed to prepare booking. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  // Generate a random aircraft code
  const getAircraftCode = () => {
    const manufacturers = ["B", "A"];
    const types = ["737", "320", "777", "350", "787", "330"];
    return `${manufacturers[Math.floor(Math.random() * manufacturers.length)]}${
      types[Math.floor(Math.random() * types.length)]
    }`;
  };

  const getLogoUrl = (airline: string) => {
    // This is a placeholder - in a real app, we would have actual airline logos
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      airline
    )}&background=random&color=fff&size=128`;
  };

  // Format location
  const formatLocation = (location: string) => {
    const cityName = location.split("(")[0].trim();
    const code = location.match(/\(([^)]+)\)/)
      ? location.match(/\(([^)]+)\)/)?.[1]
      : "";
    return { cityName, code };
  };

  // Format time
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      const period = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return {
        time: `${displayHours}:${minutes.toString().padStart(2, "0")}`,
        period,
      };
    } catch (e) {
      return { time: timeString, period: "" };
    }
  };

  // Get departure and arrival locations
  const departure = formatLocation(flight.from);
  const arrival = formatLocation(flight.to);

  // Get formatted times
  const departureTime = formatTime(flight.departureTime);
  const arrivalTime = formatTime(flight.arrivalTime);

  // Calculate duration
  const duration = calculateDuration();

  // Generate random flight amenities
  const amenities = [
    { name: "Wi-Fi", icon: <Wifi size={14} />, available: Math.random() > 0.3 },
    {
      name: "In-flight Meals",
      icon: <Utensils size={14} />,
      available: Math.random() > 0.5,
    },
    {
      name: "Entertainment",
      icon: <MonitorSmartphone size={14} />,
      available: Math.random() > 0.4,
    },
    {
      name: "Power Outlets",
      icon: <Briefcase size={14} />,
      available: Math.random() > 0.3,
    },
    {
      name: "Extra Legroom",
      icon: <Users size={14} />,
      available: Math.random() > 0.7,
    },
  ];

  // Generate random price data
  const originalPrice = Math.floor(currentPrice * 1.1);
  const discountPercentage = Math.floor(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
  const showDiscount = Math.random() > 0.5;

  // Generate flight number
  const flightNumber = `${flight.airline.substring(0, 2).toUpperCase()}${
    Math.floor(Math.random() * 9000) + 1000
  }`;

  // Get date display
  const flightDate = date ? new Date(date) : new Date();
  const formattedDate = flightDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Random seat availability
  const availableSeats = Math.floor(Math.random() * 30) + 1;
  const lowAvailability = availableSeats < 10;

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden hover:shadow-xl hover:scale-102 transition-all duration-300 shadow-lg border border-gray-100`}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Colored top border based on airline */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${stringToHslColor(
              flight.airline,
              60,
              70
            )} 0%, ${stringToHslColor(flight.airline, 40, 50)} 100%)`,
          }}
        ></div>

        {/* Main card content */}
        <div className="p-5">
          {/* Top row with airline info and price */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 mr-3 shadow-sm">
                <img
                  src={getLogoUrl(flight.airline)}
                  alt={`${flight.airline} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{flight.airline}</h3>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <span className="mr-2">{flightNumber}</span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
                    {getAircraftCode()}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              {showDiscount && (
                <div className="mb-1">
                  <span className="text-xs line-through text-gray-400 mr-1">
                    ₹{originalPrice}
                  </span>
                  <span className="text-xs font-medium text-green-600">
                    {discountPercentage}% off
                  </span>
                </div>
              )}
              <div className="flex items-center justify-end">
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{currentPrice}
                </span>
                {lowAvailability && (
                  <span className="ml-2 px-1.5 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded">
                    {availableSeats} left
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">per passenger</p>
            </div>
          </div>

          {/* Journey timeline */}
          <div className="flex items-center justify-between mb-5">
            {/* Departure */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-semibold text-gray-900 flex items-baseline">
                  {departureTime.time}
                  <span className="text-xs text-gray-500 ml-1">
                    {departureTime.period}
                  </span>
                </p>
                <p className="font-medium text-gray-800">{departure.code}</p>
                <p
                  className="text-xs text-gray-500 mt-1 max-w-24 truncate"
                  title={departure.cityName}
                >
                  {departure.cityName}
                </p>
              </div>
            </div>

            {/* Flight path visualization */}
            <div className="flex-1 mx-4 flex flex-col items-center justify-center">
              <div className="flex items-center text-xs text-gray-500 mb-2 font-medium">
                <Clock size={12} className="mr-1" />
                <span>{duration.formatted}</span>
                <span className="mx-2">•</span>
                <span>Direct</span>
              </div>
              <div className="relative w-full">
                <div className="absolute w-full h-px bg-gray-300 top-1/2 transform -translate-y-1/2"></div>
                <div className="absolute left-0 w-3 h-3 rounded-full bg-indigo-600 top-1/2 transform -translate-y-1/2 z-10"></div>
                <div className="absolute right-0 w-3 h-3 rounded-full bg-indigo-600 top-1/2 transform -translate-y-1/2 z-10"></div>

                {/* Flight path with animated plane */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-full">
                  <div className="">
                    <Plane
                      size={18}
                      className="text-indigo-600 transform translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="text-center">
              <div className="flex flex-col items-center">
                <p className="text-2xl font-semibold text-gray-900 flex items-baseline">
                  {arrivalTime.time}
                  <span className="text-xs text-gray-500 ml-1">
                    {arrivalTime.period}
                  </span>
                </p>
                <p className="font-medium text-gray-800">{arrival.code}</p>
                <p
                  className="text-xs text-gray-500 mt-1 max-w-24 truncate"
                  title={arrival.cityName}
                >
                  {arrival.cityName}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row with date and booking button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={14} className="mr-1.5" />
                {formattedDate}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users size={14} className="mr-1.5" />
                {passengers || "1"}{" "}
                {parseInt(passengers || "1") > 1 ? "Passengers" : "Passenger"}
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={isBooking}
              className={`px-6 py-2 rounded-lg font-medium text-white transition-all
                ${
                  isBooking
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-sm hover:shadow"
                }`}
            >
              {isBooking ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing
                </span>
              ) : (
                "Book Now"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable details section */}
      <div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full hover:cursor-pointer flex items-center justify-center px-3 py-5 border-t border-gray-100 text-sm text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          {showDetails ? "Hide details" : "View details"}
          <ChevronDown
            size={16}
            className={`ml-1 transform transition-transform ${
              showDetails ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDetails && (
          <div className="border-t border-gray-100 p-4 bg-gray-50 animate-expandHeight">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">
                  Flight Information
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center text-gray-600">
                    <span className="w-32 text-gray-500">Flight Number:</span>
                    <span className="font-medium">{flightNumber}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-32 text-gray-500">Aircraft:</span>
                    <span className="font-medium">{getAircraftCode()}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-32 text-gray-500">Duration:</span>
                    <span className="font-medium">{duration.formatted}</span>
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-32 text-gray-500">Distance:</span>
                    <span className="font-medium">
                      {Math.floor(duration.totalMinutes * 7.5)} km
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2 text-sm">
                  Amenities & Services
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <span
                        className={`mr-2 ${
                          amenity.available ? "text-green-500" : "text-gray-400"
                        }`}
                      >
                        {amenity.icon}
                      </span>
                      <span
                        className={
                          amenity.available
                            ? "text-gray-700"
                            : "text-gray-400 line-through"
                        }
                      >
                        {amenity.name}
                      </span>
                      {amenity.available && amenity.name === "Wi-Fi" && (
                        <span className="ml-1 px-1 bg-green-100 text-green-700 text-xs rounded">
                          Free
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center">
                  <Luggage size={14} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    Baggage allowance: 15kg (Check-in) + 7kg (Cabin)
                  </span>
                </div>
              </div>
            </div>

            {/* Fare information */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2 text-sm flex items-center">
                <Award size={14} className="mr-2" />
                Fare Benefits
              </h4>
              <div className="flex space-x-4">
                <div className="bg-green-50 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Free Cancellation
                </div>
                <div className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Instant Refund
                </div>
                <div className="bg-purple-50 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                  Earn Rewards
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helper functions */}
      <style>{`
        
      `}</style>
    </div>
  );
};

// Helper function to generate consistent colors from strings
function stringToHslColor(str: string, saturation: number, lightness: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
