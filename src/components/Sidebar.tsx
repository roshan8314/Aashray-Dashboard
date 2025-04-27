import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  LogIn, 
  LogOut, 
  Users, 
  Clipboard, 
  Settings, 
  HelpCircle, 
  Menu,
  X
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/check-in', icon: <LogIn size={20} />, label: 'Check In' },
    { to: '/check-out', icon: <LogOut size={20} />, label: 'Check Out' },
    { to: '/guests', icon: <Users size={20} />, label: 'Guests' },
    { to: '/records', icon: <Clipboard size={20} />, label: 'Records' },
    { to: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    { to: '/help', icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  const sidebarClasses = `bg-gray-100 text-blue-900 h-screen fixed top-0 pt-16 shadow-lg transition-all duration-300 ${
    isMobileOpen ? 'left-0 w-64' : '-left-64 md:left-0 w-64'
  }`;

  return (
    <>
      <button 
        className="md:hidden fixed top-4 right-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={sidebarClasses}>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-900 text-white' 
                        : 'hover:bg-blue-100'
                    }`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;