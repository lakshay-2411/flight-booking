// components/Header.tsx
import React, { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const { balance } = useWallet();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md text-gray-800 shadow-lg py-6"
          : "bg-transparen bg-indigo-600 text-white py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transform transition-all duration-300 group-hover:scale-105 ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-300/30"
                    : "bg-white shadow-lg shadow-white/20"
                }`}
              >
                <svg
                  className={`w-6 h-6 ${
                    isScrolled ? "text-white" : "text-blue-600"
                  }`}
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
              <div className="ml-3 flex flex-col">
                <span
                  className={`font-extrabold text-xl tracking-tight transition-all duration-300 ${
                    isScrolled
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "text-white"
                  }`}
                >
                  Flight Booker
                </span>
                <span
                  className={`text-xs font-medium -mt-1 ${
                    isScrolled ? "text-gray-500" : "text-white/70"
                  }`}
                >
                  Travel Anywhere
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive("/")
                    ? isScrolled
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-white border-b-2 border-white pb-1"
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  <span>Search Flights</span>
                </div>
              </Link>
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive("/dashboard")
                    ? isScrolled
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-white border-b-2 border-white pb-1"
                    : isScrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>My Bookings</span>
                </div>
              </Link>
            </nav>

            {/* Wallet Section */}
            <div
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm"
                  : "bg-white/10 backdrop-blur-md text-white shadow-md shadow-white/10"
              }`}
            >
              <svg
                className={`w-4 h-4 mr-2 ${
                  isScrolled ? "text-blue-500" : "text-white"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              <span className="font-medium">
                ₹{balance.toLocaleString("en-IN")}
              </span>
            </div>

            {/* User Profile */}
            <div
              className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden border-2 ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-white hover:border-blue-300"
                  : "bg-white/10 backdrop-blur-md border-white/30 hover:border-white/80"
              }`}
            >
              <svg
                className={`w-5 h-5 group-hover:opacity-0 transition-opacity duration-300 ${
                  isScrolled ? "text-blue-600" : "text-white"
                }`}
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
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <svg
                  className={`w-5 h-5 ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md focus:outline-none transition-all duration-300 ${
                isScrolled
                  ? "text-blue-600 hover:bg-blue-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md"
              : "bg-gradient-to-b from-blue-600 to-indigo-700"
          } shadow-xl animate-slideDown`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive("/")
                  ? isScrolled
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                    : "bg-white/10 text-white"
                  : isScrolled
                  ? "text-gray-700 hover:bg-gray-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                Search Flights
              </div>
            </Link>
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                isActive("/dashboard")
                  ? isScrolled
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700"
                    : "bg-white/10 text-white"
                  : isScrolled
                  ? "text-gray-700 hover:bg-gray-50"
                  : "text-white hover:bg-white/10"
              }`}
            >
              <div className="flex items-center">
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
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                My Bookings
              </div>
            </Link>

            {/* Mobile Wallet Display */}
            <div
              className={`flex items-center px-3 py-3 rounded-md ${
                isScrolled
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                  : "bg-white/5 shadow-inner shadow-black/10"
              }`}
            >
              <svg
                className={`w-6 h-6 mr-3 ${
                  isScrolled ? "text-blue-500" : "text-white/90"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                ></path>
              </svg>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isScrolled ? "text-gray-500" : "text-white/70"
                  }`}
                >
                  Wallet Balance
                </p>
                <p
                  className={`font-bold text-lg ${
                    isScrolled
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
                      : "text-white"
                  }`}
                >
                  ₹{balance.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Mobile User Section */}
            <div
              className={`flex items-center px-3 py-3 rounded-md ${
                isScrolled ? "bg-gray-50" : "bg-white/5"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  isScrolled
                    ? "bg-gradient-to-r from-blue-100 to-indigo-100"
                    : "bg-white/10"
                }`}
              >
                <svg
                  className={`w-5 h-5 ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
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
              <div>
                <p
                  className={`text-sm font-medium ${
                    isScrolled ? "text-gray-500" : "text-white/70"
                  }`}
                >
                  Account
                </p>
                <p
                  className={`font-medium ${
                    isScrolled ? "text-blue-600" : "text-white"
                  }`}
                >
                  View Profile
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Gradient Overlay (only when not scrolled) */}
      {!isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent -z-10"></div>
      )}
    </header>
  );
};

export default Header;
