import React, { useState } from 'react';
import CheckOutForm from '../components/CheckOutForm';

const CheckOutPage: React.FC = () => {
  const [checkOutComplete, setCheckOutComplete] = useState(false);
  const [timeString, setTimeString] = useState<string>('');

  const handleCheckOutComplete = () => {
    const now = new Date();
    setTimeString(now.toLocaleTimeString());
    setCheckOutComplete(true);
    // Reset after showing success message
    setTimeout(() => {
      setCheckOutComplete(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Guest Check-Out
      </h1>

      {checkOutComplete ? (
        <div className="bg-green-50 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-600 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400 dark:text-green-300"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Check-out completed successfully at <strong>{timeString}</strong>!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md p-6">
          <CheckOutForm onComplete={handleCheckOutComplete} />
        </div>
      )}
    </div>
  );
};

export default CheckOutPage;
