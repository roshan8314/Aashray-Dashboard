import React from 'react';
import { Hotel, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Hotel className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-xl font-bold">Hotel Aashray</h1>
            <p className="text-xs text-yellow-400">Guest Management System</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-blue-800 transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;