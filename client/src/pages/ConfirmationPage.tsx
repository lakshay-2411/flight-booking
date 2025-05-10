// pages/ConfirmationPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { generateTicketPDF } from "../utils/pdfGenerator";
import { useEffect, useState } from "react";

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const [showConfetti, setShowConfetti] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    // Auto countdown to redirect if needed
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Booking Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't find the booking details you're looking for.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-200 w-full"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  // Parse passenger data if it's a JSON string
  let passengerData = [];
  try {
    passengerData =
      typeof booking.passenger === "string"
        ? JSON.parse(booking.passenger)
        : booking.passenger;
  } catch (e) {
    console.error("Error parsing passenger data", e);
  }

  const handleDownloadTicket = () => {
    generateTicketPDF(booking._id);
  };

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full confetti-container">
            {[...Array(50)].map((_, i) => {
              const size = Math.random() * 10 + 5;
              const left = Math.random() * 100;
              const animationDuration = Math.random() * 3 + 2;
              const delay = Math.random() * 2;
              const bg = [
                "bg-red-500",
                "bg-blue-500",
                "bg-green-500",
                "bg-yellow-500",
                "bg-purple-500",
              ][Math.floor(Math.random() * 5)];

              return (
                <div
                  key={i}
                  className={`absolute ${bg} rounded-sm confetti`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${left}%`,
                    top: "-10px",
                    animationDuration: `${animationDuration}s`,
                    animationDelay: `${delay}s`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Progress Steps - Complete */}
        <div className="mb-8 px-4 mt-12">
          <div className="flex items-center justify-between">
            {/* <div className="relative flex items-center w-full">
              <div className="w-full bg-green-500 h-1 rounded-full"></div>
              <div className="absolute w-full flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs mt-1">Search</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs mt-1">Passenger Details</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-xs mt-1">Confirmation</span>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 relative">
            <div className="absolute right-6 top-6">
              <div className="bg-green bg-opacity-20 rounded-full p-3">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-green-100">
                Your flight has been successfully booked
              </p>
            </div>
          </div>

          {/* Booking ID Banner */}
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap justify-between items-center">
            <div>
              <span className="text-gray-500 text-sm">Booking Reference</span>
              <p className="font-mono text-lg font-bold tracking-wider">
                {booking._id}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Confirmed
              </span>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              Flight Details
            </h3>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="mr-4">
                    <p className="text-xl font-bold text-gray-800">
                      {booking.from}
                    </p>
                    <p className="text-gray-500 text-sm">Departure</p>
                  </div>

                  <div className="mx-4 text-blue-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      ></path>
                    </svg>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-800">
                      {booking.to}
                    </p>
                    <p className="text-gray-500 text-sm">Arrival</p>
                  </div>
                </div>

                <div>
                  <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                    <p className="font-medium text-gray-800">
                      {formatDate(booking.journeyDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                {booking.flightDetails && (
                  <>
                    <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                      Airline: {booking.flightDetails.airline || "N/A"}
                    </span>
                    {booking.flightDetails.flightNumber && (
                      <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                        Flight: {booking.flightDetails.flightNumber}
                      </span>
                    )}
                  </>
                )}
                <span className="px-3 py-1 bg-white rounded-full shadow-sm">
                  Passengers: {booking.numPassengers}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Passenger Information
            </h3>

            {Array.isArray(passengerData) && passengerData.length > 0 ? (
              <div className="space-y-4">
                {passengerData.map((passenger, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 flex flex-wrap sm:flex-nowrap items-center"
                  >
                    <div className="flex-shrink-0 mr-4 mb-3 sm:mb-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </div>
                    </div>

                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">
                        {passenger.name}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-600">
                        <span>{passenger.age} years</span>
                        <span>•</span>
                        <span>{passenger.gender}</span>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Passenger {index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  {booking.numPassengers} passenger(s)
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownloadTicket}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center transition duration-200 flex-grow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Download E-Ticket
            </button>

            <button
              onClick={() => navigate("/")}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center justify-center transition duration-200"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            Important Information
          </h3>
          <div className="text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Your e-ticket has been sent to your registered email address.
              </li>
              <li>
                Please arrive at the airport at least 2 hours before the
                scheduled departure.
              </li>
              <li>
                Carry a valid photo ID for all passengers for verification at
                the airport.
              </li>
              <li>
                For any assistance, please contact our 24/7 customer support at
                1-800-FLY-HELP.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .confetti {
          position: absolute;
          animation: confettiFall linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationPage;
