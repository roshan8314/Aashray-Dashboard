import React from 'react';
import { getRooms } from '../../utils/storage';

const RoomOccupancy: React.FC = () => {
  const [occupancyData, setOccupancyData] = React.useState({
    available: 0,
    occupied: 0,
    maintenance: 0,
    total: 0
  });

  React.useEffect(() => {
    const rooms = getRooms();
    const total = rooms.length;
    const available = rooms.filter(room => room.status === 'Available').length;
    const occupied = rooms.filter(room => room.status === 'Occupied').length;
    const maintenance = rooms.filter(room => room.status === 'Maintenance').length;
    
    setOccupancyData({ available, occupied, maintenance, total });
  }, []);

  const occupancyPercentage = Math.round((occupancyData.occupied / occupancyData.total) * 100) || 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Room Occupancy</h2>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-500">Occupancy Rate</span>
        <span className="font-bold">{occupancyPercentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${occupancyPercentage}%` }}
        ></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Available</p>
          <p className="text-xl font-bold text-green-600">{occupancyData.available}</p>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Occupied</p>
          <p className="text-xl font-bold text-blue-600">{occupancyData.occupied}</p>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-sm text-gray-500">Maintenance</p>
          <p className="text-xl font-bold text-amber-600">{occupancyData.maintenance}</p>
        </div>
      </div>
    </div>
  );
};

export default RoomOccupancy;