// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import { WalletProvider } from "./context/WalletContext";
import { BookingProvider } from "./context/BookingContext";
import FlightResultsPage from "./pages/FlightResultsPage";
import BookingPage from "./pages/BookingPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <WalletProvider>
      <BookingProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/results" element={<FlightResultsPage />} />
            <Route path="/book/:flightId" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          <Footer/>
        </Router>
      </BookingProvider>
    </WalletProvider>
  );
};

export default App;