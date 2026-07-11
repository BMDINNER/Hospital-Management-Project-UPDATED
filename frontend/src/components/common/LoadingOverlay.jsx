import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingOverlay = ({ message = 'Loading...', show = true }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl min-w-64">
        <div className="flex items-center space-x-3">
          <FaSpinner className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;