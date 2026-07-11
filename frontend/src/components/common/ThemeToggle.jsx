import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { MdLightMode, MdDarkMode } from 'react-icons/md';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <MdLightMode className={`w-5 h-5 text-yellow-500 transition-all duration-300 ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
        <MdDarkMode className={`w-5 h-5 text-gray-700 dark:text-gray-300 absolute transition-all duration-300 ${!isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;