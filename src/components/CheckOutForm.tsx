import React, { useState, useEffect } from 'react';
import { Stay, Guest } from '../types';
import { getActiveStays, getGuestById, saveStay, updateRoomStatus } from '../utils/storage';
import { Search, Calendar } from 'lucide-react';

interface CheckOutFormProps {
  onComplete: () => void;
}

const CheckOutForm: React.FC<CheckOutFormProps> = ({ onComplete }) => {
  const [activeStays, setActiveStays] = useState<Array<Stay & { guest: Guest | undefined }>>([]);
  const [selectedStay, setSelectedStay] = useState<(Stay & { guest: Guest | undefined }) | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStays, setFilteredStays] = useState<Array<Stay & { guest: Guest | undefined }>>([]);
  const [checkOutDate, setCheckOutDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [paymentStatus, setPaymentStatus] = useState<Stay['paymentStatus']>('Completed');
  const [paymentMethod, setPaymentMethod] = useState<Stay['paymentMethod']>('Cash');
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get all active stays and attach guest information
    const stays = getActiveStays().map(stay => ({
      ...stay,
      guest: getGuestById(stay.guestId)
    }));
    setActiveStays(stays);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStays(activeStays);
    } else {
      const filtered = activeStays.filter(stay => 
        stay.guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stay.guest?.phone.includes(searchTerm) ||
        stay.roomNumber.includes(searchTerm)
      );
      setFilteredStays(filtered);
    }
  }, [searchTerm, activeStays]);

  const handleStaySelect = (stay: Stay & { guest: Guest | undefined }) => {
    setSelectedStay(stay);
    setPaymentStatus(stay.paymentStatus);
    setPaymentMethod(stay.paymentMethod);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedStay) {
      newErrors.stay = 'Please select an active stay';
    }
    
    if (!checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    } else {
      // Validate check-out date is not before check-in date
      if (selectedStay && new Date(checkOutDate) < new Date(selectedStay.checkInDate)) {
        newErrors.checkOutDate = 'Check-out date cannot be before check-in date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedStay) {
      // Update the stay with check-out information
      const updatedStay: Stay = {
        ...selectedStay,
        checkOutDate: new Date(checkOutDate).toISOString(),
        paymentStatus,
        paymentMethod,
        status: 'Completed'
      };
      
      // Save the updated stay and update room status to available
      saveStay(updatedStay);
      updateRoomStatus(updatedStay.roomNumber, 'Available');
      
      // Remove the checked-out stay from the active stays list
      setActiveStays(prevStays => prevStays.filter(stay => stay.id !== updatedStay.id));
      setSelectedStay(null);
      
      onComplete();
    }
  };

  const calculateStayDuration = (checkInDate: string, checkOutDate: string): number => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
  };


  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Check-Out</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Stay Selection Section */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Select Guest/Room</h3>
          
          {selectedStay ? (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-medium">{selectedStay.guest?.name || 'Unknown Guest'}</h4>
                  <p className="text-sm text-gray-500">Room {selectedStay.roomNumber}</p>
                  <p className="text-sm text-gray-500">
                    Check-in: {new Date(selectedStay.checkInDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStay(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by guest name, phone or room number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {filteredStays.length > 0 ? (
                <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-sm">
                  {filteredStays.map(stay => (
                    <div
                      key={stay.id}
                      onClick={() => handleStaySelect(stay)}
                      className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="font-medium">{stay.guest?.name || 'Unknown Guest'}</div>
                      <div className="text-sm text-gray-500 flex items-center justify-between">
                        <span>Room {stay.roomNumber}</span>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(stay.checkInDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeStays.length === 0 ? (
                <p className="text-center py-4 text-gray-500">No active stays found</p>
              ) : (
                <p className="text-center py-4 text-gray-500">No results found</p>
              )}
              
              {errors.stay && <p className="text-red-500 text-sm mt-1">{errors.stay}</p>}
            </div>
          )}
        </div>

        {/* Check-out Details Section */}
        {selectedStay && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Check-out Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date*
                </label>
                <input
                  type="date"
                  id="checkOutDate"
                  name="checkOutDate"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.checkOutDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkOutDate && <p className="text-red-500 text-sm mt-1">{errors.checkOutDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stay Duration
                </label>
                <p className="p-2 bg-gray-100 rounded-md">
                  {calculateStayDuration(selectedStay.checkInDate, checkOutDate)} days
                </p>
              </div>

              
              
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as Stay['paymentStatus'])}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Stay['paymentMethod'])}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onComplete}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedStay}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedStay
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Complete Check-out
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckOutForm;