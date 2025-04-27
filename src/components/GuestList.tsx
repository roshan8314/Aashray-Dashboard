import React, { useState, useEffect } from 'react';
import { Guest } from '../types';
import { getGuests, deleteGuest } from '../utils/storage';
import { Search, Edit, Trash2, UserPlus } from 'lucide-react';
import GuestForm from './GuestForm';

const GuestList: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadedGuests = getGuests();
    setGuests(loadedGuests);
    setFilteredGuests(loadedGuests);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredGuests(guests);
    } else {
      const filtered = guests.filter(guest => 
        guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.phone.includes(searchTerm) ||
        guest.idNumber.includes(searchTerm) ||
        guest.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGuests(filtered);
    }
  }, [searchTerm, guests]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      deleteGuest(id);
      setGuests(prevGuests => prevGuests.filter(guest => guest.id !== id));
    }
  };

  const handleGuestSave = (guest: Guest) => {
    setGuests(getGuests());
    setEditingGuest(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {showAddForm ? (
        <div>
          <h2 className="text-xl font-semibold mb-6">
            {editingGuest ? 'Edit Guest' : 'Add New Guest'}
          </h2>
          <GuestForm 
            existingGuest={editingGuest || undefined} 
            onSave={handleGuestSave} 
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Guest Directory</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus size={16} className="mr-2" />
              Add Guest
            </button>
          </div>
          
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, phone, ID, or email"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {filteredGuests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGuests.map(guest => (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-gray-900">{guest.name}</div>
                            <div className="text-sm text-gray-500">{guest.gender}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{guest.phone}</div>
                        <div className="text-sm text-gray-500">{guest.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{guest.idType}</div>
                        <div className="text-sm text-gray-500">{guest.idNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(guest)}
                            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                            title="Edit guest"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="p-1.5 rounded-full text-red-600 hover:bg-red-100 hover:text-red-800 transition-colors"
                            title="Delete guest"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {guests.length === 0 ? (
                <div>
                  <p className="mb-4">No guests have been added yet.</p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <UserPlus size={16} className="mr-2" />
                    Add Your First Guest
                  </button>
                </div>
              ) : (
                <p>No guests found matching your search.</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuestList;