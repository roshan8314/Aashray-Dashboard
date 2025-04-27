import React from 'react';
import GuestList from '../components/GuestList';

const GuestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Guest Directory</h1>
      <GuestList />
    </div>
  );
};

export default GuestsPage;