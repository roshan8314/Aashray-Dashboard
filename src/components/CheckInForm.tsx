import React, { useState, useEffect } from 'react';
import { Guest, Stay, Room } from '../types';
import { getGuests, getAvailableRooms, generateId, saveStay, updateRoomStatus } from '../utils/storage';
import GuestForm from './GuestForm';
import { PlusCircle, Search } from 'lucide-react';

interface CheckInFormProps {
  onComplete: () => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onComplete }) => {
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  
  const [stayDetails, setStayDetails] = useState<Partial<Stay>>({
    roomNumber: '',
    checkInDate: new Date().toISOString().split('T')[0],
    adults: 1,
    children: 0,
    totalAmount: 0,
    paymentStatus: 'Pending',
    paymentMethod: 'Cash'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setGuests(getGuests());
    setAvailableRooms(getAvailableRooms());
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGuests([]);
    } else {
      const filtered = guests.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm) ||
        guest.idNumber.includes(searchTerm)
      );
      setFilteredGuests(filtered);
    }
  }, [searchTerm, guests]);

  const handleGuestSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    setSearchTerm('');
    setFilteredGuests([]);
  };

  const handleNewGuest = () => {
    setShowGuestForm(true);
    setSearchTerm('');
    setFilteredGuests([]);
  };

  const handleGuestSave = (guest: Guest) => {
    setGuests(getGuests()); // Refresh the guests list
    setSelectedGuest(guest);
    setShowGuestForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // If room selection changes, update the total amount
    if (name === 'roomNumber') {
      const selectedRoom = availableRooms.find(room => room.roomNumber === value);
      if (selectedRoom) {
        setStayDetails(prev => ({
          ...prev,
          [name]: value,
          totalAmount: selectedRoom.pricePerNight
        }));
      } else {
        setStayDetails(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setStayDetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedGuest) {
      newErrors.guest = 'Please select or create a guest';
    }
    
    if (!stayDetails.roomNumber) {
      newErrors.roomNumber = 'Please select a room';
    }
    
    if (!stayDetails.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && selectedGuest) {
      const newStay: Stay = {
        id: generateId(),
        guestId: selectedGuest.id,
        roomNumber: stayDetails.roomNumber || '',
        checkInDate: new Date(stayDetails.checkInDate || '').toISOString(),
        checkOutDate: null,
        adults: Number(stayDetails.adults) || 1,
        children: Number(stayDetails.children) || 0,
        totalAmount: Number(stayDetails.totalAmount) || 0,
        paymentStatus: stayDetails.paymentStatus as Stay['paymentStatus'] || 'Pending',
        paymentMethod: stayDetails.paymentMethod as Stay['paymentMethod'] || 'Cash',
        status: 'Active',
        createdAt: new Date().toISOString()
      };
      
      // Save the stay and update room status
      saveStay(newStay);
      updateRoomStatus(newStay.roomNumber, 'Occupied');
      
      // Reset form and notify parent
      setSelectedGuest(null);
      setStayDetails({
        roomNumber: '',
        checkInDate: new Date().toISOString().split('T')[0],
        adults: 1,
        children: 0,
        totalAmount: 0,
        paymentStatus: 'Pending',
        paymentMethod: 'Cash'
      });
      
      onComplete();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">New Check-In</h2>
      
      {showGuestForm ? (
        <div>
          <h3 className="text-lg font-medium mb-4">Guest Information</h3>
          <GuestForm onSave={handleGuestSave} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Guest Selection Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Guest Information</h3>
            
            {selectedGuest ? (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">{selectedGuest.name}</h4>
                    <p className="text-sm text-gray-500">{selectedGuest.phone}</p>
                    <p className="text-sm text-gray-500">{selectedGuest.idType}: {selectedGuest.idNumber}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGuest(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search guests by name, phone or ID"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNewGuest}
                    className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <PlusCircle size={16} className="mr-1" /> New Guest
                  </button>
                </div>
                
                {filteredGuests.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-sm">
                    {filteredGuests.map(guest => (
                      <div
                        key={guest.id}
                        onClick={() => handleGuestSelect(guest)}
                        className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-medium">{guest.name}</div>
                        <div className="text-sm text-gray-500 flex items-center justify-between">
                          <span>{guest.phone}</span>
                          <span>{guest.idType}: {guest.idNumber}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.guest && <p className="text-red-500 text-sm mt-1">{errors.guest}</p>}
              </div>
            )}
          </div>

          {/* Check-in Details Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Check-in Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Room*
                </label>
                <select
                  id="roomNumber"
                  name="roomNumber"
                  value={stayDetails.roomNumber}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.roomNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a room</option>
                  {availableRooms.map(room => (
                    <option key={room.roomNumber} value={room.roomNumber}>
                      Room {room.roomNumber} - {room.type} 
                    </option>
                  ))}
                </select>
                {errors.roomNumber && <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>}
              </div>

              <div>
                <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date*
                </label>
                <input
                  type="date"
                  id="checkInDate"
                  name="checkInDate"
                  value={stayDetails.checkInDate}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.checkInDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.checkInDate && <p className="text-red-500 text-sm mt-1">{errors.checkInDate}</p>}
              </div>

              <div>
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700 mb-1">
                  Adults
                </label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  min="1"
                  max="10"
                  value={stayDetails.adults}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="children" className="block text-sm font-medium text-gray-700 mb-1">
                  Children
                </label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  min="0"
                  max="10"
                  value={stayDetails.children}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
  <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700 mb-1">
    Amount (₹)
  </label>
  <input
    type="number"
    id="totalAmount"
    name="totalAmount"
    min="0"
    value={stayDetails.totalAmount}
    onChange={handleInputChange}
    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      errors.totalAmount ? 'border-red-500' : 'border-gray-300'
    }`}
  />
  {errors.totalAmount && (
    <p className="text-red-500 text-sm mt-1">
      {errors.totalAmount}
    </p>
  )}
</div>

              
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={stayDetails.paymentStatus}
                  onChange={handleInputChange}
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
                  name="paymentMethod"
                  value={stayDetails.paymentMethod}
                  onChange={handleInputChange}
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
              disabled={!selectedGuest}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedGuest
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Complete Check-in
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckInForm;