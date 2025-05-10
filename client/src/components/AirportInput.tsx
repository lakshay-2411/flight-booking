// src/components/AirportInput.tsx
import React, { useState, useEffect, useRef } from "react";
import { searchAirports } from "../services/airportSuggest";
import type { Airport } from "../services/airportSuggest";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const AirportInput: React.FC<Props> = ({
  label,
  value,
  onChange,
  placeholder = "Enter city or airport",
}) => {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setHasFocus(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (value.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchAirports(value);
          setSuggestions(results);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching airport suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [value]);

  const handleSelect = (airport: Airport) => {
    onChange(`${airport.cityName} - ${airport.name} (${airport.iataCode})`);
    setShowDropdown(false);
  };

  // Determine if we should show the empty state (no results)
  const showEmptyState =
    !isLoading && showDropdown && value.length >= 2 && suggestions.length === 0;

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className={`relative transition-all duration-200 ${
          hasFocus ? "scale-[1.01]" : ""
        }`}
      >
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
            hasFocus ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <svg
            className="w-5 h-5 transition-all duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setHasFocus(true);
            if (value.length >= 2) setShowDropdown(true);
          }}
          className={`w-full border rounded-xl py-3 pl-10 pr-10 shadow-sm transition-all duration-300
            ${
              hasFocus
                ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50"
                : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            }
          `}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-500"
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
          </div>
        )}
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown with loading, empty state, and suggestions */}
      {showDropdown && value.length >= 2 && (
        <div className="absolute w-full mt-1 z-10">
          <ul
            ref={dropdownRef}
            className="bg-white border border-gray-200 w-full max-h-64 overflow-auto rounded-xl shadow-lg transition-all duration-300 animate-fadeIn"
            style={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Empty state - no results */}
            {showEmptyState && (
              <li className="px-4 py-8 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <svg
                    className="w-10 h-10 mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-gray-500 font-medium">No airports found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try a different search term
                  </p>
                </div>
              </li>
            )}

            {/* Results list */}
            {suggestions.map((airport) => (
              <li
                key={airport.iataCode}
                onClick={() => handleSelect(airport)}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center">
                  <div className="text-blue-600 mr-3 bg-blue-50 p-2 rounded-full">
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {airport.cityName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center flex-wrap">
                      <span className="truncate mr-2">{airport.name}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {airport.iataCode}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2 text-gray-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Little help text under the input */}
      <div className="mt-1 text-xs text-gray-500 pl-1">
        {!value && "Start typing the city or airport name"}
        {value.length === 1 && "Type at least 2 characters to search"}
      </div>
    </div>
  );
};

export default AirportInput;
