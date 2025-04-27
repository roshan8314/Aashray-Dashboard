import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Wifi, Wind, ParkingMeter as Parking, PhoneCall, MapPin, Lock, LogOut } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const navigate = useNavigate();

  // Sync dark mode class on <html>
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add actual password change logic/validation here
    setShowPasswordForm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    // TODO: Add logout logic (clear auth, redirect to login)
    console.log('Logging out...');
    onLogout(); // Trigger the logout handler passed as a prop
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>

      {/* Hotel Information */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Hotel Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Hotel className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Hotel Name</h3>
              <p className="text-gray-500 dark:text-gray-400">Hotel Aashray</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <PhoneCall className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Contact Number</h3>
              <p className="text-gray-500 dark:text-gray-400">+91 8092447566</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <MapPin className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">Address</h3>
              <p className="text-gray-500 dark:text-gray-400">Shyamdih, Dhanbad, Jharkhand, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border dark:border-gray-700 rounded-lg flex flex-col items-center">
            <Wifi size={24} className="text-blue-600 dark:text-blue-300 mb-2" />
            <span className="text-gray-800 dark:text-gray-100">Free WiFi</span>
          </div>
          <div className="p-4 border dark:border-gray-700 rounded-lg flex flex-col items-center">
            <Wind size={24} className="text-blue-600 dark:text-blue-300 mb-2" />
            <span className="text-gray-800 dark:text-gray-100">Air Conditioning</span>
          </div>
          <div className="p-4 border dark:border-gray-700 rounded-lg flex flex-col items-center">
            <Parking size={24} className="text-blue-600 dark:text-blue-300 mb-2" />
            <span className="text-gray-800 dark:text-gray-100">Parking</span>
          </div>
          <div className="p-4 border dark:border-gray-700 rounded-lg flex flex-col items-center">
            <Hotel size={24} className="text-blue-600 dark:text-blue-300 mb-2" />
            <span className="text-gray-800 dark:text-gray-100">Room Service</span>
          </div>
        </div>
      </section>

      {/* Account Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Account Settings</h2>
        {showPasswordForm ? (
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button type="button" onClick={() => setShowPasswordForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Change Password
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowPasswordForm(true)} className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md">
            <Lock size={16} className="mr-2" />
            Change Password
          </button>
        )}
      </section>

      {/* System Settings */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">System Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={darkMode}
                onChange={e => setDarkMode(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 peer-checked:after:border-white" />
            </label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
