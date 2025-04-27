import React from 'react';
import StayRecords from '../components/StayRecords';

const RecordsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Stay Records</h1>
      <StayRecords />
    </div>
  );
};

export default RecordsPage;