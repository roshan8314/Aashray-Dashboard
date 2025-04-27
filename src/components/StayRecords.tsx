import React, { useState, useEffect } from 'react';
import { Stay, Guest } from '../types';
import { getStays, getGuestById } from '../utils/storage';
import { Search, Calendar, FileText, Download } from 'lucide-react';

type StayWithGuest = Stay & { guest: Guest | undefined };

const StayRecords: React.FC = () => {
  const [stays, setStays] = useState<StayWithGuest[]>([]);
  const [filteredStays, setFilteredStays] = useState<StayWithGuest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Get all stays and attach guest information
    const allStays = getStays().map(stay => ({
      ...stay,
      guest: getGuestById(stay.guestId)
    }));
    
    // Sort by check-in date (most recent first)
    allStays.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
    
    setStays(allStays);
    setFilteredStays(allStays);
  }, []);

  useEffect(() => {
    let filtered = [...stays];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(stay => 
        statusFilter === 'active' 
          ? stay.status === 'Active' 
          : stay.status === 'Completed'
      );
    }
    
    // Filter by date range
    if (dateFilter.startDate) {
      filtered = filtered.filter(stay => 
        new Date(stay.checkInDate) >= new Date(dateFilter.startDate)
      );
    }
    
    if (dateFilter.endDate) {
      filtered = filtered.filter(stay => {
        // For completed stays, check checkout date
        if (stay.checkOutDate) {
          return new Date(stay.checkOutDate) <= new Date(dateFilter.endDate);
        }
        // For active stays, check check-in date
        return new Date(stay.checkInDate) <= new Date(dateFilter.endDate);
      });
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(stay => 
        stay.guest?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stay.guest?.phone.includes(searchTerm) ||
        stay.roomNumber.includes(searchTerm) ||
        stay.id.includes(searchTerm)
      );
    }
    
    setFilteredStays(filtered);
  }, [searchTerm, statusFilter, dateFilter, stays]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['ID', 'Guest Name', 'Room', 'Check-in', 'Check-out', 'Duration', 'Amount', 'Status'];
    
    const rows = filteredStays.map(stay => [
      stay.id,
      stay.guest?.name || 'Unknown',
      stay.roomNumber,
      new Date(stay.checkInDate).toLocaleDateString(),
      stay.checkOutDate ? new Date(stay.checkOutDate).toLocaleDateString() : 'N/A',
      stay.checkOutDate 
        ? Math.ceil((new Date(stay.checkOutDate).getTime() - new Date(stay.checkInDate).getTime()) / (1000 * 60 * 60 * 24)) 
        : 'N/A',
      stay.totalAmount,
      stay.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `stay_records_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all stay records?");
  if (confirmClear) {
    setStays([]);
    setFilteredStays([]);
    localStorage.removeItem('stays');
  }
  };

  const getStatusClass = (status: Stay['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Stay Records</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Download size={16} className="mr-2" />
            Export CSV
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search by guest name, room or phone"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Stays</option>
            <option value="active">Active Stays</option>
            <option value="completed">Completed Stays</option>
          </select>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="date"
            name="startDate"
            value={dateFilter.startDate}
            onChange={handleDateFilterChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="From"
          />
          <input
            type="date"
            name="endDate"
            value={dateFilter.endDate}
            onChange={handleDateFilterChange}
            className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="To"
          />
        </div>
      </div>
      
      {filteredStays.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStays.map(stay => (
                <tr key={stay.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{stay.guest?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{stay.guest?.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Room {stay.roomNumber}</div>
                    <div className="text-sm text-gray-500">
                      {stay.adults} adult{stay.adults !== 1 && 's'}
                      {stay.children > 0 && `, ${stay.children} child${stay.children !== 1 && 'ren'}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {new Date(stay.checkInDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {stay.checkOutDate 
                        ? new Date(stay.checkOutDate).toLocaleDateString()
                        : 'Not checked out'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{stay.totalAmount}</div>
                    <div className="text-sm text-gray-500">{stay.paymentStatus}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(stay.status)}`}>
                      {stay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-800 transition-colors">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {stays.length === 0 ? (
            <p>No stay records available yet.</p>
          ) : (
            <p>No records found matching your search criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StayRecords;
