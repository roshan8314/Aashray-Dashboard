import React, { useState } from 'react';
import { Guest, IDType } from '../types';
import { generateId, saveGuest } from '../utils/storage';

interface GuestFormProps {
  existingGuest?: Guest;
  onSave: (guest: Guest) => void;
}

// Render a form to create or edit a guest, without an email field
const GuestForm: React.FC<GuestFormProps> = ({ existingGuest, onSave }) => {
  // Remove email from state
  const [formData, setFormData] = useState<Omit<Guest, 'id' | 'email'>>( {
    name: existingGuest?.name || '',
    gender: existingGuest?.gender || 'Male',
    phone: existingGuest?.phone || '',
    address: existingGuest?.address || '',
    idType: existingGuest?.idType || 'Aadhar Card',
    idNumber: existingGuest?.idNumber || '',
    notes: existingGuest?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const IDTypes: IDType[] = [
    'Aadhar Card',
    'Passport',
    'Driving License',
    'Voter ID',
    'PAN Card',
    'Other'
  ];

  // Validate required fields, remove email validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    else if (
      formData.idType === 'Aadhar Card' &&
      !/^\d{12}$/.test(formData.idNumber)
    ) {
      newErrors.idNumber = 'Aadhar Card must be 12 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const guest: Guest = {
      id: existingGuest?.id || generateId(),
      ...formData,
      
    };
    saveGuest(guest);
    onSave(guest);
  };

  const idTypes: IDType[] = [
    'Aadhar Card',
    'Passport',
    'Driving License',
    'Voter ID',
    'PAN Card',
    'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Guest Name*
          </label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number*
          </label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={2}
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ID Type */}
        <div>
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700">
            ID Type*
          </label>
          <select
            id="idType"
            name="idType"
            value={formData.idType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {idTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* ID Number */}
        <div>
          <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
            ID Number*
          </label>
          <input
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 ${
              errors.idNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => onSave(existingGuest as Guest)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {existingGuest ? 'Update Guest' : 'Save Guest'}
        </button>
      </div>
    </form>
  );
};

export default GuestForm;
