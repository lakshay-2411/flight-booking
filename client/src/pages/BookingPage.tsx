// pages/BookingPage.tsx
import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useWallet } from "../context/WalletContext";
import { useBooking } from "../context/BookingContext";

const BookingPage = () => {
  const { flightId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { deductAmount } = useWallet();
  const { addBooking } = useBooking();

  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const passengerCount = Number(params.get("passengers") || 1);
  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount }, () => ({
      name: "",
      age: "",
      gender: "",
    }))
  );

  useEffect(() => {
    const fetchFlightDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/flightDetails/${flightId}`
        );
        setFlight(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flight details:", error);
        alert("Failed to load flight details");
        setLoading(false);
      }
    };

    fetchFlightDetails();
  }, [flightId]);

  const handleInput = (i: number, field: string, value: string) => {
    const updated = [...passengers];
    updated[i][field as keyof (typeof updated)[0]] = value;
    setPassengers(updated);
  };

  const handleBooking = async () => {
    // Validate all passengers have data
    const isValid = passengers.every((p) => p.name && p.age && p.gender);
    if (!isValid) {
      alert("Please fill in all passenger details");
      return;
    }

    try {
      // Deduct money from wallet
      const price =
        flight?.currentPrice * passengerCount || flight?.price * passengerCount;
      if (!deductAmount(price)) {
        alert("Insufficient wallet balance!");
        return;
      }

      // Create booking
      const res = await axios.post("http://localhost:4000/api/bookings", {
        flight: flightId,
        from: params.get("from"),
        to: params.get("to"),
        journeyDate: params.get("date"),
        passenger: JSON.stringify(passengers),
        numPassengers: passengers.length,
      });

      // Add to booking context
      const bookingTime = new Date().toLocaleString();
      addBooking({
        flight: flight,
        bookedAt: bookingTime,
        price: price,
      });

      // Navigate to confirmation page with booking data
      navigate("/confirmation", { state: { booking: res.data } });
    } catch (error) {
      console.error("Error booking flight:", error);
      alert("Failed to book flight. Please try again.");
    }
  };

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

      return `${hours}h ${minutes}m`;
    } catch (error) {
      return "Duration N/A";
    }
  };

  const nextStep = () => {
    // Validate current passenger before moving to next
    if (activeStep < passengers.length - 1) {
      const currentPassenger = passengers[activeStep];
      if (
        !currentPassenger.name ||
        !currentPassenger.age ||
        !currentPassenger.gender
      ) {
        alert("Please fill in all details for the current passenger");
        return;
      }
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading flight details...
          </p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
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
          <h2 className="text-xl font-bold text-gray-800">Flight Not Found</h2>
          <p className="text-gray-600 mt-2">
            We couldn't find the flight you're looking for.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition duration-200"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-25">
      <div className="max-w-5xl mx-auto">
        {/* Booking Progress Steps */}
        <div className="mb-8 px-4 mt-12">
          <div className="flex items-center justify-between">
            <div className="relative flex items-center w-full">
              <div className="w-full bg-gray-200 h-1 rounded-full">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
              <div className="absolute -top-4 -left-2 w-full flex justify-between">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    1
                  </div>
                  <span className="text-xs mt-1">Search</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                    2
                  </div>
                  <span className="text-xs mt-1">Passenger Details</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                    3
                  </div>
                  <span className="text-xs mt-1">Confirmation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mt-14">
          {/* Flight Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
            <h2 className="text-2xl font-bold">Passenger Details</h2>
            <p className="text-blue-100">
              Complete the information below to proceed with your booking
            </p>
          </div>

          {/* Flight Summary */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mr-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
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
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {flight.airline}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Flight{" "}
                    {flight.flightNumber || "ID: " + flightId!.substring(0, 8)}
                  </p>
                </div>
              </div>

              <div className="flex-1 min-w-full sm:min-w-0 sm:ml-8">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-bold text-gray-800">
                      {params.get("from")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {flight.departureTime || "Departure"}
                    </p>
                  </div>

                  <div className="flex-1 mx-2 sm:mx-6 relative">
                    <div className="border-t-2 border-gray-300 border-dashed relative">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-50">
                        <svg
                          className="w-6 h-6 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M12 5l7 7-7 7"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-gray-800">
                      {params.get("to")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {flight.arrivalTime || "Arrival"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span>Date: {params.get("date")}</span>
                  <span>Duration: {calculateDuration() || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-6 bg-white border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Price Details</h3>
                <p className="text-sm text-gray-500">
                  {passengerCount}{" "}
                  {passengerCount > 1 ? "Passengers" : "Passenger"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹
                  {flight.currentPrice * passengerCount ||
                    flight.price * passengerCount}
                </p>
              </div>
            </div>
          </div>

          {/* Passenger Form Stepper */}
          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">
                Passenger {activeStep + 1} of {passengerCount}
              </h3>
              {passengerCount > 1 && (
                <div className="flex space-x-2">
                  {passengers.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-3 h-3 rounded-full ${
                        idx === activeStep ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    ></div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    placeholder="Enter passenger's full name"
                    className="border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none p-3 rounded-lg w-full transition"
                    value={passengers[activeStep].name}
                    onChange={(e) =>
                      handleInput(activeStep, "name", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      placeholder="Age"
                      type="number"
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none p-3 rounded-lg w-full transition"
                      value={passengers[activeStep].age}
                      onChange={(e) =>
                        handleInput(activeStep, "age", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      className="border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none p-3 rounded-lg w-full transition bg-white"
                      value={passengers[activeStep].gender}
                      onChange={(e) =>
                        handleInput(activeStep, "gender", e.target.value)
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={prevStep}
                  disabled={activeStep === 0}
                  className={`py-3 px-6 rounded-lg border ${
                    activeStep === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
                  } transition`}
                >
                  Previous
                </button>

                {activeStep < passengers.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="py-3 px-6 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Next Passenger
                  </button>
                ) : (
                  <button
                    onClick={handleBooking}
                    className="py-3 px-6 rounded-lg bg-green-600 text-white hover:bg-green-700 transition flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    Proceed to Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3">
            Important Information
          </h3>
          <div className="text-sm text-gray-600">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Please ensure all passenger details match their identification
                documents.
              </li>
              <li>
                Check-in typically opens 24 hours before the scheduled
                departure.
              </li>
              <li>
                Baggage allowance depends on your ticket class and airline
                policy.
              </li>
              <li>
                For any changes to your booking, please contact customer
                support.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
