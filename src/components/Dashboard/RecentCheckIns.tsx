import React from 'react';
import { Stay, Guest } from '../../types';
import { getStays, getGuestById } from '../../utils/storage';
import { User, Calendar } from 'lucide-react';

const RecentCheckIns: React.FC = () => {
  const [recentCheckins, setRecentCheckins] = React.useState<Array<Stay & { guest: Guest | undefined }>>([]);

  React.useEffect(() => {
    // Get all active stays and sort by check-in date (most recent first)
    const activeStays = getStays()
      .filter(stay => stay.status === 'Active')
      .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
      .slice(0, 5); // Get only the 5 most recent

    // Attach guest information to each stay
    const staysWithGuests = activeStays.map(stay => ({
      ...stay,
      guest: getGuestById(stay.guestId)
    }));

    setRecentCheckins(staysWithGuests);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Check-ins</h2>
      
      {recentCheckins.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No recent check-ins</p>
      ) : (
        <div className="space-y-4">
          {recentCheckins.map((stay) => (
            <div key={stay.id} className="border-b pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{stay.guest?.name || 'Unknown Guest'}</h3>
                    <p className="text-sm text-gray-500">Room {stay.roomNumber}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar size={14} className="mr-1" />
                  {new Date(stay.checkInDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-800">
        View all check-ins
      </button>
    </div>
  );
};

export default RecentCheckIns;