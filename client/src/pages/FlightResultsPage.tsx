// pages/FlightResultsPage.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import type { Flight } from "../types";
import { FlightCard } from "../components/FlightCard";
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  Sliders,
  Users,
  X,
} from "lucide-react";
import AirportInput from "../components/AirportInput";

const FlightResultsPage = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const date = params.get("date") || new Date().toISOString().split("T")[0];
  const passengers = params.get("passengers") || "1";
  const [fromCity, setFrom] = useState(from);
  const [toCity, setTo] = useState(to);

  // Local state for modify search
  const [showModifySearch, setShowModifySearch] = useState(false);
  const [localDate, setLocalDate] = useState(date);
  const [localPassengers, setLocalPassengers] = useState(passengers);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("price-asc");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [timeFilters, setTimeFilters] = useState({
    morning: true,
    afternoon: true,
    evening: true,
    night: true,
  });
  const [airlinesFilter, setAirlinesFilter] = useState<string[]>([]);

  // Get unique airlines from flights
  const availableAirlines = [
    ...new Set(flights.map((flight) => flight.airline)),
  ];

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/flights`,
          {
            params: {
              from: params.get("from"),
              to: params.get("to"),
            },
          }
        );

        // Map backend flights to include a time property for compatibility
        const mappedFlights = res.data.map((flight: Flight) => ({
          ...flight,
          time: `${flight.departureTime} - ${flight.arrivalTime}`, // For compatibility
          id: flight._id, // For compatibility
        }));

        setFlights(mappedFlights);
        setFilteredFlights(mappedFlights);

        // Initialize price range based on actual data
        if (mappedFlights.length > 0) {
          const prices = mappedFlights.map((f: Flight) => f.price);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));
          setPriceRange([minPrice, maxPrice]);
        }

        // Initialize airlines filter with all available airlines
        setAirlinesFilter(availableAirlines);
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [searchParams, fromCity, toCity]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...flights];

    // Apply airline filter
    if (airlinesFilter.length > 0) {
      result = result.filter((flight) =>
        airlinesFilter.includes(flight.airline)
      );
    }

    // Apply price filter
    result = result.filter(
      (flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );

    // Apply time filters
    result = result.filter((flight) => {
      const hour = parseInt(flight.departureTime.split(":")[0]);

      if (hour >= 5 && hour < 12 && !timeFilters.morning) return false;
      if (hour >= 12 && hour < 17 && !timeFilters.afternoon) return false;
      if (hour >= 17 && hour < 21 && !timeFilters.evening) return false;
      if ((hour >= 21 || hour < 5) && !timeFilters.night) return false;

      return true;
    });

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration":
          return calculateDuration(a) - calculateDuration(b);
        case "departure":
          return getMinutes(a.departureTime) - getMinutes(b.departureTime);
        default:
          return a.price - b.price;
      }
    });
    setFilteredFlights(result);
  }, [flights, sortBy, priceRange, timeFilters, airlinesFilter]);

  // Helper functions
  const calculateDuration = (flight: Flight) => {
    const depTime = getMinutes(flight.departureTime);
    const arrTime = getMinutes(flight.arrivalTime);
    return arrTime > depTime ? arrTime - depTime : 24 * 60 - depTime + arrTime;
  };

  const getMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatLocation = (location: string) => {
    return location.split("(")[0].trim();
  };

  const handleModifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Update search params
    const newParams = new URLSearchParams();
    newParams.set("from", fromCity);
    newParams.set("to", toCity);
    newParams.set("date", localDate);
    newParams.set("passengers", localPassengers);

    setSearchParams(newParams);
    setShowModifySearch(false);
  };

  const getTimeOfDayLabel = (index: number) => {
    switch (index) {
      case 0:
        return { label: "Morning", time: "5am - 12pm", key: "morning" };
      case 1:
        return { label: "Afternoon", time: "12pm - 5pm", key: "afternoon" };
      case 2:
        return { label: "Evening", time: "5pm - 9pm", key: "evening" };
      case 3:
        return { label: "Night", time: "9pm - 5am", key: "night" };
      default:
        return { label: "", time: "", key: "" };
    }
  };

  const toggleAirlineFilter = (airline: string) => {
    if (airlinesFilter.includes(airline)) {
      setAirlinesFilter(airlinesFilter.filter((a) => a !== airline));
    } else {
      setAirlinesFilter([...airlinesFilter, airline]);
    }
  };

  const resetFilters = () => {
    setSortBy("price-asc");
    setPriceRange([
      Math.floor(Math.min(...flights.map((f) => f.price))),
      Math.ceil(Math.max(...flights.map((f) => f.price))),
    ]);
    setTimeFilters({
      morning: true,
      afternoon: true,
      evening: true,
      night: true,
    });
    setAirlinesFilter(availableAirlines);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search summary */}
      <div className="bg-indigo-600 text-white py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">
            <br />
            <br />
          </h1>

          {/* Search Summary Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 flex-grow">
              <div>
                <p className="text-xs text-blue-100">From</p>
                <p className="font-semibold">{formatLocation(from)}</p>
              </div>
              <div className="hidden md:block">
                <ArrowRight size={20} />
              </div>
              <div>
                <p className="text-xs text-blue-100">To</p>
                <p className="font-semibold">{formatLocation(to)}</p>
              </div>
              <div className="hidden md:block border-l border-white/20 pl-6">
                <p className="text-xs text-blue-100">Date</p>
                <p className="font-semibold">
                  {new Date(date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="hidden md:block border-l border-white/20 pl-6">
                <p className="text-xs text-blue-100">Passengers</p>
                <p className="font-semibold">{passengers}</p>
              </div>
            </div>
            <button
              onClick={() => setShowModifySearch(!showModifySearch)}
              className="mt-3 md:mt-0 bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              {showModifySearch ? "Hide Search" : "Modify Search"}
            </button>
          </div>

          {/* Collapsible Modify Search Form */}
          {showModifySearch && (
            <div className="mt-4 bg-white rounded-lg shadow-lg p-6 animate-slideDown">
              <form onSubmit={handleModifySearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative text-black">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From
                    </label>
                    <AirportInput
                      label=""
                      value={fromCity}
                      onChange={setFrom}
                    />
                  </div>

                  <div className="relative text-black">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <AirportInput label="" value={toCity} onChange={setTo} />
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={localDate}
                        onChange={(e) => setLocalDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                      />
                      {/* <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" /> */}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passengers
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="9"
                        value={localPassengers}
                        onChange={(e) => setLocalPassengers(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        required
                      />
                      <Users className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModifySearch(false)}
                    className="mr-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Search Flights
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Searching for the best flights...
            </p>
          </div>
        ) : filteredFlights.length > 0 ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div className="w-full md:w-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {filteredFlights.length}{" "}
                  {filteredFlights.length === 1 ? "Flight" : "Flights"} Found
                </h2>
                <p className="text-gray-500">
                  {flights.length !== filteredFlights.length &&
                    `Showing ${filteredFlights.length} of ${flights.length} flights`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 text-sm flex items-center">
                  <span className="mr-2 text-gray-700">Sort by:</span>
                  <select
                    className="bg-transparent focus:outline-none text-gray-800"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`bg-white px-4 py-2 rounded-lg shadow-sm border ${
                    showFilters
                      ? "border-blue-400 text-blue-600"
                      : "border-gray-200 text-gray-700"
                  } text-sm flex items-center`}
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  Filters
                  {showFilters ? (
                    <ChevronDown className="h-4 w-4 ml-2 transform rotate-180" />
                  ) : (
                    <ChevronDown className="h-4 w-4 ml-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 animate-slideDown">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Filters
                  </h3>
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm hover:underline flex items-center"
                  >
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    Reset all filters
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Price Range
                    </h4>
                    <div className="px-2">
                      <div className="flex justify-between mb-2 text-sm text-gray-600">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min={Math.floor(
                          Math.min(...flights.map((f) => f.price))
                        )}
                        max={Math.ceil(
                          Math.max(...flights.map((f) => f.price))
                        )}
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([
                            parseInt(e.target.value),
                            priceRange[1],
                          ])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min={Math.floor(
                          Math.min(...flights.map((f) => f.price))
                        )}
                        max={Math.ceil(
                          Math.max(...flights.map((f) => f.price))
                        )}
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([
                            priceRange[0],
                            parseInt(e.target.value),
                          ])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer -mt-1"
                      />
                    </div>
                  </div>

                  {/* Time of Day Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Departure Time
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[0, 1, 2, 3].map((index) => {
                        const { label, time, key } = getTimeOfDayLabel(index);
                        return (
                          <div
                            key={key}
                            onClick={() =>
                              setTimeFilters({
                                ...timeFilters,
                                [key]:
                                  !timeFilters[key as keyof typeof timeFilters],
                              })
                            }
                            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                              timeFilters[key as keyof typeof timeFilters]
                                ? "bg-blue-50 border-blue-300"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="font-medium text-sm">{label}</div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Airlines Filter */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">Airlines</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {availableAirlines.map((airline) => (
                        <div key={airline} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`airline-${airline}`}
                            checked={airlinesFilter.includes(airline)}
                            onChange={() => toggleAirlineFilter(airline)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor={`airline-${airline}`}
                            className="ml-2 text-sm text-gray-700"
                          >
                            {airline}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Flight Cards */}
            <div className="space-y-6">
              {filteredFlights.map((flight) => (
                <FlightCard
                  key={flight._id}
                  flight={flight}
                  date={date}
                  passengers={passengers}
                />
              ))}
            </div>

            {/* No results after filtering */}
            {filteredFlights.length === 0 && flights.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Flights Match Your Filters
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to see more results.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Flights Found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any flights matching your search criteria.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try a Different Search
            </button>
          </div>
        )}
      </div>

      {/* Add this to your CSS */}
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out forwards;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
        `}
      </style>
    </div>
  );
};

export default FlightResultsPage;
