import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';

const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  // Reference to the user menu dropdown
  const menuRef = useRef<HTMLDivElement>(null);

  // TODO: Replace with actual user data from auth context
  const user = {
    name: 'Aashray',
    email: 'aashrayinn@gmail.com',
    avatar: null
  };

  // Handle logout
  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-6 w-6" />
          )}
        </div>
        <span className="hidden md:inline">{user.name}</span>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800"
        >
          <div className="px-4 py-2 border-b">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={() => {
              setIsOpen(false);
              navigate('/profile');
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
          >
            <Settings size={16} className="mr-2" />
            Profile Settings
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-red-600"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
