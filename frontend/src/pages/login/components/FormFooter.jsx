import React from 'react';
import { FaShieldAlt, FaHeartbeat, FaClock } from 'react-icons/fa';

const FormFooter = () => {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
            <FaShieldAlt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Secure & Private</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your data is protected</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <FaHeartbeat className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">24/7 Access</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage health anytime</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
            <FaClock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Appointments</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">Book in minutes</p>
        </div>
      </div>
    </div>
  );
};

export default FormFooter;