import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@bmdinner/logreg';

const Layout = ({ children }) => {
  const { isDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/patient" className="text-xl font-bold text-gray-900 dark:text-white">
                  Hospital App
                </Link>
                <div className="hidden md:flex ml-10 space-x-4">
                  <Link to="/patient" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Dashboard
                  </Link>
                  <Link to="/appointments" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Appointments
                  </Link>
                  <Link to="/prescriptions" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Prescriptions
                  </Link>
                  <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Profile
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;