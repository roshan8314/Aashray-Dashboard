import React, { useState, useEffect } from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import RecentCheckIns from '../components/Dashboard/RecentCheckIns';
import RoomOccupancy from '../components/Dashboard/RoomOccupancy';
import { Users, Home, CreditCard, Calendar } from 'lucide-react';
import { getGuests, getStays, getRooms } from '../utils/storage';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalGuests: 0,
    activeStays: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    // Get data for dashboard stats
    const guests = getGuests();
    const stays = getStays();
    const rooms = getRooms();
    
    const activeStays = stays.filter(stay => stay.status === 'Active');
    const totalRevenue = stays.reduce((sum, stay) => sum + stay.totalAmount, 0);
    const occupiedRooms = rooms.filter(room => room.status === 'Occupied').length;
    const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
    
    setStats({
      totalGuests: guests.length,
      activeStays: activeStays.length,
      totalRevenue,
      occupancyRate
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Guests" 
          value={stats.totalGuests} 
          icon={Users} 
          color="bg-blue-600"
        />
        <StatsCard 
          title="Current Guests" 
          value={stats.activeStays} 
          icon={Home} 
          color="bg-green-600"
          percentage={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue.toLocaleString()}`} 
          icon={CreditCard} 
          color="bg-yellow-600"
          percentage={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="Occupancy Rate" 
          value={`${stats.occupancyRate}%`} 
          icon={Calendar} 
          color="bg-purple-600"
          percentage={{ value: 5, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCheckIns />
        <RoomOccupancy />
      </div>
    </div>
  );
};

export default DashboardPage;