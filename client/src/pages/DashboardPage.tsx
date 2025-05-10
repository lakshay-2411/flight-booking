// pages/DashboardPage.tsx
import React from 'react';
import BookingHistory from '../components/BookingHistory';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold"></h1>
          
        </div>
        
        <BookingHistory />
      </div>
    </div>
  );
};

export default DashboardPage;